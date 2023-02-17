const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  product_id: {
    type: Number,
    required: true
  },
  id: {
    type: Number,
    unique: true,
    required: true
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
  username: {
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
  id: {
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
  username: {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Photo',
    },
  ],
});

const photoSchema = mongoose.Schema({
  answer_id: { type: Number, required: true },
  id: {
    type: Number,
    unique: true,
    required: true
  },
  url: {
    type: String,
    default: null,
    maxlength: 2048,
  },
});

const Question = mongoose.model('Question', questionSchema);
const Answer = mongoose.model('Answer', answerSchema);
const Photo = mongoose.model('Photo', photoSchema);

module.exports = {
  Question, Answer, Photo,
};
