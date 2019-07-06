const mongoose = require('mongoose');

const skillCollection = mongoose.Schema({
    label: { type: String, require: [true, 'Label field is required']},
    description: { type: String, require: false, default: ""},
    active: { type: Boolean, require: [true, 'Active field is required'], default: true},
    competencyIds: { type: Array, require: false, default: []},
    createdBy: { type: String, require: [true, 'Created user ID required'], default: ""},
    updatedBy: { type: String, require: [true, 'Updated user ID required'], default: ""}
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('skills', skillCollection);