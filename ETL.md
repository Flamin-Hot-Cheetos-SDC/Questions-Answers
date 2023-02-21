### Load data into mongoDB

Manually delete headers from the original csv files to be able to set field types when importing data.
Use mongoimport with specified field types and stop option for any errors that occur during the import.

##### Photos
- Import all photos:
   mongoimport --db=qanda --collection=photos --file="./data/answers_photos.csv" --type=csv --columnsHaveTypes --fields="id.int32(),answer_id.int32(),url.string()" --parseGrace=stop

##### Answers
- Import all answers:
   mongoimport --db=qanda --collection=answers --file="./data/answers.csv" --type=csv --columnsHaveTypes --fields="answer_id.int32(),question_id.int32(),body.string(),date.int64(),answerer_name.string(),email.string(),reported.boolean(),helpfulness.int32()" --parseGrace=stop

  ###### Embed photos array into answers
  1. Import answers.csv
  2. Import answers_photos.csv
  3. Create indexes on photos collection's answer_id field.
  4. Perform lookup on answers collection matching on "answer_id" and "id" fields, and excluding "_id" and "answer_id" fields from the final result
  5. Use $out to replace the original answers collection with the result of aggregation
  6. Drop photos collections

    db.answers.aggregate([
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
          "photos._id": 0,
          "photos.answer_id": 0
        }
      },
      {
        "$out": "answers"
      }
    ])

    db.answers.aggregate([ { "$lookup": { "from": "photos", "localField": "answer_id", "foreignField": "answer_id", "as": "photos" } }, { "$project": { "photos._id": 0, "photos.answer_id": 0 } }, {"$out" : "answersWithPhotos"} ], {allowDiskUse: true})

##### Questions
- Import all questions:
   mongoimport --db=qanda --collection=questions --file="./data/questions.csv" --type=csv --columnsHaveTypes --fields="question_id.int32(),product_id.int32(),question_body.string(),question_date.int64(),asker_name.string(),email.string(),reported.boolean(),question_helpfulness.int32()" --parseGrace=stop


#### Result
All three files were imported without any errors. The numbers returned after running db.collection.count() on every collection are equal to the number of rows in corresponding csv.
Once I created indexes on answer_id field in photos collection, the aggregation to transform answers collection didn't take more than 10 minutes to complete.