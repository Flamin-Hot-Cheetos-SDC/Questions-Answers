### Load data into mongoDB

Manually delete headers from the original csv files to be able to set field types when importing data.
Use mongoimport with specified field types and stop option for any errors that occur during the import.

##### Answers
mongoimport --db=qanda --collection=answers --file=answers.csv --type=csv --columnsHaveTypes --fields="id.double(),question_id.double(),body.string(),date.double(),username.string(),email.string(),reported.boolean(),helpfulness.double()" --parseGrace=stop

##### Questions
mongoimport --db=qanda --collection=questions --file=questions.csv --type=csv --columnsHaveTypes --fields="id.double(),product_id.double(),body.string(),date.double(),username.string(),email.string(),reported.boolean(),helpfulness.double()" --parseGrace=stop

##### Photos
mongoimport --db=qanda --collection=photos --file=answers_photos.csv --type=csv --columnsHaveTypes --fields="id.double(),answer_id.double(),url.string()" --parseGrace=stop

#### Result
All three files were imported without any errors. The numbers returned after running db.collection.count() on every collection are equal to the number of rows in corresponding csv.