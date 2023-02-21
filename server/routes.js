const router = require('express').Router();
const controller = require('./controllers');

router.get('/questions/:question_id/answers', controller.getAllAnswers);
router.get('/questions', controller.getAllQuestions);
router.post('/questions', controller.postQuestion);

router.post('/questions/:question_id/answers', controller.postAnswer);

router.put('/questions/:question_id/helpful', controller.updateQuestionHelpfulness);
router.put('/questions/:question_id/report', controller.reportQuestion);

router.put('/answers/:answer_id/helpful', controller.updateAnswerHelpfulness);
router.put('/answers/:answer_id/report', controller.reportAnswer);

module.exports = router;