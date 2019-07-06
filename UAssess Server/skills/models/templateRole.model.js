const mongoose = require('mongoose');

const templateRoleCollection = mongoose.Schema({
    label: { type: String, require: [true, 'Label field is required']},
    description: { type: String, require: false, default: ""},
    competencies: { type: Array, require: [true, 'Competencies field is required'], default: []},
    subCompetencies: { type: Array, require: [true, 'Sub Competencies field is required'], default: []},
    skills: { type: Array, require: [true, 'Skills field is required'], default: []},
    active: { type: Boolean, require: [true, 'Active field is required'], default: true},
    createdBy: { type: String, require: [true, 'Created user ID required'], default: ""},
    updatedBy: { type: String, require: [true, 'Updated user ID required'], default: ""}
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('templateRoles', templateRoleCollection);