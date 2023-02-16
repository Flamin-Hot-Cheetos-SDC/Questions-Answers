const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  product_id: Number,
  _id: Number,
  body: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  helpfulness: Number,
  reported: Boolean,
  answers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer',
    },
  ],
});

const answerSchema = mongoose.Schema({
  _id: Number,
  question_id: Number,
  body: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
  },
  email: String,
  helpfulness: Number,
  reported: Boolean,
  photos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Photo',
    },
  ],
});

const photoSchema = mongoose.Schema({
  answer_id: Number,
  _id: Number,
  url: String,
});

const Question = mongoose.model('Question', questionSchema);
const Answer = mongoose.model('Answer', answerSchema);
const Photo = mongoose.model('Photo', photoSchema);

module.exports = {
  Question, Answer, Photo,
};
