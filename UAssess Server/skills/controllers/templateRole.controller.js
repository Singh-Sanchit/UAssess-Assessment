const TemplateRoles = require('../models/templateRole.model');
const Skills = require('../models/skill.model');
const SubCompetencies = require('../models/subCompetency.model');
const Competencies = require('../models/competency.model');
const Request = require('request');
require('../config/messages');

module.exports = {
    
    createTemplateRole: function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("label" in input) || input.label.length == 0){
            return res.send({"code":"1", "message":"Label required", "data": input});
        }else{
            if(typeof input.label !== 'string'){
                return res.send({ "code": "1", "message": "Label not valid, must be a string", "data": input});
            }
        }
        if("description" in input){
            if(typeof input.description !== 'string'){
                return res.send({ "code": "1", "message": "Description not valid, must be a string", "data": input});
            }
        }
        if("skills" in input){
            if(typeof input.skills !== 'object'){
                return res.send({ "code": "1", "message": "Skills not valid, must be an Array of skill Ids", "data": input});
            }
            if(input.skills === null){
                return res.send({ "code": "1", "message": "Skills not valid, must be an Array of skill Ids", "data": input});
            }
            input.skills.forEach(element => {
                Skills.findById(element.id).then(function(result){
                    if(result == null){
                        return res.status(200).send({ "code": "1", "message": "Skill does not exist", "data": {"skillId":element.id}});
                    }
                }).catch(function(err){
                        return res.status(200).send({ "code": "1", "message": err.message, "data": {"skillId":element.id}});
                });;
            });
        }
        if("competencies" in input){
            if(typeof input.competencies !== 'object'){
                return res.status(200).send({ "code": "1", "message": "Competencies not valid, must be an Array of skill Ids", "data": input});
            }
            if(input.competencies === null){
                return res.status(200).send({ "code": "1", "message": "Competencies not valid, must be an Array of skill Ids", "data": input});
            }
            input.competencies.forEach(element => {
                Competencies.findById(element.id).then(function(result){
                    if(result == null){
                        return res.status(200).send({ "code": "1", "message": "Competency does not exist", "data": {"competencyId":element.id}});
                    }
                }).catch(function(err){
                        return res.status(200).send({ "code": "1", "message": "Competency does not exist", "data": {"competencyId":element.id}});
                });;
            });
        }
        if("subCompetencies" in input){
            if(typeof input.subCompetencies !== 'object'){
                return res.status(200).send({ "code": "1", "message": "Sub Competencies not valid, must be an Array of skill Ids", "data": input});
            }
            if(input.subCompetencies === null){
                return res.status(200).send({ "code": "1", "message": "Sub Competencies not valid, must be an Array of skill Ids", "data": input});
            }
            input.subCompetencies.forEach(element => {
                SubCompetencies.findById(element.id).then(function(result){
                    if(result == null){
                        return res.status(200).send({ "code": "1", "message": "Sub Competency does not exist", "data": {"subCompetencyId":element.id}});
                    }
                }).catch(function(err){
                        return res.status(200).send({ "code": "1", "message": "Sub Competency does not exist", "data": {"subCompetencyId":element.id}});
                });
            });
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    TemplateRoles.findOne({ label: input.label }).then(function(resultOne){
                        if(resultOne){
                            return res.status(200).send({ "code": "1", "message": "Role already exist", "data": input});
                        }else{
                            input.createdBy = profile.id;
                            TemplateRoles.create(input).then(function(resultTwo){
                                if(resultTwo){
                                    var resultObj = resultTwo.toObject();
                                    resultObj.id = resultObj._id;
                                    delete resultObj._id;
                                    return res.status(200).send({ "code": "0", "message":SUCCESS, "data": resultObj })
                                }else{
                                    return res.status(200).send({ "code": "1", "message": FAIL, "data": input});
                                }
                            });
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

    updateTemplateRole: function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("templateRoleId" in input) || input.templateRoleId.length == 0){
            return res.send({"code":"1", "message":"Template Role Id required", "data": input});
        }
        if("label" in input){
            if(typeof input.label !== 'string'){
                return res.status(200).send({ "code": "1", "message": "Label not valid, must be a string", "data": input});
            }
        }
        if("description" in input){
            if(typeof input.description !== 'string'){
                return res.status(200).send({ "code": "1", "message": "Description not valid, must be a string", "data": input});
            }
        }
        if("skills" in input){
            if(typeof input.skills !== 'object'){
                return res.status(200).send({ "code": "1", "message": "Skills not valid, must be an Array of skill Ids", "data": input});
            }
            if(input.skills === null){
                return res.status(200).send({ "code": "1", "message": "Skills not valid, must be an Array of skill Ids", "data": input});
            }
        }
        if("competencies" in input){
            if(typeof input.competencies !== 'object'){
                return res.status(200).send({ "code": "1", "message": "Competencies not valid, must be an Array of skill Ids", "data": input});
            }
            if(input.competencies === null){
                return res.status(200).send({ "code": "1", "message": "Competencies not valid, must be an Array of skill Ids", "data": input});
            }
        }
        if("subCompetencies" in input){
            if(typeof input.subCompetencies !== 'object'){
                return res.status(200).send({ "code": "1", "message": "Sub Competencies not valid, must be an Array of skill Ids", "data": input});
            }
            if(input.subCompetencies === null){
                return res.status(200).send({ "code": "1", "message": "Sub Competencies not valid, must be an Array of skill Ids", "data": input});
            }
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    TemplateRoles.count({ label: input.label, _id: { $ne: input.templateRoleId } }).then(function(resultCount){
                        if(resultCount == 0){
                            TemplateRoles.findById(input.templateRoleId).then(function(result){
                                if(result){
                                    if("label" in input){
                                        result.label = input.label;
                                    }
                                    if("description" in input){
                                        result.description = input.description;
                                    }
                                    if("skills" in input){
                                        result.skills = input.skills;
                                    }
                                    if("competencies" in input){
                                        result.competencies = input.competencies;
                                    }
                                    if("subCompetencies" in input){
                                        result.subCompetencies = input.subCompetencies;
                                    }
                                    result.updatedBy = input.updatedBy;
                                    result.save(function(error){
                                        if(!error){
                                            var resultObj = result.toObject();
                                            resultObj.id = resultObj._id;
                                            delete resultObj._id;        
                                            return res.status(200).send({ "code": "0", "message":SUCCESS, "data": resultObj })
                                        }else{
                                            return res.status(200).send({ "code": "1", "message": "Role already exist", "data": input});
                                        }
                                    });
                                }else{
                                    return res.status(200).send({ "code": "1", "message": "Role not exist", "data": input});
                                }
                            });
                        }else{
                            return res.status(200).send({ "code": "1", "message": "Role Label already exist", "data": input});
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
        })               
    },
    getTemplateRoles : function(req, res){
        let input = req.body;
        let filters = {};
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("active" in input) || input.active.length == 0){
            return res.status(200).send({"code":"1", "message":ACTIVE_REQUIRED });
        }
        if(input.active !== false && input.active !== true ){
            return res.send({"code":"1", "message":INVALID_ACTIVE_VALUE, "data": input});
        }
        filters.active = input.active;
        if("ids" in input){
            if(input.ids.length > 0){
                filters._id = {$in:input.ids};
            }
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1 || profile.privilegeRoles.indexOf("CompanyAdmin")>-1){
                    TemplateRoles.find(filters).then(function(result){
                        let resultArr = [];
                        if(result.length > 0){
                            result.forEach((element, index)=>{
                                let data = element.toObject();
                                data.id = data._id;
                                delete data._id;
                                resultArr.push(data);
                                if(Object.is(result.length -1, index)){
                                    return res.status(200).send({ "code": "0", "message": SUCCESS, "data": resultArr});
                                }
                            })
                        }else{
                            return res.status(200).send({ "code": "0", "message": SUCCESS, "data": resultArr});
                        }                   

                    }).catch(function(){
                        return res.status(200).send({ "code": "1", "message": "Skills not exist", "data": input});
                    });
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },
    updateStatus : function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("active" in input) || input.active.length == 0){
            return res.status(200).send({"code":"1", "message":ACTIVE_REQUIRED });
        }
        if(input.active !== false && input.active !== true ){
            return res.send({"code":"1", "message":INVALID_ACTIVE_VALUE, "data": input});
        }
        if(!("templateRoleId" in input) || input.templateRoleId.length == 0){
            return res.send({"code":"1", "message":"Template role Id required", "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    TemplateRoles.findById(input.templateRoleId).then(function(result){
                        if(result == null){
                            return res.status(200).send({ "code": "1", "message": "Template Role not exist", "data": input});
                        }else{
                            result.active = input.active;
                            result.updatedBy = profile.id;
                            result.save(function(){
                                var resultObj = result.toObject();
                                resultObj.id = resultObj._id;
                                delete resultObj._id;
                                if(input.active){
                                    return res.status(200).send({ "code": "0", "message": "Template Role Activated", "data": resultObj});
                                }else{
                                    return res.status(200).send({ "code": "0", "message": "Template Role Deactivated", "data": resultObj});
                                }
                            });
                        }
                    }).catch(function(){
                        return res.status(200).send({ "code": "1", "message": "Template Role ID not valid", "data": input});
                    });
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
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
    }
}