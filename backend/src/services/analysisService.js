// services/analysisService.js
const connection = require('../config/db');

// 일일 방문자 수 집계
const getDailyVisitors = (callback) => {
  const query = `
    SELECT COUNT(*) AS daily_visitors
    FROM HM_MEMBER
    WHERE DATE(todaydt) = CURDATE();
  `;

  connection.query(query, (error, results) => {
    if (error) return callback(error);
    callback(null, results[0].daily_visitors);
  });
};

// 오늘 날짜에 가입한 사람 수 집계
const getTodayRegistrations = (callback) => {
  const query = `
    SELECT COUNT(*) AS today_registrations
    FROM HM_MEMBER
    WHERE DATE(regdt) = CURDATE();
  `;

  connection.query(query, (error, results) => {
    if (error) return callback(error);
    callback(null, results[0].today_registrations);
  });
};

// 총 회원 수 집계 (deldt 필드가 NULL인 사용자)
const getTotalMembers = (callback) => {
  const query = `
    SELECT COUNT(*) AS total_members
    FROM HM_MEMBER
    WHERE deldt IS NULL;
  `;

  connection.query(query, (error, results) => {
    if (error) return callback(error);
    callback(null, results[0].total_members);
  });
};

module.exports = {
  getDailyVisitors,
  getTodayRegistrations,
  getTotalMembers,  // 새로운 기능 추가
};
