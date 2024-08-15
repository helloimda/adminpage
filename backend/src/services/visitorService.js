// services/visitorService.js
const connection = require('../config/db');

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

module.exports = {
  getDailyVisitors,
};
