const express = require('express');

const companyAssessmentsCtrl = require('../controllers/companyAssessments.controller');
const userAssessmentsCtrl = require('../controllers/userAssessments.controller');
const pdfReportCtrl = require('../controllers/pdfReport.controller');

var Router = express.Router();

Router.route('/create-assessment').post(companyAssessmentsCtrl.createCompanyAssessment);
Router.route('/update-assessment').post(companyAssessmentsCtrl.updateCompanyAssessment);
Router.route('/get-assessments').post(companyAssessmentsCtrl.getCompanyAssessments);
Router.route('/update-assessment-status').post(companyAssessmentsCtrl.updateStatus);
Router.route('/get-assessment-reports').post(companyAssessmentsCtrl.getAssessmentLatestReports);
Router.route('/add-participants').post(companyAssessmentsCtrl.addParticipants);

Router.route('/get-assessment-one-question').post(userAssessmentsCtrl.getAssessmentOneQuestion);
Router.route('/submit-assessment-one-question').post(userAssessmentsCtrl.submitAssessmentOneQuestion);
Router.route('/get-my-assessments').post(userAssessmentsCtrl.getMyAssessments); // for app
Router.route('/get-web-assessment').post(userAssessmentsCtrl.getWebAssessment);
Router.route('/download-report/:id').get(pdfReportCtrl.generateReport);

Router.route('/get-user-assessments').post(userAssessmentsCtrl.getUserAssessments); // for web
Router.route('/get-user-assessment-details').post(userAssessmentsCtrl.getUserAssessmentDetails); // for web
Router.route('/get-user-summary').post(userAssessmentsCtrl.getUserSummary); // for web
Router.route('/download-csv-report/:key').get(userAssessmentsCtrl.downloadCSVReport2);

// Other API's

Router.route('/get-my-score').get(userAssessmentsCtrl.getMyScoreTest);
Router.route('/get-assessment').post(companyAssessmentsCtrl.getAssessment);
Router.route('/submit-assessment').post(companyAssessmentsCtrl.submitAssessment);
Router.route('/send-message').post(userAssessmentsCtrl.webPushNotification);

module.exports = Router;