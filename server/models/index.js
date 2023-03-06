const { Question, Answer } = require('../db');

module.exports = {
  getAllQuestions: (pid, count, page) => {
    return Question.aggregate([ { $match: { product_id: Number(pid), reported: false } }, { $sort: { question_id: 1 } }, { $limit: Number(count) }, { $lookup: { "from": "answers", "let": { "q_id": "$question_id" }, "pipeline": [ { $match: { $expr: { "$eq": [ "$question_id", "$$q_id" ] }, reported: false } }, { $project: { "email": 0, "reported": 0, "question_id": 0, } } ], "as": "answers" } }, { $addFields: { answers: { "$arrayToObject": { $map: { input: "$answers", in: { k: { $toString: "$$this.answer_id" }, v: "$$this" } } } } } }, { $group: { _id: "$product_id", results: { $push: { "_id": "$_id", "answers": "$answers", "asker_name": "$asker_name", "question_body": "$question_body", "question_date": "$question_date", "question_helpfulness": "$question_helpfulness", "question_id": "$question_id", "reported": "$reported" } } } }, { $set: { product_id: "$_id" } }, { $unset: "_id" }], {allowDiskUse: true});
  },
  postQuestion: (params) => {
    const { body, name, email, product_id } = params;
    console.log('in models ', {
      // product_id: Number(product_id),
      product_id: params.product_id,
      question_body: body,
      asker_name: name,
      email: email,
      question_helpfulness: 0});
    return Question.create({
      // product_id: Number(product_id),
      product_id: product_id,
      question_body: body,
      asker_name: name,
      email: email,
      question_helpfulness: 0,
    });
  },
  getAllAnswers: (question_id, count, page) => {
    // TODO: create a separate file to store aggregations, import the required aggregation here ?
    return Answer.aggregate([ { $match: { question_id: Number(question_id), reported: false } }, { $sort: { answer_id: -1 } }, { $limit: Number(count) }, { $project: { "email": 0, "reported": 0, "question_id": 0, } }, { $group: { _id: Number(question_id), results: { $push: { "_id": "$_id", "answer_id": "$answer_id", "answerer_name": "$answerer_name", "body": "$body", "date": "$date", "helpfulness": "$helpfulness", "photos": "$photos" } } } }, { $set: { question: "$_id", page: Number(page), count: Number(count), } }, { $unset: "_id" } ], {allowDiskUse: true});
  },
  postAnswer: ({ body, name, email, photos, question_id }) => {
    return Answer.create({
      question_id: question_id,
      body: body,
      username: name,
      email: email,
      photos: photos,
      helpfulness: 0,
    });
    // maybe will have to add pre-save step to generate photo_ids if the photo array is not empty
    // to save photos will need to use array.push or check out $push in aggregation
    // also need to add ref to that answer into corresponding question?
  },
  updateQuestionHelpfulness: (params) => {
    return Question.findOneAndUpdate({ question_id: params.question_id } , {$inc: { 'question_helpfulness' : 1}});
  },
  reportQuestion: (params) => {
    //need to test and see if the second argument needs to have a $set method attached to it
    return Question.findOneAndUpdate({ question_id: params.question_id } , {'report' : true });
  },
  updateAnswerHelpfulness: (params) => {
    return Answer.findOneAndUpdate({ answer_id: params.answer_id } , {$inc: { 'helpfulness' : 1}});
  },
  reportAnswer: (params) => {
    //need to test and see if the second argument needs to have a $set method attached to it
    return Answer.findOneAndUpdate({ answer_id: params.answer_id } , {'report' : true });
  },
};