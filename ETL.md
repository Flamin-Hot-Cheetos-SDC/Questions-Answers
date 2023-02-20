### Load data into mongoDB

Manually delete headers from the original csv files to be able to set field types when importing data.
Use mongoimport with specified field types and stop option for any errors that occur during the import.

##### Answers
- Import all answers:
   mongoimport --db=qanda --collection=answers --file="./data/answers.csv" --type=csv --columnsHaveTypes --fields="answer_id.double(),question_id.double(),body.string(),date.double(),answerer_name.string(),email.string(),reported.boolean(),helpfulness.double()" --parseGrace=stop

- Import sample answers:
   mongoimport --db=test --collection=answers --file="./sample_data/a.csv" --type=csv --columnsHaveTypes --fields="id.double(),question_id.double(),body.string(),date.double(),username.string(),email.string(),reported.boolean(),helpfulness.double()" --parseGrace=stop

##### Questions
- Import all questions:
   mongoimport --db=qanda --collection=questions --file="./data/questions.csv" --type=csv --columnsHaveTypes --fields="question_id.double(),product_id.double(),question_body.string(),question_date.double(),asker_name.string(),email.string(),reported.boolean(),question_helpfulness.double()" --parseGrace=stop

- Import sample questions:
   mongoimport --db=test --collection=questions --file="./sample_data/q.csv" --type=csv --columnsHaveTypes --fields="id.double(),product_id.double(),body.string(),date.double(),username.string(),email.string(),reported.boolean(),helpfulness.double()" --parseGrace=stop

##### Photos
- Import all photos:
   mongoimport --db=qanda --collection=photos --file=answers_photos.csv --type=csv --columnsHaveTypes --fields="id.double(),answer_id.double(),url.string()" --parseGrace=stop

- Import sample photos:
   mongoimport --db=test --collection=photos --file="./sample_data/p1.csv" --type=csv --columnsHaveTypes --fields="id.double(),answer_id.double(),url.string()" --parseGrace=stop

#### Result
All three files were imported without any errors. The numbers returned after running db.collection.count() on every collection are equal to the number of rows in corresponding csv.

### Aggregation

#### Embed photos array into answers
Perform lookup on answers collection matching on "answer_id" and "id" fields, and excluding "_id" and "answer_id" fields from the final result. Use $out to replace the original answers collection with the result of aggregation

db.answers.aggregate([
  {
    "$lookup": {
      "from": "photos",
      "localField": "id",
      "foreignField": "answer_id",
      "as": "photos"
    }
  },
  {
    "$project": {
      "photos._id": 0,
      "photos.answer_id": 0
    }
  },
  {
    "$out" : "answers"
  }
])

db.answers.aggregate([ { "$lookup": { "from": "photos", "localField": "answer_id", "foreignField": "answer_id", "as": "photos" } }, { "$project": { "photos._id": 0, "photos.answer_id": 0 } }, {"$out" : "answers"} ])

#### Embed an object of answers into question object (GET /qa/questions query)

Goal: question object needs to have a property answers with value being an object where key is answer_id and value is the answer object.

The following gives correct output. The only thing that might cause issues later is the fact that answer_id value had to be converted into a string ($map expects k to be a string):
db.questions.aggregate([
  {
    $match: {
      product_id: 104,
      reported: false
    }
  },
  {
    "$lookup": {
      "from": "answers",
      "let": {
        "q_id": "$question_id"
      },
      "pipeline": [
        {
          "$match": {
            "$expr": {
              "$eq": [
                "$question_id",
                "$$q_id"
              ]
            },
            reported: false
          }
        },
        {
          "$lookup": {
            "from": "photos",
            "localField": "answer_id",
            "foreignField": "answer_id",
            "as": "photos"
          }
        },
        {
          "$project": {
            "email": 0,
            "reported": 0,
            "question_id": 0,

          }
        }
      ],
      "as": "answers"
    }
  },
  {
    "$addFields": {
      answers: {
        "$arrayToObject": {
          $map: {
            input: "$answers",
            in: {
              k: {
                $toString: "$$this.answer_id"
              },
              v: "$$this"
            }
          }
        }
      }
    }
  },
  {
    $group: {
      _id: "$product_id",
      results: {
        $push: {
          "_id": "$_id",
          "answers": "$answers",
          "asker_name": "$asker_name",
          "question_body": "$question_body",
          "question_date": "$question_date",
          "question_helpfulness": "$question_helpfulness",
          "question_id": "$question_id",
          "reported": "$reported"
        }
      }
    }
  },
  {
    $set: {
      product_id: "$_id"
    }
  },
  {
    $unset: "_id"
  }
])

Testing bottom 10% product_id: 900009, 978689, 1000005, 985235, 967651

- Aggregation query:
   db.questions.aggregate([ { $match: { product_id: 967651, reported: false } }, { "$lookup": { "from": "answers", "let": { "q_id": "$question_id" }, "pipeline": [ { "$match": { "$expr": { "$eq": [ "$question_id", "$$q_id" ] }, reported: false } }, { "$lookup": { "from": "photos", "localField": "answer_id", "foreignField": "answer_id", "as": "photos" } }, { "$project": { "email": 0, "reported": 0, "question_id": 0, } } ], "as": "answers" } }, { "$addFields": { answers: { "$arrayToObject": { $map: { input: "$answers", in: { k: { $toString: "$$this.answer_id" }, v: "$$this" } } } } } }, { $group: { _id: "$product_id", results: { $push: { "_id": "$_id", "answers": "$answers", "asker_name": "$asker_name", "question_body": "$question_body", "question_date": "$question_date", "question_helpfulness": "$question_helpfulness", "question_id": "$question_id", "reported": "$reported" } } } }, { $set: { product_id: "$_id" } }, { $unset: "_id" }], {allowDiskUse: true}).explain("executionStats")

- Aggregation query that doesn't entirely conform to the expected output:
   db.questions.aggregate([ { $match: { product_id: 5003, reported: false } }, { "$lookup": { "from": "answers", "let": { "q_id": "$question_id" }, "pipeline": [ { "$match": { "$expr": { "$eq": [ "$question_id", "$$q_id" ] }, reported: false } }, { "$lookup": { "from": "photos", "localField": "answer_id", "foreignField": "answer_id", "as": "photos" } }, { "$project": { "email": 0, "reported": 0, "question_id": 0, } } ], "as": "answers" } }, { "$addFields": { answers: { "$arrayToObject": { $map: { input: "$answers", in: { k: { $toString: "$$this.answer_id" }, v: "$$this" } } } } } }, { "$project": { "email": 0, } } ], {allowDiskUse: true}).explain("executionStats")

- Aggregation query without photos:
   db.questions.aggregate([ { $match: { product_id: 104 } }, { "$lookup": { "from": "answers", "let": { "q_id": "$question_id" }, "pipeline": [ { "$match": { "$expr": { "$eq": [ "$question_id", "$$q_id" ] } } }, { "$project": { "email": 0, "reported": 0, "question_id": 0, } } ], "as": "answers" } }, { "$addFields": { answers: { "$arrayToObject": { $map: { input: "$answers", in: { k: { $toString: "$$this.answer_id" }, v: "$$this" } } } } } }, { "$project": { "email": 0, } }
])

- Something else that might be useful later in some way: for questions with multiple answers it creates separate objects with the question and singular answer object:
   db.questions.aggregate([
    {
      "$lookup": {
        "from": "answers",
        "localField": "id",
        "foreignField": "question_id",
        "as": "answers"
      }
    },
    {
      "$unwind": "$answers"
    }
  ])

  db.answers.aggregate([
    {
      "$lookup": {
        "from": "photos",
        "localField": "answers.answer_id",
        "foreignField": "answer_id",
        "as": "photos"
      }
    },
    {
      "$project": {
        "photos._id": 0,
        "photos.answer_id": 0
      }
    },
  ])