// routes/analysisRoutes.js
const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

// 일일 방문자 수를 가져오는 라우트
router.get('/analysis/daily-visitors', analysisController.getDailyVisitors);

// 오늘 날짜에 가입한 사람 수를 가져오는 라우트
router.get('/analysis/today-registrations', analysisController.getTodayRegistrations);

// 총 회원 수를 가져오는 라우트
router.get('/analysis/total-members', analysisController.getTotalMembers);

// 성별 및 연령대 집계 라우트
router.get('/analysis/gender-age-stats', analysisController.getGenderAndAgeStats);  // 새로운 라우트 추가

module.exports = router;
