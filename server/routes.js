require('dotenv').config();
const router = require('express').Router();
const controller = require('./controllers');

//TODO: add a route for incorrect urls that will bring the user to 404?
router.get(`/${process.env.LOADER_IO}`, controller.loaderIo);

router.get('/qa/questions', controller.getAllQuestions);
router.post('/qa/questions', controller.postQuestion);

router.get('/qa/questions/:question_id/answers', controller.getAllAnswers);
router.post('/qa/questions/:question_id/answers', controller.postAnswer);

router.put('/qa/questions/:question_id/helpful', controller.updateQuestionHelpfulness);
router.put('/qa/questions/:question_id/report', controller.reportQuestion);

router.put('/qa/answers/:answer_id/helpful', controller.updateAnswerHelpfulness);
router.put('/qa/answers/:answer_id/report', controller.reportAnswer);

module.exports = router;