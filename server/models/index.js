const { Question, Answer } = require('../db');

module.exports = {
  getAllQuestions: (pid, count, page) => {
    console.log('pid', pid);
    return Question.find({ product_id: pid, reported: false})
      .sort({ helpfulness: 'desc' })
      .limit(count);
  },
  postQuestion: (params) => {
    const { body, name, email, product_id } = params;
    return Question.create({
      product_id: product_id,
      body: body,
      username: name,
      email: email,
    });
  },
  getAllAnswers: (params) => {
    return Answers.find({ product_id: pid, reported: false})
      .sort({ helpfulness: 'desc' })
      .limit(count);
  },
  postAnswer: ({ body, name, email, photos, question_id }) => {
    return Answer.create({
      question_id: question_id,
      body: body,
      username: name,
      email: email,
      photos: photos,
    });
  },
  updateQuestionHelpfulness: (params) => {

  },
  reportQuestion: (params) => {

  },
  updateAnswerHelpfulness: (params) => {

  },
  reportAnswer: (params) => {

  },
};