const express = require('express');
const UsersCtrl = require('../controllers/users.controller');
const CompanyCtrl = require('../controllers/company.controller');

Router = express.Router();

Router.route('/register').post(UsersCtrl.register);
Router.route('/login').post(UsersCtrl.login);
Router.route('/get-my-profile').post(UsersCtrl.getMyProfile);
Router.route('/update-my-profile').post(UsersCtrl.updateMyProfile);
Router.route('/change-my-password').post(UsersCtrl.changeMyPassword);

Router.route('/create-company-profile').post(CompanyCtrl.createCompanyProfile);
Router.route('/update-company-profile').post(CompanyCtrl.updateCompanyProfile);
Router.route('/get-companies').post(CompanyCtrl.getCompanies);
Router.route('/get-company-profile').post(CompanyCtrl.getCompanyProfile);

Router.route('/invite-admin').post(UsersCtrl.inviteAdmin);
Router.route('/invite-assessee').post(UsersCtrl.inviteAssesseeLoop);
Router.route('/logout').post(UsersCtrl.logout);

Router.route('/get-users-profile').post(UsersCtrl.getUsersProfile);
Router.route('/send-feedback').post(UsersCtrl.sendFeedback);

// Internal uses
Router.route('/get-push-notification-id').post(UsersCtrl.getPushNotificationId);
Router.route('/consume-license').post(CompanyCtrl.consumeLicense);
Router.route('/get-guest-profile-ids').post(UsersCtrl.getGuestProfileIds);
Router.route('/delete-guest-profiles').post(UsersCtrl.deleteGuestProfiles);

// Removeable
Router.route('/get-emails-stub').get(UsersCtrl.getArrayOfemails);

module.exports = Router;