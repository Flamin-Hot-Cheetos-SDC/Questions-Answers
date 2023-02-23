require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
let app = express();
const router = require('./routes');
const port = process.env.PORT;
const uri = `${process.env.DB_HOST}/${process.env.DB_NAME}`;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

/* MIDDLEWARE */
app.use(morgan('dev'));
app.use(express.json());
app.use('/qa', router);

const db = mongoose.connection;
db.on('error', err => {
  console.error(err);
});
db.once('open', function() {

});

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});