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
  getAllAnswers: ({ question_id }) => {
    return Answer.find({ question_id: question_id, reported: false})
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
    //also need to add ref to that answer into corresponding question?
  },
  updateQuestionHelpfulness: ({ question_id }) => {
    return Question.findOneAndUpdate({ question_id: question_id } , {$inc: { 'helpfullness' : 1}});
  },
  reportQuestion: ({ question_id }) => {
    return Question.findOneAndUpdate({ question_id: question_id } , {'report' : true });
  },
  updateAnswerHelpfulness: ({ answer_id }) => {
    return Answer.findOneAndUpdate({ answer_id: answer_id } , {$inc: { 'helpfullness' : 1}});
  },
  reportAnswer: ({ answer_id }) => {
    return Answer.findOneAndUpdate({ answer_id: answer_id } , {'report' : true });
  },
};