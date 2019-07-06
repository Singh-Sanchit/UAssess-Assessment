const Skills = require('../models/skill.model');
const mongoose = require('mongoose');
var Request = require('request');
require('../config/messages');

module.exports = {
    createSkills : function(req, res, next){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("skills" in input) || input.skills.length == 0){
            return res.send({"code":"1", "message":"Skills required", "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    var skillsArr = [];
                    var labelArr = [];
                    input.skills.forEach(element => {
                        element.createdBy = profile.id;
                        skillsArr.push(element);
                        if(labelArr.indexOf(element.label) > -1){
                            return res.status(200).send({ "code": "1", "message": "Skill label exist multiple times in the requests", "data": element});
                        }
                        if("description" in element){
                            if(typeof element.description !== 'string'){
                                return res.status(200).send({ "code": "1", "message": "Description should be a string", "data": element});
                            }
                        }
                        labelArr.push(element.label);
                    });
        
                    if(labelArr.length > 0){
                        Skills.findOne({ label: { $in: labelArr } }).then(function(result){
                            if(result !== null){
                                var resultObj = result.toObject();
                                resultObj.id = resultObj._id;
                                delete resultObj._id;
                                return res.status(200).send({ "code": "1", "message": "Skill label already exist in DB", "data": resultObj});
                            }else{
                                Skills.insertMany(skillsArr).then(function(result){
                                    if(result){
                                        var resultArr = [];
                                        result.forEach((row, index)=>{
                                            var resultObj = row.toObject();
                                            resultObj.id = resultObj._id;
                                            delete resultObj._id;
                                            resultArr.push(resultObj);
                                            if(Object.is(result.length -1, index)){
                                                return res.status(200).send({ "code": "0", "message": CREATED_SUCCESS, "data": resultArr});
                                            }
                                        })
                                    }
                                });
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
        })
    },

    updateSkill : function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("skillId" in input) || input.skillId.length == 0){
            return res.send({"code":"1", "message":"Skill Id required", "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    if("label" in input){
                        if(typeof input.label !== 'string'){
                            return res.status(200).send({ "code": "1", "message": "Label not valid, must be a string", "data": input});
                        }
                        if(input.label.length > 0){
                            Skills.countDocuments({ label: input.label, _id: { $ne: input.skillId}}).then(function(count){
                                if(count > 0){
                                    return res.status(200).send({ "code": "1", "message": "Skill label already exist", "data": input});
                                }
                            })
                        }
                    }            
                    Skills.findById(input.skillId).then(function(result){
                        if(result == null){
                            return res.status(200).send({ "code": "1", "message": "Skill not exist", "data": input});
                        }else{
                            if("label" in input){ result.label = input.label; }
                            if("description" in input){
                                if(typeof input.description !== 'string'){
                                    return res.status(200).send({ "code": "1", "message": "Description not valid, must be a string", "data": input});
                                }else{
                                    result.description = input.description;
                                }
                            }                            
                            if(input.competencyIds && input.competencyIds.length > 0){
                                if(input.competencyIds.indexOf("") > -1 || input.competencyIds.indexOf(null) > -1 ){
                                    return res.status(200).send({ "code": "1", "message": "sub competencies contains empty", "data": input});
                                }else{
                                    result.competencyIds = input.competencyIds;
                                }
                            }
                            result.updatedBy = profile.id;
                            result.save(function(error){
                                var resultObj = result.toObject();
                                resultObj.id = resultObj._id;
                                delete resultObj._id;
                                if(!error){
                                    return res.status(200).send({ "code": "0", "message": UPDATED_SUCCESS, "data": resultObj});
                                }else{
                                    return res.status(200).send({ "code": "1", "message": "Skill not added", "data": input});
                                }
                            });
                        }
                    }).catch(function(){
                        return res.status(200).send({ "code": "1", "message": "Skill ID not valid", "data": input});
                    });
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },
    // updateCompetencyIds : function(req, res){
    //     let input = req.body;
    //     if(!input.token){
    //         return res.status(200).send({"code":"1", "message":"Token is missing" });
    //     }
    //     if(!input.skillId){
    //         return res.status(200).send({"code":"1", "message":"Label is missing" });
    //     }
    //     if(!input.competencyIds){
    //         return res.status(200).send({"code":"1", "message":"Competency ID's missing" });
    //     }
    //     if(input.token == "1-2-3"){

    //         Skills.findById(input.skillId).then(function(result){
    //             if(result != null){
    //                 var compIdsArr= [];
    //                 input.competencyIds.forEach(element => {
    //                     compIdsArr.push(mongoose.Types.ObjectId(element));                        
    //                 });
    //                 result.competencyIds = compIdsArr;
    //                 result.save(function(){
    //                     return res.status(200).send({ "code": "0", "message": "Competency Ids updated successfully", "data": result});
    //                 });
    //             }else{
    //                 input.skillId = result._id;
    //                 return res.status(200).send({ "code": "1", "message": "Skill not exist", "data": input});
    //             }
    //         }).catch(function(){
    //             return res.status(200).send({ "code": "1", "message": "Skill ID not valid", "data": input});
    //         });

    //     }else{
    //         return res.status(200).send({ "code": "1", "message": "Token not valid", "data": input});
    //     }
    // },
    getSkills : function(req, res){
        let input = req.body;
        let filters = {};
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("active" in input) || input.active.length == 0){
            return res.status(200).send({"code":"1", "message": ACTIVE_REQUIRED });
        }
        if(input.active !== false && input.active !== true ){
            return res.send({"code":"1", "message": INVALID_ACTIVE_VALUE, "data": input});
        }
        filters.active = input.active;
        if("ids" in input){
            if(input.ids.length > 0){
                filters._id = {$in:input.ids};
            }
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                // if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    Skills.find(filters).then(function(result){
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
                    }).catch(function(err){
                        return res.status(200).send({ "code": "1", "message": err.message, "data": input});
                    });
                // }else{
                //     return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                // }
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
        if(!("skillId" in input) || input.skillId.length == 0){
            return res.send({"code":"1", "message":"Skill Id required", "data": input});
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
                    Skills.findById(input.skillId).then(function(result){
                        if(result == null){
                            return res.status(200).send({ "code": "1", "message": "Skill not exist", "data": input});
                        }else{
                            result.active = input.active;
                            result.updatedBy = profile.id;
                            result.save(function(){
                                var resultObj = result.toObject();
                                resultObj.id = resultObj._id;
                                delete resultObj._id;
                                if(input.active){
                                    return res.status(200).send({ "code": "0", "message": ACTIVATED, "data": resultObj});
                                }else{
                                    return res.status(200).send({ "code": "0", "message": DEACTIVATED, "data": resultObj});
                                }
                            });
                        }
                    }).catch(function(){
                        return res.status(200).send({ "code": "1", "message": "Skill ID not valid", "data": input});
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
    },
}