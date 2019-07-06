const SkillGroups = require('../models/skillGroup.model');
const Request = require('request');
require('../config/messages');

module.exports = {
    createSkillGroup : function(req, res, next){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("label" in input) || input.label.length == 0){
            return res.send({"code":"1", "message":LABEL_REQUIRED, "data": input});
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
        if("templateRoleIds" in input){
	        if(typeof input.templateRoleIds !== 'object'){
	            return res.status(200).send({ "code": "1", "message": "template Role Ids not valid, must be an Array of Strings", "data": input});
	        }
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    SkillGroups.findOne({ label: input.label }).then(function(result){
                        if(result !== null){
                            var resultObj = result.toObject();
                            resultObj.id = resultObj._id;
                            delete resultObj._id;
                            return res.status(200).send({ "code": "1", "message": "Skill group exist", "data": resultObj});
                        }else{
                            input.createdBy = profile.id;
                            SkillGroups.create(input).then(function(result){
                                if(result){
                                    var resultObj = result.toObject();
                                    resultObj.id = resultObj._id;
                                    delete resultObj._id;
                                    return res.status(200).send({ "code": "0", "message": "Skill group added successfully", "data": resultObj});
                                }
                            });
                        }
                    }).catch(function(){
                        return res.status(200).send({ "code": "1", "message": "Somthing went wrong", "data": input});
                    });        
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })               
    },

    updateSkillGroup : function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if("label" in input){
            if(typeof input.label !== 'string'){
                return res.send({ "code": "1", "message": "Label not valid, must be a string", "data": input});
            }
        }
        if("description" in input){
            if(typeof input.description !== 'string'){
                return res.send({ "code": "1", "message": "Description not valid, must be a string", "data": input});
            }
        }
        if(!("skillGroupId" in input) || input.skillGroupId.length == 0){
            return res.status(200).send({"code":"1", "message":"Skill Group Id required" });
        }
        if("templateRoleIds" in input){
	        if(typeof input.templateRoleIds !== 'object'){
	            return res.status(200).send({ "code": "1", "message": "template Role Ids not valid, must be an Array of Strings", "data": input});
	        }
        }

        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    SkillGroups.findById(input.skillGroupId).then(function(result){
                        if(result == null){
                            return res.status(200).send({ "code": "1", "message": "Skill group not exist", "data": input});
                        }else{
                            SkillGroups.count({ label: input.label, _id: { $ne: input.skillGroupId}}).then(function(resultTwo){
                                if(resultTwo == 0){
                                    if("label" in input){ result.label = input.label;}
                                    if("description" in input){ result.description = input.description;}
                                    if("templateRoleIds" in input){
                                        if(input.templateRoleIds && input.templateRoleIds.length > 0){
                                            if(input.templateRoleIds.indexOf("") > -1 || input.templateRoleIds.indexOf(null) > -1 ){
                                                return res.status(200).send({ "code": "1", "message": "Template Roles contains empty", "data": input});
                                            }else{
                                                result.templateRoleIds = input.templateRoleIds;
                                            }
                                        }
                                    }                                
                                    result.updatedBy = profile.id;
                                    result.save(function(error){
                                        if(!error){
                                            var resultObj = result.toObject();
                                            resultObj.id = resultObj._id;
                                            delete resultObj._id;
                                            return res.status(200).send({ "code": "0", "message": "Skill group updated successfully", "data": resultObj});
                                        }else{
                                            return res.status(200).send({ "code": "1", "message": "Skill group not added", "data": input});
                                        }
                                    });
                                }else{
                                    return res.status(200).send({ "code": "1", "message": "Skill group label already exist", "data": input});
                                }
                            });
                        }
                    }).catch(function(){
                        return res.status(200).send({ "code": "1", "message": "Skill group Id not valid", "data": input});
                    });        
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },
    
    getSkillGroups : function(req, res){
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
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    SkillGroups.find(filters).then(function(result){
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
        if(!("skillGroupId" in input) || input.skillGroupId.length == 0){
            return res.send({"code":"1", "message":"skillGroupId required", "data": input});
        }
        if(!("active" in input) || input.active.length == 0){
            return res.status(200).send({"code":"1", "message":ACTIVE_REQUIRED });
        }
        if(input.active !== false && input.active !== true ){
            return res.send({"code":"1", "message":INVALID_ACTIVE_VALUE, "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    SkillGroups.findById(input.skillGroupId).then(function(result){
                        if(result == null){
                            return res.status(200).send({ "code": "1", "message": "Skill group not exist", "data": input});
                        }else{
                            result.active = input.active;
                            result.updatedBy = profile.id;
                            result.save(function(){
                                var resultObj = result.toObject();
                                resultObj.id = resultObj._id;
                                delete resultObj._id;
                                if(input.active){
                                    return res.status(200).send({ "code": "0", "message":ACTIVATED, "data": resultObj});
                                }else{
                                    return res.status(200).send({ "code": "0", "message": DEACTIVATED, "data": resultObj});
                                }
                            });
                        }
                    }).catch(function(){
                        return res.status(200).send({ "code": "1", "message": "Skill group Id not valid", "data": input});
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