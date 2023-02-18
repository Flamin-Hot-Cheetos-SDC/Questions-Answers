const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  product_id: {
    type: Number,
    required: true
  },
  question_id: {
    type: Number,
    unique: true,
    required: true
  },
  question_body: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1000,
  },
  question_date: {
    type: Date,
    default: Date.now,
  },
  asker_name: {
    type: String,
    minlength: 2,
    maxlength: 60,
    required: true,
  },
  email: {
    type: String,
    minlength: 2,
    maxlength: 60,
    required: true,
  },
  helpfulness: { type: Number, default: 0 },
  reported: { type: Boolean, default: false },
  answers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer',
    },
  ],
});

const answerSchema = mongoose.Schema({
  answer_id: {
    type: Number,
    unique: true,
    required: true
  },
  question_id: {
    type: Number,
    required: true,
  },
  body: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1000,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  answerer_name: {
    type: String,
    minlength: 2,
    maxlength: 60,
    required: true,
  },
  email: {
    type: String,
    minlength: 2,
    maxlength: 60,
    required: true,
  },
  helpfulness: { type: Number, default: 0 },
  reported: { type: Boolean, default: false },
  photos: [
    {
      id: {
        type: Number,
        unique: true,
      },
      url: {
        type: String,
        default: null,
        maxlength: 2048,
      },
    },
  ],
});

const Question = mongoose.model('Question', questionSchema);
const Answer = mongoose.model('Answer', answerSchema);

module.exports = {
  Question, Answer,
};
