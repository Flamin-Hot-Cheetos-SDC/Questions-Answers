### Load data into mongoDB

Manually delete headers from the original csv files to be able to set field types when importing data.
Use mongoimport with specified field types and stop option for any errors that occur during the import.

##### Answers
mongoimport --db=qanda --collection=answers --file=answers.csv --type=csv --columnsHaveTypes --fields="answer_id.double(),question_id.double(),body.string(),date.double(),answerer_name.string(),email.string(),reported.boolean(),helpfulness.double()" --parseGrace=stop

mongoimport --db=test --collection=answers --file="./sample_data/a.csv" --type=csv --columnsHaveTypes --fields="id.double(),question_id.double(),body.string(),date.double(),username.string(),email.string(),reported.boolean(),helpfulness.double()" --parseGrace=stop

##### Questions
mongoimport --db=qanda --collection=questions --file=questions.csv --type=csv --columnsHaveTypes --fields="question_id.double(),product_id.double(),body.string(),question_date.double(),asker_name.string(),email.string(),reported.boolean(),helpfulness.double()" --parseGrace=stop

mongoimport --db=test --collection=questions --file="./sample_data/q.csv" --type=csv --columnsHaveTypes --fields="id.double(),product_id.double(),body.string(),date.double(),username.string(),email.string(),reported.boolean(),helpfulness.double()" --parseGrace=stop

##### Photos
mongoimport --db=qanda --collection=photos --file=answers_photos.csv --type=csv --columnsHaveTypes --fields="id.double(),answer_id.double(),url.string()" --parseGrace=stop

mongoimport --db=test --collection=photos --file="./sample_data/p1.csv" --type=csv --columnsHaveTypes --fields="id.double(),answer_id.double(),url.string()" --parseGrace=stop

#### Result
All three files were imported without any errors. The numbers returned after running db.collection.count() on every collection are equal to the number of rows in corresponding csv.

### Aggregation

#### Embed photos array into answers
Perform lookup on answers collection matching on "answer_id" and "id" fields, and excluding "_id" and "answer_id" fields from the final result

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
  }
])

db.answers.aggregate([ { "$lookup": { "from": "photos", "localField": "id", "foreignField": "answer_id", "as": "photos" } }, { "$project": { "photos._id": 0, "photos.answer_id": 0 } } ])

#### Embed an object of answers into question object (GET /qa/questions querie)
Perform lookup on answers collection matching on "answer_id" and "id" fields, and excluding "question_id", "email" and "reported" fields from the final result

db.answers.aggregate([
  {
    "$group": {
      "$answer_id": {
        "id":
      }
    }
  },
  {
    "$project": {
      "question_id": 0,
      "email": 0,
      "reported": 0
    }
  }
])

db.answers.aggregate([ { "$lookup": { "from": "photos", "localField": "id", "foreignField": "answer_id", "as": "photos" } }, { "$project": { "photos._id": 0, "photos.answer_id": 0 } } ])