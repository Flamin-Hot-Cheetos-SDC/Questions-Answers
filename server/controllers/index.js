const models = require('../models');

module.exports = {
  getAllQuestions: (req, res) => {
    console.log('inside controllers', req.query);
    const pid = req.query.product_id;
    const count = req.query.count || 5;
    const page = req.query.page || 1;
    models.getAllQuestions(pid, count, page)
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(500).send('Cannot get all the questions'));
  },

  postQuestion: (req, res) => {
    models.postQuestion(req.body)
      .then((result) => res.status(201).send('Question added'))
      .catch((err) => res.status(500).send('Cannot add the question'));
  },
  getAllAnswers: (req, res) => {
    console.log('inside controllers', req.query);
    const question_id = req.body.question_id;
    const count = req.query.count || 5;
    const page = req.query.page || 1;
    models.getAllQuestions(pid, count, page)
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(500).send('Cannot get all the questions'));
  },
  postAnswer: (req, res) => {
    models.postAnswer(req.query, req.body)
      .then((result) => res.status(201).send('Answer added'))
      .catch((err) => res.status(500).send('Cannot add the answer'));
  },
  updateQuestionHelpfulness: (req, res) => {
    models.updateQuestionHelpfulness(req.query)
      .then((result) => res.status(200).send('Helpfulness updated'))
      .catch((err) => res.status(500).send('Cannot update helpfulness'));
  },
  reportQuestion: (req, res) => {
    models.reportQuestion(req.query)
      .then((result) => res.status(200).send('Question reported'))
      .catch((err) => res.status(500).send('Cannot report question'));
  },
  updateAnswerHelpfulness: (req, res) => {
    models.updateAnswerHelpfulness(req.query)
      .then((result) => res.status(200).send('Helpfulness updated'))
      .catch((err) => res.status(500).send('Cannot update helpfulness'));
  },
  reportAnswer: (req, res) => {
    models.reportAnswer(req.query)
      .then((result) => res.status(200).send('Answer reported'))
      .catch((err) => res.status(500).send('Cannot report answer'));
  },
};