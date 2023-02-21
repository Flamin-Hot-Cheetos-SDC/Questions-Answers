// VARIABLES
// base_url: http://localhost:3000/qa
// product_id: 967651
// question_id: 3405683

// url: {{base_url}}/questions/{{question_id}}/answers

const responseJson = pm.response.json();

pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response should be a parsable JSON", function() {
  pm.expect(responseJson).to.be.ok;
});

pm.test("The response has all properties", function () {
  const answer1 = responseJson.results[0];
  pm.expect(responseJson).to.be.a('object');
  pm.expect(responseJson).to.have.all.keys('results', 'question', 'page', 'count');
  pm.expect(responseJson.question).to.be.a('number');
  pm.expect(responseJson.page).to.be.a('number');
  pm.expect(responseJson.count).to.be.a('number');
  pm.expect(responseJson.results).to.be.a('array');
  pm.expect(responseJson.results.length).to.eql(3);
  pm.expect(answer1).to.be.an('object');
  pm.expect(answer1).to.have.all.keys('answer_id', 'body', 'answerer_name', 'date', 'helpfulness', 'photos', '_id');
  pm.expect(answer1.photos).to.be.an('array');
  pm.expect(answer1.photos[0]).to.have.all.keys('id', '_id', 'answer_id', 'url');
});

pm.test("Check data types", function () {
  const answer1 = responseJson.results.find(ans => ans.answer_id === 6657861);;
  pm.expect(answer1.answer_id).to.be.a('number');
  pm.expect(answer1.body).to.be.a('string');
  pm.expect(answer1.answerer_name).to.be.a('string');
  pm.expect(answer1.date).to.be.a('number');
  pm.expect(answer1.helpfulness).to.be.a('number');
  pm.expect(answer1._id).to.be.a('string');
  pm.expect(answer1.photos).to.be.an('array');
  pm.expect(answer1.photos[0].id).to.be.a('number');
  pm.expect(answer1.photos[0]._id).to.be.a('string');
  pm.expect(answer1.photos[0].answer_id).to.be.a('number');
  pm.expect(answer1.photos[0].url).to.be.a('string');
});