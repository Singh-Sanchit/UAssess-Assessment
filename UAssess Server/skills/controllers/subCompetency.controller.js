const SubCompetencies = require('../models/subCompetency.model');
const Competencies = require('../models/competency.model');
const Request = require('request');
require('../config/messages');

module.exports = {
    createSubCompetencies: function(req, res){
        var input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("subCompetencies" in input) || input.subCompetencies.length == 0){
            return res.send({"code":"1", "message":"subCompetencies required", "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    var subCompArr = [];
                    var labelArr = [];
                    input.subCompetencies.forEach(element => {
                        element.createdBy = profile.id;
                        subCompArr.push(element);
                        if(labelArr.indexOf(element.label) > -1){
                            return res.status(200).send({ "code": "1", "message": "Sub Competency label exist multiple times in the requests", "data": element});
                        }
                        if("label" in element){
                            if(typeof element.label !== 'string'){
                                return res.status(200).send({ "code": "1", "message": "Label should be a string", "data": element});
                            }
                        }
                        if("description" in element){
                            if(typeof element.description !== 'string'){
                                return res.status(200).send({ "code": "1", "message": "Description should be a string", "data": element});
                            }
                        }
                        labelArr.push(element.label);
                    });
                    if(labelArr.length > 0){
                        SubCompetencies.findOne({ label: { $in: labelArr } }).then(function(result){
                            if(result !== null){
                                var resultObj = result.toObject();
                                resultObj.id = resultObj._id;
                                delete resultObj._id;
                                return res.status(200).send({ "code": "1", "message": "Sub Competency exist", "data": resultObj});
                            }else{
                                SubCompetencies.insertMany(subCompArr).then(function(result){
                                    if(result){
                                        var resultArr = [];
                                        result.forEach((row, index)=>{
                                            var resultObj = row.toObject();
                                            resultObj.id = resultObj._id;
                                            delete resultObj._id;
                                            resultArr.push(resultObj);
                                            if(Object.is(result.length -1, index)){
                                                return res.status(200).send({ "code": "0", "message": "Sub Competencies added successfully", "data": resultArr});
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

    updateSubCompetency: function(req, res){

        var input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("subCompetencyId" in input) || input.subCompetencyId.length == 0){
            return res.send({"code":"1", "message":"subCompetency Id required", "data": input});
        }

        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    if("label" in input){
                        if(typeof input.label !== 'string'){
                            return res.status(200).send({ "code": "1", "message": "Label not valid, must be a string", "data": input});
                        }
                        if(input.label.length > 0){
                            SubCompetencies.countDocuments({ label: input.label, _id: { $ne: input.subCompetencyId}}).then(function(count){
                                if(count > 0){
                                    return res.status(200).send({ "code": "1", "message": "Sub Competency label already exist", "data": input});
                                }
                            })
                        }
                    }

                    SubCompetencies.findById(input.subCompetencyId).then(function(result){
                        if(result == null){
                            return res.status(200).send({ "code": "1", "message": "Sub Competency not exist", "data": input});
                        }else{
                            if("label" in input){ result.label = input.label; }
                            if("description" in input){
                                if(typeof input.description !== 'string'){
                                    return res.status(200).send({ "code": "1", "message": "Description not valid, must be a string", "data": input});
                                }else{
                                    result.description = input.description;
                                }
                            }
                            result.updatedBy = profile.id;
                            result.save(function(error){
                                if(!error){
                                    var resultObj = result.toObject();
                                    resultObj.id = resultObj._id;
                                    delete resultObj._id;
                                    return res.status(200).send({ "code": "0", "message": UPDATED_SUCCESS, "data": resultObj});
                                }else{
                                    return res.status(200).send({ "code": "1", "message": FAIL, "data": input});
                                }
                            });
                        }
                    }).catch(function(){
                        return res.status(200).send({ "code": "1", "message": "Competency ID not valid", "data": input});
                    });
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },
    getSubCompetencies : function(req, res){
        var input = req.body;
        let filters = {};
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("active" in input) || input.active.length == 0){
            return res.send({"code":"1", "message":ACTIVE_REQUIRED, "data": input});
        }else{
            if(input.active !== false && input.active !== true ){
                return res.send({"code":"1", "message":INVALID_ACTIVE_VALUE, "data": input});
            }
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
                    SubCompetencies.find(filters).then(function(result){
                        if(result.length == 0){
                            return res.status(200).send({ "code": "0", "message": SUCCESS, "data": []});
                        }else{
                            var resultArr = [];
                            result.forEach((row, index)=>{
                                var resultObj = row.toObject();
                                resultObj.id = resultObj._id;
                                delete resultObj._id;
                                resultArr.push(resultObj);
                                if(Object.is(result.length -1, index)){
                                    return res.status(200).send({ "code": "0", "message": SUCCESS, "data": resultArr});
                                }
                            })
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
    updateStatus : function(req, res){
        var input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("subCompetencyId" in input) || input.subCompetencyId.length == 0){
            return res.send({"code":"1", "message":"sub Competency Id required", "data": input});
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
                    SubCompetencies.findById(input.subCompetencyId).then(function(result){
                        if(result == null){
                            return res.status(200).send({ "code": "1", "message": "sub-Competency not exist", "data": input});
                        }else{
                            result.active = input.active;
                            result.updatedBy = profile.id;
                            result.save(function(){
                                var resultObj = result.toObject();
                                resultObj.id = resultObj._id;
                                delete resultObj._id;
                                if(input.active){
                                    return res.status(200).send({ "code": "0", "message": "sub-Competency Activated", "data": resultObj});
                                }else{
                                    return res.status(200).send({ "code": "0", "message": "sub-Competency Deactivated", "data": resultObj});
                                }
                            });
                        }
                    }).catch(function(){
                        return res.status(200).send({ "code": "1", "message": "sub-Competency ID not valid", "data": input});
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