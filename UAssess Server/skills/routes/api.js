const express = require('express');
const levelCtrl = require('../controllers/level.controller');
const skillCtrl = require('../controllers/skill.controller');
const competencyCtrl = require('../controllers/competency.controller');
const subCompetencyCtrl = require('../controllers/subCompetency.controller');
const templateRoleCtrl = require('../controllers/templateRole.controller');
const skillGroupCtrl = require('../controllers/skillGroup.controller');

const Router = express.Router();

Router.route('/create-level').post(levelCtrl.createLevel);
Router.route('/update-level').post(levelCtrl.updateLevel);
Router.route('/get-levels').post(levelCtrl.getLevels);
Router.route('/update-level-status').post(levelCtrl.updateStatus);

Router.route('/create-skills').post(skillCtrl.createSkills);
Router.route('/update-skill').post(skillCtrl.updateSkill);
Router.route('/get-skills').post(skillCtrl.getSkills);
Router.route('/update-skill-status').post(skillCtrl.updateStatus);

Router.route('/create-competencies').post(competencyCtrl.createCompetencies);
Router.route('/update-competency').post(competencyCtrl.updateCompetency);
Router.route('/get-competencies').post(competencyCtrl.getCompetencies);
Router.route('/update-competency-status').post(competencyCtrl.updateStatus);

Router.route('/create-sub-competencies').post(subCompetencyCtrl.createSubCompetencies);
Router.route('/update-sub-competencies').post(subCompetencyCtrl.updateSubCompetency);
Router.route('/get-sub-competencies').post(subCompetencyCtrl.getSubCompetencies);
Router.route('/update-subcompetency-status').post(subCompetencyCtrl.updateStatus);

Router.route('/create-template-role').post(templateRoleCtrl.createTemplateRole);
Router.route('/update-template-role').post(templateRoleCtrl.updateTemplateRole);
Router.route('/get-template-roles').post(templateRoleCtrl.getTemplateRoles);
Router.route('/update-template-role-status').post(templateRoleCtrl.updateStatus);

Router.route('/create-skill-group').post(skillGroupCtrl.createSkillGroup);
Router.route('/update-skill-group').post(skillGroupCtrl.updateSkillGroup);
Router.route('/get-skill-groups').post(skillGroupCtrl.getSkillGroups);
Router.route('/update-skill-group-status').post(skillGroupCtrl.updateStatus);

//Router.route('/update-competency-ids').post(skillCtrl.updateCompetencyIds);
//Router.route('/create-skill').post(skillCtrl.createSkill);

module.exports = Router;