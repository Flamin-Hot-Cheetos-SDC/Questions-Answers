const models = require('../models');

//TODO: add error handling to every function when incorrect, incomplete params are sent (400 status ?)
module.exports = {
  getAllQuestions: (req, res) => {
    const pid = req.query.product_id;
    const count = req.query.count || 5;
    const page = req.query.page || 1;
    models.getAllQuestions(pid, count, page)
      .then((result) => res.status(200).send(result[0]))
      .catch((err) => res.status(500).send('Cannot get all the questions'));
  },

  postQuestion: (req, res) => {
    models.postQuestion(req.body)
      .then((result) => res.status(201).send('Question added'))
      .catch((err) => {
        console.log('err ', err);
        res.status(500).send('Cannot add the question')
      });
  },
  getAllAnswers: (req, res) => {
    const question_id = req.params.question_id;
    const count = req.query.count || 5;
    const page = req.query.page || 1;
    models.getAllAnswers(question_id, count, page)
      .then((result) => res.status(200).send(result[0]))
      .catch((err) => res.status(500).send('Cannot get all the questions'));
  },
  postAnswer: (req, res) => {
    models.postAnswer(req.query, req.body)
      .then((result) => res.status(201).send('Answer added'))
      .catch((err) => res.status(500).send('Cannot add the answer'));
  },
  updateQuestionHelpfulness: (req, res) => {
    models.updateQuestionHelpfulness(req.params)
      .then((result) => res.status(200).send('Helpfulness updated'))
      .catch((err) => res.status(500).send('Cannot update helpfulness'));
  },
  reportQuestion: (req, res) => {
    models.reportQuestion(req.params)
      .then((result) => res.status(200).send('Question reported'))
      .catch((err) => res.status(500).send('Cannot report question'));
  },
  updateAnswerHelpfulness: (req, res) => {
    models.updateAnswerHelpfulness(req.params)
      .then((result) => res.status(200).send('Helpfulness updated'))
      .catch((err) => res.status(500).send('Cannot update helpfulness'));
  },
  reportAnswer: (req, res) => {
    models.reportAnswer(req.params)
      .then((result) => res.status(200).send('Answer reported'))
      .catch((err) => res.status(500).send('Cannot report answer'));
  },
};