const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
let app = express();
const router = require('./routes');
// const port = process.env.PORT;
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

/* MIDDLEWARE */
app.use(morgan('dev'));
app.use(express.json());
app.use('/qa', router);

const db = mongoose.connection;
db.on('error', err => {
  logError(err);
});
db.once('open', function() {

});

app.listen(3000, function() {
  console.log(`listening on port 3000`);
});