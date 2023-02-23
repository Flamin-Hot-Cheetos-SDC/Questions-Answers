const router = require('express').Router();
const controller = require('./controllers');

//TODO: add a route for incorrect urls that will bring the user to 404?
router.get('/questions', controller.getAllQuestions);
router.post('/questions', controller.postQuestion);

router.get('/questions/:question_id/answers', controller.getAllAnswers);
router.post('/questions/:question_id/answers', controller.postAnswer);

router.put('/questions/:question_id/helpful', controller.updateQuestionHelpfulness);
router.put('/questions/:question_id/report', controller.reportQuestion);

router.put('/answers/:answer_id/helpful', controller.updateAnswerHelpfulness);
router.put('/answers/:answer_id/report', controller.reportAnswer);

module.exports = router;