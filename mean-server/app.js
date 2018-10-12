const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

routes(app);

app.use('*', (req, res) => res.status(200).json(`Server is online ${new Date().toDateString()}`))
const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`App started on ${port}`)
})