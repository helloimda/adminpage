// routes/visitorRoutes.js
const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');

// 일일 방문자 수를 가져오는 라우트
router.get('/visitors/daily', visitorController.getDailyVisitors);

module.exports = router;
