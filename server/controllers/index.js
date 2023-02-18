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

  },
  postAnswer: (req, res) => {
    models.postAnswer(req.query, req.body)
      .then((result) => res.status(201).send('Answer added'))
      .catch((err) => res.status(500).send('Cannot add the answer'));
  },
  updateQuestionHelpfulness: (req, res) => {

  },
  reportQuestion: (req, res) => {

  },
  updateAnswerHelpfulness: (req, res) => {

  },
  reportAnswer: (req, res) => {

  },
};