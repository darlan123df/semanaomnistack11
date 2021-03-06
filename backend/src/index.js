const express = require('express');
const { errors } = require('celebrate');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());// permite interpretar arquivos json.]
app.use(routes);
app.use(errors());

app.listen(3333);
