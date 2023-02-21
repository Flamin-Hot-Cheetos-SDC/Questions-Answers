// VARIABLES
// base_url: http://localhost:3000/qa
// product_id: 967651
// question_id: 3405683

// url: {{base_url}}/questions

pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Successful add status response", function () {
  pm.response.to.have.status("Created");
});
