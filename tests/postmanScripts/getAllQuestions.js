// VARIABLES
// base_url: http://localhost:3000/qa
// product_id: 967651
// question_id: 3405683

// url: {{base_url}}/questions/?product_id={{product_id}}&page=1&count=200

const responseJson = pm.response.json();

pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response should be a parsable JSON", function() {
  pm.expect(responseJson).to.be.ok;
});

pm.test("The response has all properties", function () {
  pm.expect(responseJson.results).to.be.a('array');
  pm.expect(responseJson.results.length).to.eql(10);
  pm.expect(responseJson.product_id).to.eql(967651);
  const question3 = responseJson.results.find(qa => qa.question_id === 3405683);
  pm.expect(question3).to.be.an('object');
  pm.expect(question3).to.have.all.keys('reported', 'question_id', 'question_body', 'asker_name', 'question_date', 'question_helpfulness', 'answers', '_id');
  pm.expect(question3.answers).to.be.an('object');
});

pm.test("Check data types", function () {
  const question3 = responseJson.results.find(qa => qa.question_id === 3405683);
  pm.expect(question3.reported).to.be.a('boolean');
  pm.expect(question3.question_id).to.be.a('number');
  pm.expect(question3.question_body).to.be.a('string');
  pm.expect(question3.asker_name).to.be.a('string');
  pm.expect(question3.question_date).to.be.a('number');
  pm.expect(question3.question_helpfulness).to.be.a('number');
  pm.expect(question3._id).to.be.a('string');
  pm.expect(question3.answers).to.be.an('object');
});