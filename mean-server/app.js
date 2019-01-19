const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const routes = require('./routes');

const app = express();
app.use(cors());
require('dotenv').config();
app.use(bodyParser.json());
app.use('/images', express.static('./images'));

mongoose
  .connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useCreateIndex: true }
  )
  .then(() => {
    console.log('Connected successfully');
  })
  .catch(err => console.log('error', err));


routes(app);

app.use('*', (req, res) =>
  res.status(200).json(`Server is online ${new Date().toDateString()}`)
);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App started on ${port}`);
});
