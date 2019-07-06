const Questions = require('../models/question.model');
const mongoose = require('mongoose');
var fs = require("fs");
const Request = require('request');
require('../config/messages');

module.exports = {
    getQuestionCounts: function(req, res){
        var input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("noOfQuestion" in input) || input.noOfQuestion.length == 0){
            return res.send({"code":"1", "message":"No of questions required", "data": input});
        }
        if(!("competencies" in input)){
            return res.send({"code":"1", "message":"competencies field required", "data": input});
        }
        if(!("subCompetencies" in input)){
            return res.send({"code":"1", "message":"subCompetencies field required", "data": input});
        }
        var a = input.noOfQuestion;
        var b = 0;

        if("skills" in input){
            if(input.skills.length > 0){
                let skillIds = [];
                input.skills.forEach(element => {
                    if(skillIds.indexOf(element.id) > -1){
                        return res.send({ "code": "1", "message": "Skills contains duplicate Id", "data": element});
                    }
                    skillIds.push(element.id);
                });
                b = b + input.skills.length;
            }
        }
        if("competencies" in input){
            if(input.competencies.length > 0){
                let compIds = [];
                input.competencies.forEach(element => {
                    if(compIds.indexOf(element.id) > -1){
                        return res.send({ "code": "1", "message": "Competendies contains duplicate Id", "data": element});
                    }
                    compIds.push(element.id);
                });
                b = b + input.competencies.length;
            }
        }
        if("subCompetencies" in input){
            if(input.competencies.length > 0){
                let subcompIds = [];
                input.subCompetencies.forEach(element => {
                    if(subcompIds.indexOf(element.id) > -1){
                        return res.send({ "code": "1", "message": "Sub Competendies contains duplicate Id", "data": element});
                    }
                    subcompIds.push(element.id);
                });
                b = b + input.subCompetencies.length;
            }
        }
        if(b > 0){
            module.exports.validateToken(input.token, function(profile){
                if(profile){
                    if(profile.privilegeRoles.indexOf("UassessAdmin")>-1 || profile.privilegeRoles.indexOf("CompanyAdmin")>-1){
                       
                        var c = Math.round(a/b);
                        var d = [];
                        var e = 0;
                        for(var i=1; i<=b; i++){
                            if(i == b){
                                d.push(a-e);
                            }else{
                                d.push(c);
                                e = e + c;
                            }
                        }
                        var skills = [];
                        var competencies = [];
                        var subCompetencies = [];
                        var axisIndex = 0;
                
                        if("skills" in input){
                            if(input.skills.length > 0){
                                input.skills.forEach(element => {
                                    filter = element;
                                    filter.axis = "skills";
                                    module.exports.getAvailableQuestionCounts(filter).then(function(count){ 
                                        element.availableQuestions = count;
                                        element.count = d[axisIndex];
                                        skills.push(element);
                                        axisIndex++;
                                    });  
                                });
                            }
                        }
                        if("competencies" in input){
                            if(input.competencies.length > 0){
                                input.competencies.forEach((element)=> {
                                    filter = element;
                                    filter.axis = "competencies";
                                    module.exports.getAvailableQuestionCounts(filter).then(function(count){ 
                                        element.availableQuestions = count;
                                        element.count = d[axisIndex];
                                        competencies.push(element);
                                        axisIndex++;
                                    });                                                       
                                });
                            }
                        }
                        if("subCompetencies" in input){
                            if(input.subCompetencies.length > 0){
                                input.subCompetencies.forEach(element =>{
                                    filter = element;
                                    filter.axis = "subCompetencies";
                                    module.exports.getAvailableQuestionCounts(filter).then(function(count){
                                        element.availableQuestions = count;
                                        element.count = d[axisIndex];
                                        subCompetencies.push(element);
                                        axisIndex++;
                                    })
                                });
                            }
                        }
                        const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
                        const start = async () => {
                            await waitFor(3000);
                            return res.send({"code":"1", "message":SUCCESS, "data":{"skills":skills,"competencies":competencies, "subCompetencies": subCompetencies}});
                          }
                        start();                        
                    }else{
                        return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                    }
                }else{
                    return res.send({ "code": "1", "message": INVALID_TOKEN, "data": input});
                }
            })    
        }
    },
    getAvailableQuestionCounts: async function(filter){
        if(filter.id.length < 24){
            return 0;
        }else{
            objectid = mongoose.Types.ObjectId(filter.id);
            if(filter.axis == "skills"){
                var count = await Questions.countDocuments({"skills":{$elemMatch: {"id":objectid, "level":filter.level}}}).then(function(result){
                    return result;
                });
                return count;    
            }else if(filter.axis == "competencies"){
                var count = await Questions.countDocuments({"competencies":{$elemMatch: {"id":objectid, "level":filter.level}}}).then(function(result){
                    return result;
                });
                return count;
            }else if(filter.axis == "subCompetencies"){
                var count = await Questions.countDocuments({"subCompetencies":{$elemMatch: {"id":objectid, "level":filter.level}}}).then(function(result){
                    return result;
                });
                return count;    
            }   
        }
    },

    createQuestion : function(req, res){
        var input = req.body;
        // console.log(req.files[0].filename); // multer helps to get raw files to upload from form-data
        const optionTypes = ["radiogroup", "checkbox", "boolean", "file", "imagepicker", "text", "rating"];
        const answerTypes = ["correctAnswer", "notApplicable"];
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("title" in input) || input.title.length == 0){
            return res.send({"code":"1", "message":TITLE_REQUIRED, "data": input});
        }
        if(!("optionType" in input) || input.optionType.length == 0){
            return res.send({"code":"1", "message":OPTION_TYPE_REQUIRED, "data": input});
        }else{
            if(optionTypes.indexOf(input.optionType) < 0){
                return res.send({"code":"1", "message":INVALID_OPTION_TYPE, "data": input});
            }
            else{
                if(input.optionType === "radiogroup" || input.optionType === "checkbox"){
                    if(!("options" in input) || input.options.length < 2){
                        return res.send({"code":"1", "message":"Minimum 2 Options required", "data": input});
                    }else{
                        var optionsArr = [];
                        var optionsIds = [];
                        input.options.forEach(element => {
                            if(optionsArr.indexOf(element.label) > -1){
                                return res.send({ "code": "1", "message": "Option contains duplicate label", "data": element});
                            }else if(optionsIds.indexOf(element.id) > -1){
                                return res.send({ "code": "1", "message": "Option contains duplicate Id", "data": element});
                            }else if(element.answer !== true && element.answer !== false){
                                return res.send({ "code": "1", "message": "Option answer should be Boolean true/false", "data": element});
                            }
                            optionsArr.push(element.label);
                            optionsIds.push(element.id);
                        });
                    }
                }
            }
        }
        if(!("answerType" in input) || input.answerType.length == 0){
            return res.send({"code":"1", "message":"Answer Type required", "data": input});
        }else{
            if(answerTypes.indexOf(input.answerType) < 0){
                return res.send({"code":"1", "message":"Invalid Answer Type", "data": input});
            }
        }
        if("expiresAt" in input){
            var pattern = /^\d{4}[-](0[1-9]|1[0-2])[-](0[1-9]|[12][0-9]|3[01])$/;
            if(pattern.test(input.expiresAt) == false){
                return res.status(200).send({"code":"1", "message":"Invalid Expiry date" });
            }
        }
        if("weightage" in input){
            if(typeof input.weightage !== "number"){
                return res.status(200).send({"code":"1", "message":"Invalid Weightage" });
            }
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    Questions.findOne({title: input.title}).then(function(result){
                        if(result == null){
                            input.createdBy = profile.id;
                            var skillsArr= [];
                            if("skills" in input){
                                if(input.skills.length > 0){
                                    input.skills.forEach(element => {
                                        skillsArr.push({"id": mongoose.Types.ObjectId(element.id), "level":element.level});                        
                                    });
                                }
                            }
                            input.skills = skillsArr;
        
                            var competenciesArr= [];
                            if("competencies" in input){
                                if(input.competencies.length > 0){
                                    input.competencies.forEach(element => {
                                        competenciesArr.push({"id": mongoose.Types.ObjectId(element.id), "level":element.level});                        
                                    });
                                }
                            }
                            input.competencies = competenciesArr;
        
                            var subCompsArr= [];
                            if("subCompetencies" in input){
                                if(input.subCompetencies.length > 0){
                                    input.subCompetencies.forEach(element => {
                                        subCompsArr.push({"id": mongoose.Types.ObjectId(element.id), "level":element.level});                        
                                    });
                                }
                            }
                            input.subCompetencies = subCompsArr;
                            Questions.create(input).then(function(result){
                                if(result){
                                    if(input.titleFile){
                                        var path = 'titleFiles/'+result._id+'.jpg';
                                        fs.writeFile('public/'+path, input.titleFile, 'base64', function(err){
                                          if(!err){
                                            console.log('image uploaded');
                                          }else{
                                            console.log(err);
                                          }
                                        });
                                        result.titleFile = req.protocol+'://'+req.headers.host+'/'+path;
                                        result.save(function(error){
                                            var resultObj = result.toObject();
                                            resultObj.id = resultObj._id;
                                            delete resultObj._id;
                                            resultObj.expiresAt = resultObj.expiresAt.toISOString().slice(0,10);
                                            return res.status(200).send({ "code": "0", "message": "Question created successfully", "data": resultObj});
                                        })
                                    }else{
                                        var resultObj = result.toObject();
                                        resultObj.id = resultObj._id;
                                        delete resultObj._id;  
                                        resultObj.expiresAt = resultObj.expiresAt.toISOString().slice(0,10);
                                        return res.status(200).send({ "code": "0", "message": "Question created successfully", "data": resultObj});
                                    }
                                }else{
                                    return res.status(200).send({ "code": "1", "message": "Question not added", "data": input});
                                }
                            }).catch(function(err){
                                return res.status(400).send({ "code": "1", "message": err.message});
                            });
                        }else{
                            //fs.unlink("public/uploads/"+req.files[0].filename);
                            input.id = result._id;
                            return res.status(200).send({ "code": "1", "message": "Question already exist", "data": input});
                        }
                    });        
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },

    createMultiQuestions : function(req, res){
        var input = req.body;
        const optionTypes = ["radiogroup", "checkbox", "boolean", "file", "imagepicker", "text", "rating"];
        const answerTypes = ["correctAnswer", "notApplicable"];

        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("questions" in input) || input.questions.length == 0){
            return res.send({"code":"1", "message":"Minimum 1 Question required", "data": input});
        }else{
            input.questions.forEach(question => {
                if(!("title" in question) || question.title.length == 0){
                    return res.send({"code":"1", "message":TITLE_REQUIRED, "data": question});
                }
                if(!("optionType" in question) || question.optionType.length == 0){
                    return res.send({"code":"1", "message":OPTION_TYPE_REQUIRED, "data": question});
                }else{
                    if(optionTypes.indexOf(question.optionType) < 0){
                        return res.send({"code":"1", "message":INVALID_OPTION_TYPE, "data": question});
                    }
                    else{
                        if(question.optionType === "radiogroup" || question.optionType === "checkbox"){
                            if(!("options" in question) || question.options.length < 2){
                                return res.send({"code":"1", "message":"Minimum 2 Options required", "data": input});
                            }else{
                                var optionsArr = [];
                                var optionsIds = [];
                                question.options.forEach(element => {
                                    if(optionsArr.indexOf(element.label) > -1){
                                        return res.send({ "code": "1", "message": "Option contains duplicate label", "data": question});
                                    }else if(optionsIds.indexOf(element.id) > -1){
                                        return res.send({ "code": "1", "message": "Option contains duplicate Id", "data": question});
                                    }else if(element.answer !== true && element.answer !== false){
                                        return res.send({ "code": "1", "message": "Option answer should be Boolean true/false", "data": question});
                                    }
                                    optionsArr.push(element.label);
                                    optionsIds.push(element.id);
                                });
                                
                            }
                        }
                    }
                }
                if(!("answerType" in question) || question.answerType.length == 0){
                    return res.send({"code":"1", "message":"Answer Type required", "data": question});
                }else{
                    if(answerTypes.indexOf(question.answerType) < 0){
                        return res.send({"code":"1", "message":"Invalid Answer Type", "data": question});
                    }
                }
                if("expiresAt" in question){
                    var pattern = /^\d{4}[-](0[1-9]|1[0-2])[-](0[1-9]|[12][0-9]|3[01])$/;
                    if(pattern.test(question.expiresAt) == false){
                        return res.status(200).send({"code":"1", "message":"Invalid Expiry date", "data": question });
                    }
                }
                if("weightage" in question){
                    if(typeof question.weightage !== "number"){
                        return res.status(200).send({"code":"1", "message":"Invalid Weightage", "data": question });
                    }
                }        
            })
        }

        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    var questionsArr = [];
                    var titleArr = [];
                    var i = 0;
                    input.questions.forEach(element => {
                        element.createdBy = profile.id;
                        var skillsArr= [];
                        element.skills.forEach(element => {
                            skillsArr.push({"id": mongoose.Types.ObjectId(element.id), "level":element.level});                        
                        });
                        element.skills = skillsArr;
        
                        var competenciesArr= [];
                        element.competencies.forEach(element => {
                            competenciesArr.push({"id": mongoose.Types.ObjectId(element.id), "level":element.level});                        
                        });
                        element.competencies = competenciesArr;
        
                        var subCompsArr= [];
                        element.subCompetencies.forEach(element => {
                            subCompsArr.push({"id": mongoose.Types.ObjectId(element.id), "level":element.level});                        
                        });
                        element.subCompetencies = subCompsArr;
        
                        questionsArr.push(element);
                        if(titleArr.indexOf(element.title) > -1){
                            return res.status(200).send({ "code": "1", "message": "Duplicate question title exist", "data": element});
                        }
                        if("description" in element){
                            if(typeof element.description !== 'string'){
                                return res.status(200).send({ "code": "1", "message": "Description not valid, must be a string", "data": element});
                            }
                        }
                        if("expiresAt" in input){
                            var pattern = /^\d{4}[-](0[1-9]|1[0-2])[-](0[1-9]|[12][0-9]|3[01])$/;
                            if(pattern.test(input.expiresAt) == false){
                                return res.status(200).send({"code":"1", "message":"Expiry date invalid" });
                            }
                        }
                        if("weightage" in input){
                            if(typeof input.weightage !== "number"){
                                return res.send({"code":"1", "message":"Weightage invalid" });
                            }
                        }
                        titleArr.push(element.title);
                    });
        
                    if(i == 0){
                        Questions.findOne({ title: { $in: titleArr } }).then(function(result){
                            if(result !== null){
                                var resultObj = result.toObject();
                                resultObj.id = resultObj._id;
                                delete resultObj._id;
                                resultObj.expiresAt = resultObj.expiresAt.toISOString().slice(0,10);
                                return res.send({ "code": "1", "message": "Question exist", "data": resultObj});
                            }else{
                                Questions.insertMany(questionsArr).then(function(result){
                                    if(result){
                                        var resultArr = [];
                                        result.forEach((row, index)=>{
                                            var resultObj = row.toObject();
                                            resultObj.id = resultObj._id;
                                            delete resultObj._id;
                                            resultObj.expiresAt = resultObj.expiresAt.toISOString().slice(0,10);
                                            resultArr.push(resultObj);
                                            if(Object.is(result.length -1, index)){
                                                return res.status(200).send({ "code": "0", "message": CREATED_SUCCESS, "data": resultArr});
                                            }
                                        })
                                    }
                                }).catch(function(err){
                                    return res.status(400).send({ "code": "1", "message": err.message});
                                });;
                            }
                        }).catch(function(err){
                            return res.status(200).send({ "code": "1", "message": err.message, "data": input});
                        });
                    }
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        });       
    },

    updateQuestion : function(req, res){
        var input = req.body;  
        const optionTypes = ["radiogroup", "checkbox", "boolean", "file", "imagepicker", "text", "rating"];
        const answerTypes = ["correctAnswer", "notApplicable"];
  
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("questionId" in input) || input.questionId.length == 0){
            return res.send({"code":"1", "message":"question Id required", "data": input});
        }
        if("title" in input){
            if(input.title.length == 0){
                return res.send({"code":"1", "message":TITLE_REQUIRED, "data": input});
            }
        }
        if(!("optionType" in input) || input.optionType.length == 0 ){
            return res.send({"code":"1", "message":"Option type required", "data": input});
        }else{
            if(optionTypes.indexOf(input.optionType) < 0){
                return res.send({"code":"1", "message":INVALID_OPTION_TYPE, "data": input});
            }
            else{
                if(input.optionType === "radiogroup" || input.optionType === "checkbox"){
                    if("options" in input){
                        if(input.options.length < 2){
                            return res.send({"code":"1", "message":"Minimum 2 Options required", "data": input});
                        }else{
                            var optionsArr = [];
                            var optionsIds = [];
                            input.options.forEach(element => {
                                if(optionsArr.indexOf(element.label) > -1){
                                    return res.send({ "code": "1", "message": "Option contains duplicate label", "data": element});
                                }else if(optionsIds.indexOf(element.id) > -1){
                                    return res.send({ "code": "1", "message": "Option contains duplicate Id", "data": element});
                                }else if(element.answer !== true && element.answer !== false){
                                    return res.send({ "code": "1", "message": "Option answer should be Boolean true/false", "data": element});
                                }
                                optionsArr.push(element.label);
                                optionsIds.push(element.id);
                            });
                        }
                    }
                }
            }
        }
        if("answerType" in input){
            if(answerTypes.indexOf(input.answerType) < 0){
                return res.send({"code":"1", "message":"Invalid Answer Type", "data": input});
            }
        }
        if("expiresAt" in input){
            var pattern = /^\d{4}[-](0[1-9]|1[0-2])[-](0[1-9]|[12][0-9]|3[01])$/;
            if(pattern.test(input.expiresAt) == false){
                return res.status(200).send({"code":"1", "message":"Invalid Expiry date" });
            }
        }
        if("weightage" in input){
            if(typeof input.weightage !== "number"){
                return res.status(200).send({"code":"1", "message":"Invalid Weightage" });
            }
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    Questions.findById(input.questionId).then(function(resultOne){
                        if(resultOne == null){
                            return res.status(200).send({ "code": "1", "message": "Question not exist", "data": input});
                        }else{
                            Questions.countDocuments({ title: input.title, _id: { $ne: input.questionId}}).then(function(resultTwo){
                                console.log(resultTwo);
                                if(resultTwo == 0){
                                    var skillsArr= [];
                                    if("skills" in input){
                                        if(input.skills.length > 0){
                                            input.skills.forEach(element => {
                                                skillsArr.push({"id": mongoose.Types.ObjectId(element.id), "level":element.level});                        
                                            });                                            
                                        }
                                        resultOne.skills = skillsArr;                                
                                    }                                    
                
                                    var competenciesArr= [];
                                    if("competencies" in input){
                                        if(input.competencies.length > 0){
                                            input.competencies.forEach(element => {
                                                competenciesArr.push({"id": mongoose.Types.ObjectId(element.id), "level":element.level});                        
                                            });                                            
                                        }
                                        resultOne.competencies = competenciesArr;
                                    }                                    
                
                                    var subCompsArr= [];
                                    if("subCompetencies" in input){
                                        if(input.subCompetencies.length > 0){
                                            input.subCompetencies.forEach(element => {
                                                subCompsArr.push({"id": mongoose.Types.ObjectId(element.id), "level":element.level});                        
                                            });                                            
                                        }
                                        resultOne.subCompetencies = subCompsArr;
                                    }                                    
        
                                    if("title" in input){ resultOne.title = input.title; }
                                    if("state" in input){ resultOne.state = input.state; }
                                    if("optionType" in input){ resultOne.optionType = input.optionType; }
                                    if("questionType" in input){ resultOne.questionType = input.questionType; }
                                    if("answerType" in input){ resultOne.answerType = input.answerType; }
                                    if("expiresAt" in input){ resultOne.expiresAt = input.expiresAt; }
                                    if("weightage" in input){ resultOne.weightage = input.weightage; }
                                    if("options" in input){ resultOne.options = input.options; }
                                    if("fixedOptionsOrder" in input){ resultOne.fixedOptionsOrder = input.fixedOptionsOrder; }
                                    resultOne.updatedBy = profile.id;
        
                                    resultOne.save(function(error){
                                        if(!error){
                                            var resultObj = resultOne.toObject();
                                            resultObj.id = resultObj._id;
                                            delete resultObj._id;
                                            resultObj.expiresAt = resultObj.expiresAt.toISOString().slice(0,10);
                                            return res.status(200).send({ "code": "0", "message": "Question updated successfully", "data": resultObj});
                                        }else{
                                            return res.status(200).send({ "code": "1", "message": "Question not added", "data": error});
                                        }
                                    });
                                }else{
                                    return res.status(200).send({ "code": "1", "message": "Question already exist", "data": input});
                                }
                            });
                        }
                    }).catch(function(){
                        return res.status(200).send({ "code": "1", "message": "Question ID not valid", "data": input});
                    });        
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        });           
    },

    getQuestions : function(req, res){
        var input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    let filterObj = [];
                    if("ownerId" in input){
                        if(input.ownerId != ""){
                            filterObj.push({ownerId: input.ownerId});
                        }
                    }else{
                        if("skills" in input){
                            if(input.skills.length > 0){        
                                let filterSkillsArr = [];
                                input.skills.forEach(element => {                                
                                    if(element.level !== ""){
                                        filterSkillsArr.push({ id: mongoose.Types.ObjectId(element.id), level: element.level });
                                    }else{
                                        filterSkillsArr.push({ id: mongoose.Types.ObjectId(element.id) });
                                    }
                                });
                                filterObj.push({skills: { $elemMatch: { $or: filterSkillsArr}}});
                            }
                        }
                        if("competencies" in input){
                            if(input.competencies.length !== 0){
                                let filterCompArr = [];
                                input.competencies.forEach(element => {
                                    if(element.level !== ""){
                                        filterCompArr.push({ id: mongoose.Types.ObjectId(element.id), level: element.level });
                                    }else{
                                        filterCompArr.push({ id: mongoose.Types.ObjectId(element.id) });
                                    }
                                });
                                filterObj.push({competencies: { $elemMatch: { $or: filterCompArr}}});
                            }
                        }
                        if("subCompetencies" in input){
                            if(input.subCompetencies.length !== 0){
                                let filterSubCompArr = [];
                                input.subCompetencies.forEach(element => {
                                    if(element.level !== ""){
                                        filterSubCompArr.push({ id: mongoose.Types.ObjectId(element.id), level: element.level });
                                    }else{
                                        filterSubCompArr.push({ id: mongoose.Types.ObjectId(element.id) });
                                    }
                                });
                                filterObj.push({subCompetencies: { $elemMatch: { $or: filterSubCompArr}}});
                            }
                        }
                    }
                    //var filterObj =  [ {skills: { $elemMatch: { $or: filterSkillsArr}}}, { competencies: { $elemMatch: { $or: filterCompArr }}}, {subCompetencies: { $elemMatch: { $or: filterSubCompArr }}} ]
        
                    console.log(filterObj);
                    if(filterObj.length >0){
                        totalFilterObj = { $or: filterObj };
                    }else{
                        totalFilterObj = {};
                    }            
                    if("state" in input){
                        totalFilterObj.state = input.state;
                    }
                    if("active" in input){
                        totalFilterObj.active = input.active;
                    }
                    //return res.send(totalFilterObj);
                    Questions.find(totalFilterObj).then(function(result){
                        if(result.length > 0){
                            var resultArr = [];
                            result.forEach((row, index)=>{
                                var resultObj = row.toObject();
                                resultObj.id = resultObj._id;
                                delete resultObj._id;
                                resultObj.expiresAt = resultObj.expiresAt.toISOString().slice(0,10);
                                resultArr.push(resultObj);
                                if(Object.is(result.length -1, index)){
                                    return res.status(200).send({ "code": "0", "message": SUCCESS, "data": resultArr});
                                }
                            })
                        }else{
                            return res.status(200).send({ "code": "1", "message": SUCCESS, "data": []});
                        }
                    }).catch(function(err){
                        return res.status(200).send({ "code": "1", "message": err.message, "data": input});
                    });        
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        });
    },
    
    updateStatus : function(req, res){
        var input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("questionId" in input) || input.questionId.length == 0){
            return res.send({"code":"1", "message":"Question Id required", "data": input});
        }
        if(!("active" in input) || input.active.length == 0){
            return res.send({"code":"1", "message":ACTIVE_REQUIRED, "data": input});
        }else{
            if(input.active !== false && input.active !== true ){
                return res.send({"code":"1", "message":INVALID_ACTIVE_VALUE, "data": input});
            }
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    Questions.findById(input.questionId).then(function(result){
                        if(result == null){
                            return res.status(200).send({ "code": "1", "message": "Question not exist", "data": input});
                        }else{
                            result.active = input.active;
                            result.updatedBy = profile.id;
                            result.save(function(){
                                var resultObj = result.toObject();
                                resultObj.id = resultObj._id;
                                delete resultObj._id;
                                resultObj.expiresAt = resultObj.expiresAt.toISOString().slice(0,10);
                                if(input.active){
                                    return res.send({ "code": "0", "message": ACTIVATED, "data": resultObj});
                                }else{
                                    return res.send({ "code": "0", "message": DEACTIVATED, "data": resultObj});
                                }
                            });
                        }
                    }).catch(function(){
                        return res.status(200).send({ "code": "1", "message": "Question ID not valid", "data": input});
                    });
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },

    getRandomQuestions: function(req, res){
        var input = req.body;
        if(!("questionIdsToSkip" in input) || (typeof input.questionIdsToSkip) != "object"){
            return res.send({"code":"1", "message":"Question Ids to skip required", "data": input});
        }
        console.log(typeof input);
        var filters = {_id:{$nin:input.questionIdsToSkip}, state: "approved", active: true }
        if("competency" in input){
            if("id" in input.competency && "level" in input.competency){
                if(input.competency.id !== "" && input.competency.level !== "")
                var uid = input.competency.id;
                filters.competencies= { $elemMatch: {id: mongoose.Types.ObjectId(uid), level: input.competency.level}};
                //return res.send(filter);
            }
        }else if("subCompetency" in input){
            if("id" in input.subCompetency && "level" in input.subCompetency){
                if(input.subCompetency.id !== "" && input.subCompetency.level !== "")
                var uid = input.subCompetency.id;
                filters.subCompetencies= { $elemMatch: {id: mongoose.Types.ObjectId(uid), level: input.subCompetency.level}};
                //return res.send(filter);
            }
        }else if("skill" in input){
            if("id" in input.skill && "level" in input.skill){
                if(input.skill.id !== "" && input.skill.level !== "")
                var uid = input.skill.id;
                filters.skills= { $elemMatch: {id: mongoose.Types.ObjectId(uid), level: input.skill.level}};
                //return res.send(filter);
            }
        }else{
            return res.send({"code":"1", "message":"Skills or Competencies or SubCompetencies Ids required", "data": input});
        }
                
        Questions.countDocuments(filters).then(function(resultA){
            if(resultA > 0){
                var rand = Math.floor(Math.random() * resultA);
                Questions.findOne(filters).skip(rand).then(function(result){
                    if(result == null){
                        return res.status(200).send({ "code": "1", "message": "Questions not exist", "data": input});
                    }else{
                        if(result.fixedOptionsOrder == false){
                            var a = result.options;
                            for (let i = a.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [a[i], a[j]] = [a[j], a[i]];
                            }
                            result.options = a;
                        }
                        var resultObj = result.toObject();
                        resultObj.id = resultObj._id;
                        delete resultObj._id;
                        resultObj.expiresAt = resultObj.expiresAt.toISOString().slice(0,10);
                        return res.status(200).send({ "code": "0", "message": SUCCESS, "data": resultObj});
                    }
                }).catch(function(){
                    return res.status(200).send({ "code": "1", "message": "Question IDs not valid", "data": input});
                });
            }else{
                return res.status(200).send({ "code": "1", "message": "Can not find questions", "data": input});
            }
        }).catch(function(){
            return res.send({"code":"1","message":"Error"});
        });   
    },
    getQuestionById: function(req, res){
        let input = req.body;
        if(!("questionId" in input) || input.questionId.length == 0){
            return res.send({"code":"1", "message":"Question Id required", "data": input});
        }
        Questions.findById(input.questionId).then(function(result){
            if(result){
                var resultObj = result.toObject();
                resultObj.id = resultObj._id;
                delete resultObj._id;
                resultObj.expiresAt = resultObj.expiresAt.toISOString().slice(0,10);
                return res.status(200).send({ "code": "0", "message": SUCCESS, "data": resultObj});
            }else{
                return res.status(200).send({ "code": "1", "message": FAIL, "data": {}});
            }
        }).catch((err)=>{
            return res.status(200).send({ "code": "1", "message": err.message});
        })
    },
    validateToken: function(token, callback){
        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "http://"+base_url+":3000/api/get-my-profile",
            "body": JSON.stringify({"token":token})
        }, (error, response, body) => {
            if(error) {
                console.log(error);
                return false;
            }
            var result = JSON.parse(body);
            if(result.code == '0'){
                console.log(true);
                callback(result.data);
            }else{
                console.log(false);
                callback(false);
            }
        });
    },
}