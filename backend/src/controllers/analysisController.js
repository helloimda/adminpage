// controllers/analysisController.js
const analysisService = require('../services/analysisService');

// 일일 방문자 수 반환
const getDailyVisitors = (req, res) => {
  analysisService.getDailyVisitors((error, count) => {
    if (error) {
      console.error('일일 방문자 수 집계 중 오류 발생:', error.message);
      return res.status(500).send('일일 방문자 수 집계 중 오류가 발생했습니다.');
    }
    res.json({ dailyVisitors: count });
  });
};

// 오늘 날짜에 가입한 사람 수 반환
const getTodayRegistrations = (req, res) => {
  analysisService.getTodayRegistrations((error, count) => {
    if (error) {
      console.error('오늘 날짜에 가입자 수 집계 중 오류 발생:', error.message);
      return res.status(500).send('오늘 날짜에 가입자 수 집계 중 오류가 발생했습니다.');
    }
    res.json({ todayRegistrations: count });
  });
};

// 총 회원 수 반환
const getTotalMembers = (req, res) => {
  analysisService.getTotalMembers((error, count) => {
    if (error) {
      console.error('총 회원 수 집계 중 오류 발생:', error.message);
      return res.status(500).send('총 회원 수 집계 중 오류가 발생했습니다.');
    }
    res.json({ totalMembers: count });
  });
};

module.exports = {
  getDailyVisitors,
  getTodayRegistrations,
  getTotalMembers,  // 새로운 메소드 추가
};
