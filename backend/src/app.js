// app.js
const express = require('express');
const app = express();
const userbanRoutes = require('./routes/userbanRoutes');
const connection = require('./config/db'); // DB 연결 설정 불러오기

app.use(express.json()); // JSON 요청 파싱
app.use('/', userbanRoutes);

module.exports = app;