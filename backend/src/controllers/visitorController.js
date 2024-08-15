// controllers/visitorController.js
const visitorService = require('../services/visitorService');

const getDailyVisitors = (req, res) => {
  visitorService.getDailyVisitors((error, count) => {
    if (error) {
      console.error('일일 방문자 수 집계 중 오류 발생:', error.message);
      return res.status(500).send('일일 방문자 수 집계 중 오류가 발생했습니다.');
    }
    res.json({ dailyVisitors: count });
  });
};

module.exports = {
  getDailyVisitors,
};
