const mongoose = require('mongoose');

const levelCollection = mongoose.Schema({
    label: { type: String, require: [true, 'Label field is required']},
    levelNo: { type: String, require: [true, 'Level field is required']},
    description: { type: String, require: false, default: ""},
    time: { type: String, require: [true, 'Time Required' ]},
    active: { type: Boolean, require: [true, 'Active field is required'], default: true},
    createdBy: { type: String, require: [true, 'Created user ID required'], default: ""},
    updatedBy: { type: String, require: [true, 'Updated user ID required'], default: ""}
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('levels', levelCollection);