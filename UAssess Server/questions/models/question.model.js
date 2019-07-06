const mongoose = require('mongoose');

const questionCollection = mongoose.Schema({
    title: { type: String, required: [true, 'Label field is required']},
    // titleLinks: { type: Array, required: false, default: []},
    // description: { type: String, required: [true, 'Description field is required']},
    // questionType: { type: String, required: false, default:""},
    optionType: { type: String, required: [true, 'Option type field is required']},
    answerType: { type: String, required: [true, 'Answer type field is required']},
    options: { type: Array, required: [true, 'Options field is required']},
    // correctOptions:{ type: Array, required: false, default: []},
    fixedOptionsOrder: { type: Boolean, required: false, default: true},
    weightage: { type: Number, required: [true, 'Weightage field is required']},
    expiresAt: { type: Date, required: [true, 'Expiry Date field is required']},
    skills: { type: Array, required: [true, 'Skills field is required']},
    competencies: { type: Array, required: [true, 'Competencies field is required']},
    subCompetencies: { type: Array, required: [true, 'Sub Competencies field is required']},
    state: { type: String, required: false, default:"new"},
    active: { type: Boolean, required: [true, 'Active field is required'], default: true},
    createdBy: { type: String, required: [true, 'CreatedBy field is required']},
    updatedBy: { type: String, required: false, default: ""},
    approvedBy: { type: String, required: false, default: ""},
    reviewedBy: { type: String, required: false, default: ""},
    approvedAt: { type: String, required: false, default: ""},
    reviewedAt: { type: String, required: false, default: ""},
    ownerId: { type: String, required: false, default: ""},
    ownerEntityId: { type: String, required: false, default: ""}
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('questions', questionCollection);