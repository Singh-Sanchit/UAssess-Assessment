const express = require('express');

const questionCtrl = require('../controllers/question.controller');

const Router = express.Router();

Router.route('/create-question').post(questionCtrl.createQuestion);
Router.route('/update-question').post(questionCtrl.updateQuestion);
Router.route('/get-questions').post(questionCtrl.getQuestions);
Router.route('/update-question-status').post(questionCtrl.updateStatus);

Router.route('/create-multi-questions').post(questionCtrl.createMultiQuestions);
Router.route('/get-question-counts').post(questionCtrl.getQuestionCounts);

// Internal Use
Router.route('/get-random-questions').post(questionCtrl.getRandomQuestions);
Router.route('/get-question-by-id').post(questionCtrl.getQuestionById);

module.exports = Router;
