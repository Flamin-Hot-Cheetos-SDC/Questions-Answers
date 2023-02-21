### Aggregation

#### Embed an object of answers with their respective photos into question object (GET /qa/questions query)

Goal: question object needs to have a property answers with value being an object where key is answer_id and value is the answer object.

  db.questions.aggregate([
    {
      $match: {
        product_id: 104,
        reported: false
      }
    },
    {
      $sort: {
        question_id: 1
      }
    },
    {
      $limit: 5
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
            "reported": "$reported",
            "photos": "$photos"
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

  - Flattened version for the query:
    - db.questions.aggregate([ { $match: { product_id: Number(pid), reported: false } }, { $sort: { question_id: 1 } }, { $limit: Number(count) }, { "$lookup": { "from": "answers", "let": { "q_id": "$question_id" }, "pipeline": [ { "$match": { "$expr": { "$eq": [ "$question_id", "$$q_id" ] }, reported: false } }, { "$project": { "email": 0, "reported": 0, "question_id": 0, } } ], "as": "answers" } }, { "$addFields": { answers: { "$arrayToObject": { $map: { input: "$answers", in: { k: { $toString: "$$this.answer_id" }, v: "$$this" } } } } } }, { $group: { _id: "$product_id", results: { $push: { "_id": "$_id", "answers": "$answers", "asker_name": "$asker_name", "question_body": "$question_body", "question_date": "$question_date", "question_helpfulness": "$question_helpfulness", "question_id": "$question_id", "reported": "$reported" } } } }, { $set: { product_id: "$_id" } }, { $unset: "_id" }], {allowDiskUse: true}).explain("executionStats")

  - Flattened version for testing bottom 10% product_id (product_id to use: 900009, 978689, 1000005, 985235, 967651)
    - db.questions.aggregate([ { $match: { product_id: 985235, reported: false } }, { $sort: { question_id: 1 } }, { $limit: 5 }, { "$lookup": { "from": "answers", "let": { "q_id": "$question_id" }, "pipeline": [ { "$match": { "$expr": { "$eq": [ "$question_id", "$$q_id" ] }, reported: false } }, { "$project": { "email": 0, "reported": 0, "question_id": 0, } } ], "as": "answers" } }, { "$addFields": { answers: { "$arrayToObject": { $map: { input: "$answers", in: { k: { $toString: "$$this.answer_id" }, v: "$$this" } } } } } }, { $group: { _id: "$product_id", results: { $push: { "_id": "$_id", "answers": "$answers", "asker_name": "$asker_name", "question_body": "$question_body", "question_date": "$question_date", "question_helpfulness": "$question_helpfulness", "question_id": "$question_id", "reported": "$reported" } } } }, { $set: { product_id: "$_id" } }, { $unset: "_id" }], {allowDiskUse: true}).explain("executionStats")

#### Get answers list (GET /qa/questions/:question_id/answers)

- Aggregation query:
    db.answers.aggregate([
    {
      $match: {
        question_id: Number(question_id),
        reported: false
      }
    },
    {
      $sort: {
        answer_id: -1
      }
    },
    {
      $limit: Number(count)
    },
    {
      "$project": {
        "email": 0,
        "reported": 0,
        "question_id": 0,
      }
    },
    {
      $group: {
        _id: Number(question_id),
        results: {
          $push: {
            "_id": "$_id",
            "answer_id": "$answer_id",
            "answerer_name": "$answerer_name",
            "body": "$body",
            "date": "$date",
            "helpfulness": "$helpfulness",
            "photos": "$photos"
          }
        }
      }
    },
    {
      $set: {
        question: "$_id",
        page: Number(page),
        count: Number(count),

      }
    },
    {
      $unset: "_id"
    }
  ])

Testing bottom 10% question_id: 3167053, 3245067, 3456178, 3518275, 3518954
  db.answers.aggregate([ { $match: { question_id: 3518954, reported: false } }, { $sort: { answer_id: -1 } }, { $limit: 5 }, { "$project": { "email": 0, "reported": 0, "question_id": 0, } }, { $group: { _id: "34", results: { $push: { "_id": "$_id", "answer_id": "$answer_id", "answerer_name": "$answerer_name", "body": "$body", "date": "$date", "helpfulness": "$helpfulness", "photos": "$photos" } } } }, { $set: { question: "$_id", page: 0, count: 5, } }, { $unset: "_id" } ], {allowDiskUse: true}).explain("executionStats")

  #### TODO:
  1. Rename answer_id field in aggregation results for getAllQuestions to id
  2. Get rid of answer_id field in aggregation results for both get queries in the photos array

{
    "body" : "Great product!",
    "name" : "dghfdhdh",
    "email" : "dontknow@gmail.com",
    "question_id" : "3405683",
    "photos" : "["https://learn-2.galvanize.com/", "https://stackoverflow.com/"]"
}