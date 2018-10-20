const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const routes = require('./routes');

const app = express();

mongoose
  .connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connected successfully');
  })
  .catch(err => console.log('error', err));

app.use(cors());
app.use(bodyParser.json());
app.use('/images', express.static('images'));
routes(app);

app.use('*', (req, res) =>
  res.status(200).json(`Server is online ${new Date().toDateString()}`)
);
const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`App started on ${port}`);
});
