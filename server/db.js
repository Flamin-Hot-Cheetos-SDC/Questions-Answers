const mongoose = require('mongoose');

const CounterSchema = mongoose.Schema({
  _id: { type: String, required: true},
  seq: { type: Number}
});

const counter = mongoose.model('counter', CounterSchema);

const questionSchema = mongoose.Schema({
  product_id: {
    type: Number,
    required: true
  },
  question_id: {
    type: Number,
    unique: true,
  },
  question_body: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1000,
  },
  question_date: {
    type: Number,
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
  question_helpfulness: { type: Number, default: 0 },
  reported: { type: Boolean, default: false },
  answers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer',
    },
  ],
});

// insert document into counters with _id: 'questionId' and seq: 3518963 (last value of question_id in csv), so that when the next document is inserted, its id will be incremented last value
questionSchema.pre('save', function(next) {
  var doc = this;
  counter.findByIdAndUpdate({_id: 'questionId'}, {$inc: { seq: 1} }, {new: true, upsert: true}, function(error, counter) {
      if(error) {
        return next(error);
      }
      doc.question_id = counter.seq;
      next();
  });
});

const answerSchema = mongoose.Schema({
  answer_id: {
    type: Number,
    unique: true,
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

// insert document into counters with _id: 'answerId' and seq: 6879306 (last value of answer_id in csv), so that when the next document is inserted, its id will be incremented last value
answerSchema.pre('save', function(next) {
  var doc = this;
  counter.findByIdAndUpdate({_id: 'answerId'}, {$inc: { seq: 1} }, {new: true, upsert: true}, function(error, counter) {
      if(error) {
        return next(error);
      }
      doc.answer_id = counter.seq;
      next();
  });
});

const Question = mongoose.model('Question', questionSchema);
const Answer = mongoose.model('Answer', answerSchema);

module.exports = {
  Question, Answer,
};
