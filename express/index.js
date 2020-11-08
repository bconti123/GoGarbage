const express = require('express');
var bodyParser = require('body-parser');

const cors = require('cors');

const app = express();

const PORT = 4000;

app.listen(PORT, () => console.log('Server running'));

var dataRouter = require("./routes/data.js");

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.use(cors());

app.use("/", dataRouter);

