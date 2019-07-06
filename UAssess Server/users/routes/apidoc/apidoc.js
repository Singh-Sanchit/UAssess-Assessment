/**
    * @api {post} https://api.uassess.com/3000/api/register Register
    * @apiDescription used by assessee, uassess admin and company admin using different privilege roles.
    * @apiVersion 1.0.0
    * @apiName Register
    * @apiGroup Users
    * 
    * @apiPermission All
    * 
    * @apiParam {String} name  Name of the new user
    * @apiParam {String} email  Email ID of the new user
    * @apiParam {String} password  Password of the new user
    * @apiParam {Number} phone  Phone Number of the new user
    * @apiParam {String} privilegeRole  Role of the new user (Assessee,UassessAdmin,CompanyAdmin)
    * @apiParam {Number} [companyId]  Company ID of the new user
    * @apiParam {Number} [pushNotificationId]  Device PushNotification Id
    * @apiParam {Number} [clientId]  Device Id
    * @apiParam {String} [jobRole]  Job Role
    * @apiParam {Number} [createdBy]  Created By
    * 
    * 
    * @apiSuccess {String} privilegeRoles User Roles
    * @apiSuccess {Number} phone Phone Number of the user
    * @apiSuccess {Image} profileImage User Image
    * @apiSuccess {String} jobRole User Job Role
    * @apiSuccess {String} email  Email ID of the user
    * @apiSuccess {Date} createdAt User Registered date
    * @apiSuccess {Date} updatedAt User profile updated date
    * @apiSuccess {String} companyId Company id
    * @apiSuccess {String} name Name of the User
    * @apiSuccess {String} token Token
    * 
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "code": "0",
    *        "message": "Success",
    *        "data": {
    *            "privilegeRoles": [
    *                "Assessee",
    *                "UassessAdmin"
    *            ],
    *            "phone": "1234566909",
    *            "profileImage": "",
    *            "companyId": "",
    *            "jobRole": "",
    *            "email": "uassessadmin123@appzoy.com",
    *            "name": "UassessAdmin",
    *            "createdAt": "2019-04-14T11:04:10.635Z",
    *            "updatedAt": "2019-04-14T11:04:10.635Z",
    *            "token": "07e1e3d0-5ea5-11e9-a047-8f8d8e7c5db9"
    *        }
    *     }
    * @apiError {String} email Email Required
    * 
    * @apiErrorExample {json} Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *       "code": "1",
    *        "message": "Email Required",
    *        "data": {
    *            "password": "uassessadmin123",
    *            "name": "UassessAdmin",
    *            "privilegeRole": "UassessAdmin",
    *            "pushNotificationId": "1234",
    *            "clientId": "12345",
    *            "phone": "1234566909",
    *            "profileImage": "",
    *            "jobRole": "",
    *            "createdBy": ""
    *       }
    *     }
   */

  /** 
    * @api {post} https://api.uassess.com/3000/api/login  Login
    * @apiDescription Existing user can login
    * @apiVersion 1.0.0
    * @apiName Login
    * @apiGroup Users
    * @apiPermission All
    * 
    * @apiParam {String} email  Email ID of the user
    * @apiParam {String} [name]  Name of the user
    * @apiParam {String} password  Password of the user
    * @apiParam {String} clientId  ClientId of the user
    * @apiParam {Number} [phone]  Phone of the user
    * @apiParam {String} authType  AuthType of the user
    * @apiParam {String} userId UserId of the user
    * @apiParam {Number} appVersion 
    * @apiParam {String} [pushNotificationId]
    * @apiParam {Image} [profileImage]
    * 
    * @apiSuccess {String} privilegeRoles User Roles
    * @apiSuccess {Number} phone Phone Number of the user
    * @apiSuccess {String} clientId Device Id of the user
    * @apiSuccess {Image} profileImage User Image
    * @apiSuccess {String} jobRole User Job Role
    * @apiSuccess {String} email  Email ID of the user
    * @apiSuccess {Date} createdAt User Registered date
    * @apiSuccess {Date} updatedAt User profile updated date
    * @apiSuccess {String} companyId Company id
    * @apiSuccess {String} name Name of the User
    * @apiSuccess {String} token Token
    * 
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "code": "0",
    *        "message": "Success",
    *        "data": {
    *            "privilegeRoles": [
    *                "Assessee",
    *                "UassessAdmin"
    *            ],
    *            "phone": "131231431356",
    *            "profileImage": "",
    *            "companyId": "5c73bd17c9968924baa2b286",
    *            "jobRole": "",
    *            "clientId": "",
    *            "email": "admin@appzoy.com",
    *            "name": "Admin",
    *            "createdAt": "2019-03-13T10:24:57.192Z",
    *            "updatedAt": "2019-04-01T05:16:44.290Z",
    *            "token": "29106340-5ea7-11e9-a047-8f8d8e7c5db9"
    *        }
    *     }
    * @apiError {String} email User does not exist
    * 
    * @apiErrorExample {json} Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *       "code": "1",
    *        "message": "User does not exist",
    *        "data": {
    *            "clientId": "1234",
    *            "authType": "Default",
    *            "userId": "admin1@appzoy.com",
    *            "password": "admin",
    *            "email": "admin@appzoy.com",
    *            "name": "Admin",
    *            "profileImage": " "
    *       }
    *     }
    * 
    */

    /** 
    * @api {post} https://api.uassess.com/3000/api/get-my-profile  GetMyProfile
    * @apiDescription <b>Get token by register(register api) or login (login api)</b> 
    *                 <br/>User can get their profile
    * @apiVersion 1.0.0
    * @apiName GetMyProfile 
    * @apiGroup Users
    * 
    * @apiPermission All
    * 
    * @apiParam {String} token Logged in user's token
    * 
    * @apiSuccess {String} privilegeRoles User Roles
    * @apiSuccess {Number} phone Phone Number of the user
    * @apiSuccess {Image} profileImage User Image
    * @apiSuccess {String} jobRole User Job Role
    * @apiSuccess {String} email  Email ID of the user
    * @apiSuccess {String} authType User logged in by Social login or default login
    * @apiSuccess {Date} createdAt User Registered date
    * @apiSuccess {Date} updatedAt User profile updated date
    * @apiSuccess {String} id User profile id
    * @apiSuccess {String} name Name of the User
    * @apiSuccess {String} clientId Unique device id
    * 
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "code": "0",
    *        "message": "Success",
    *        "data": {
    *            "privilegeRoles": [
    *                "Assessee",
    *                "UassessAdmin"
    *            ],
    *            "phone": "1234566909",
    *            "profileImage": "",
    *            "jobRole": "",
    *            "email": "email@mail.com",
    *            "name": "Name",
    *            "authType": "Default",
    *            "createdAt": "2019-04-11T13:48:12.841Z",
    *            "updatedAt": "2019-04-11T13:48:12.841Z",
    *            "id": "5caf459c29358c2df6474b1d",
    *            "clientId": "1234"
    *        }
    *     }
    * @apiError {String} token Invalid Token
    * 
    * @apiErrorExample {json} Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *       "code": "1",
    *        "message": "Invalid Token",
    *        "data": {
    *            "token": "7e450b60-5cde-11e9-afc5-8d7e47b0da652"
    *       }
    *     }
 
    */

    /** 
    * @api {post} https://api.uassess.com/3000/api/update-my-profile  UpdateMyProfile
    * @apiDescription <b>User Should get token by register(register api) or login (login api)</b> 
    *                 <br/>User can update their profile
    * @apiVersion 1.0.0
    * @apiName UpdateMyProfile 
    * @apiGroup Users
    * 
    * @apiPermission All
    * 
    * @apiParam {String{37}} token Logged in user's token.
    * @apiParam {String{20}} [name] Name of the user(if they want to change). 
    * @apiParam {Number{10}} [phone] Phone Number of the user(if they want to change). 
    * @apiParam {String{5-100}} [jobRole] Current job role of the user(if they want to change). 
    * @apiParam {Image{base64}} [profileImage] Image of the user(if they want to change).
    * 
    * @apiSuccess {Number} phone Phone Number of the user
    * @apiSuccess {Image} profileImage User Image
    * @apiSuccess {String} jobRole User Job Role
    * @apiSuccess {String} name Name of the User
    * @apiSuccess {String} email  Email ID of the user
    * @apiSuccess {Date} createdAt User Registered date
    * @apiSuccess {Date} updatedAt User profile updated date
    * @apiSuccess {String} id User's unique profile id
    
    * 
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "code": "0",
    *        "message": "Updated Successfully",
    *        "data": {
    *            "phone": "1234566909",
    *            "profileImage": "",
    *            "jobRole": "",
    *            "email": "email@mail.com",
    *            "name": "Name",
    *            "createdAt": "2019-04-11T13:48:12.841Z",
    *            "updatedAt": "2019-04-11T13:48:12.841Z",
    *            "id": "5caf459c29358c2df6474b1d",
    *        }
    *     }
    * @apiError {String} token Invalid Token
    * 
    * @apiErrorExample {json} Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *       "code": "1",
    *        "message": "Invalid Token",
    *        "data": {
    *            "token": "7e450b60-5cde-11e9-afc5-8d7e47b0da652",
    *            "phone": "1234566909",
    *            "jobRole": "Role",
    *            "name": "Name",
    *       }
    *     }
    */

    /** 
    * @api {post} https://api.uassess.com/3000/api/change-my-password  ChangeMyPassword
    * @apiDescription <b>User Should get token by register(register api) or login (login api)</b> 
    *                 <br/>User can Change their password
    * @apiVersion 1.0.0
    * @apiName ChangeMyPassword 
    * @apiGroup Users
    * 
    * @apiPermission All
    * 
    * @apiParam {String} token Token from login or register.
    * @apiParam {String{4-10}} currentPassword Current Password of the user.
    * @apiParam {String{4-10}} newPassword New Password.
    * 
    * @apiSuccessExample {json} Success-Response:
    * HTTP/1.1 200 OK
    *  {
    *         "code": "0",
    *         "message": "Password changed Successfully"
    *  }
    *   
    * @apiError {String} currentPassword Incorrect current password
    * 
    * @apiErrorExample {json} Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *           "code": "1",
    *            "message": "Incorrect current password",
    *           "data": {
    *                "token": "7e450b60-5cde-11e9-afc5-8d7e47b0da65",
    *                "currentPassword": "currentpassword",
    *                "newPassword": "newpassword"
    *            }
    *     }
    */ 

    /** 
    * @api {post} https://api.uassess.com/3000/api/create-company-profile  CreateCompanyProfile
    * @apiDescription <b>Get token from login api</b> 
    *                 <br/>Uassess admin can create company profile
    * @apiVersion 1.0.0
    * @apiName CreateCompanyProfile 
    * @apiGroup Users
    * 
    * @apiPermission Uassess Admin
    * 
    * @apiParam {String} token  Token.
    * @apiParam {String{5-100}} name  Company Name.
    * @apiParam {String{5-25}} manager Name of the company manager.
    * @apiParam {Number{10-15}} phone Company Phone Number.
    * @apiParam {String{2-50}} country Country of the Company.
    * @apiParam {String{2-50}} region  Region of the Company.
    * @apiParam {Image} logo  Logo of the Company.
    * 
    * @apiExample Example usage:
    * curl -i https://api.uassess.com/3000/api/create-company-profile
    * 
    * @apiSuccess {String} name Company Name
    * @apiSuccess {String} manager Manager Name
    * @apiSuccess {Number} phone Phone Number
    * @apiSuccess {String} country Country
    * @apiSuccess {String} region Region
    * @apiSuccess {Number} id Unique company id
    * 
    * @apiSuccessExample {json} Success-Response:
    * 
    * HTTP/1.1 200 OK
    *  {
    *         "code": "0",
    *         "message": "Success",
    *         "data":{
    *            "name":"AppZoy Technologies",
    *            "manager":"Test",
    *            "phone":"1243433444",
    *            "country":"uiuiui",
    *            "region":"123",
    *            "logo":"http://image.url",
    *            "id": "125625667877887879"
    *         }
    *  }
    * 
    * @apiError {String} name Company exist
    * 
    * @apiErrorExample {json} Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *           "code": "1",
    *            "message": "Company exist",
    *           "data": {
    *                "token": "7e450b60-5cde-11e9-afc5-8d7e47b0da65",
    *                 "name": "Appzody1e118",
    *                 "manager": "Test",
    *                 "phone": "1243433444",
    *                 "country": "uiuiui",
    *                 "region": "123",
    *                 "logo": "http://image.url"               
    *            }
    *     }
    */ 

    /** 
    * @api {post} https://api.uassess.com/3000/api/update-company-profile  UpdateCompanyProfile
    * @apiDescription <b>Get token from login api</b> 
    *                 <br/>Uassess admin can update company profile
    * @apiVersion 1.0.0
    * @apiName UpdateCompanyProfile 
    * @apiGroup Users
    * 
    * @apiPermission Uassess Admin
    * 
    * @apiParam {String} token  Token.
    * @apiParam {String{5-100}} name  Company Name.
    * @apiParam {String{5-25}} manager Name of the company manager.
    * @apiParam {Number{10-15}} phone Company Phone Number.
    * @apiParam {String{2-50}} country Country of the Company.
    * @apiParam {String{2-50}} region  Region of the Company.
    * @apiParam {Image} logo  Logo of the Company.
    * @apiParam {String} id Company Id.
    * @apiParam {Number} license Number of license purchased for assessments.
    * @apiParam {String} bu Business Unit.
    * 
    * @apiExample Example usage:
    * curl -i https://api.uassess.com/3000/api/create-company-profile
    * 
    * @apiSuccess {String} name Company Name
    * @apiSuccess {String} manager Manager Name
    * @apiSuccess {Number} phone Phone Number
    * @apiSuccess {String} country Country
    * @apiSuccess {String} region Region
    * @apiSuccess {Number} id Unique company id
    * @apiSuccess {Image} logo Company Logo
    * @apiSuccess {Number} license Number of license purchased for assessments.
    * @apiSuccess {String} bu Business Unit.
    * @apiSuccess {Date} createdAt Company Registered date
    * @apiSuccess {Date} updatedAt Updated date
    * 
    * @apiSuccessExample {json} Success-Response:
    * 
    * HTTP/1.1 200 OK
    *      {
    *          "code": "0",
    *          "message": "Updated Successfully",
    *          "data": {
    *              "logo": "http://ec2-35-165-30-80.us-west-2.compute.amazonaws.com/corporatesLogo/5980553be51aaa7cb7707589.png",
    *              "license": 1001,
    *              "bu": "buioio",
    *              "country": "india",
    *              "region": "bangalroe",
    *              "createdBy": "6566hghgg",
    *              "updatedBy": "5cb015bd28e60227e8d5fa4b",
    *              "name": "Appzoy909",
    *              "manager": "raju",
    *              "phone": "80888885616",
    *              "createdAt": "2019-02-25T10:01:59.428Z",
    *              "updatedAt": "2019-04-12T13:12:31.468Z",
    *              "id": "5c73bd17c9968924baa2b286"
    *          }
    *      } 
    * 
    * @apiError {String} id Fail
    * 
    * @apiErrorExample {json} Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *           "code": "1",
    *           "message": "Company not exist",
    *            "data": {
    *               "token": "e145f4c0-5d17-11e9-a047-8f8d8e7c5db9",
    *                "license": 1001,
    *                "phone": "80888885616",
    *                "bu": "buioio",
    *                "manager": "raju",
    *                "name": "Appzoy909",
    *                "id": "5c73bd17c9968924baa2b281"
    *            }
    *     }
    */ 

    /** 
    * @api {post} https://api.uassess.com/3000/api/get-companies  GetCompanies
    * @apiDescription <b>Get token from login api</b> 
    *                 <br/>Display List of all companies
    * @apiVersion 1.0.0
    * @apiName GetCompanies 
    * @apiGroup Users
    * 
    * @apiPermission Uassess Admin
    * 
    * @apiParam {String} token  Token.   
    * @apiParam {String} [country] Country of the Company.
  
    * @apiExample Example usage:
    * curl -i https://api.uassess.com/3000/api/get-companies
    * 
    * @apiSuccess {String} name Company Name
    * @apiSuccess {String} manager Manager Name
    * @apiSuccess {Number} phone Phone Number
    * @apiSuccess {String} country Country
    * @apiSuccess {String} region Region
    * @apiSuccess {Number} id Unique company id
    * @apiSuccess {Image} logo Company Logo
    * @apiSuccess {Number} license Number of license purchased for assessments.
    * @apiSuccess {String} bu Business Unit.
    * @apiSuccess {Date} createdAt Company Registered date
    * @apiSuccess {Date} updatedAt Updated date
    * 
    * @apiSuccessExample {json} Success-Response:
    * 
    * HTTP/1.1 200 OK
    *      {
    *         "code": "0",
    *          "message": "Success",
    *          "data": [
    *              {
    *                  "logo": "http://ec2-35-165-30-80.us-west-2.compute.amazonaws.com/corporatesLogo/5980553be51aaa7cb7707589.png",
    *                  "license": 1001,
    *                  "bu": "bu",
    *                  "country": "india",
    *                  "region": "bangalroe",
    *                  "createdBy": "6566hghgg",
    *                  "updatedBy": "",
    *                  "name": "Appzoy",
    *                  "manager": "Kavitha",
    *                  "phone": "91 80888885616",
    *                  "createdAt": "2019-02-25T10:01:59.428Z",
    *                  "updatedAt": "2019-03-07T07:05:59.057Z",
    *                  "id": "5c73bd17c9968924baa2b286"
    *              },
    *              {
    *                  "logo": "http://ec2-35-154-172-174.ap-south-1.compute.amazonaws.com:3000/companyLogos/5c8f5674ca4be155ea01e91a.jpg",
    *                  "license": -7,
    *                  "bu": "",
    *                  "country": "india",
    *                  "region": "bangalroe",
    *                  "createdBy": "123",
    *                  "updatedBy": "",
    *                  "name": "Institute of product leadership",
    *                  "manager": "Aslam",
    *                  "phone": "9886501065",
    *                  "createdAt": "2019-03-18T08:27:32.179Z",
    *                  "updatedAt": "2019-04-02T04:54:09.111Z",
    *                  "id": "5c8f5674ca4be155ea01e91a"
    *              },
    *      } 
    * 
    * @apiError {String} token "Invalid Token
    * 
    * @apiErrorExample {json} Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *           "code": "1",
    *           "message": "Invalid Token",
    *            "data": {
    *               "token": "e145f4c0-5d17-11e9-a047-8f8d8e7c5db9",
    *            }
    *     }
    */ 

    /** 
    * @api {post} https://api.uassess.com/3000/api/get-company-profile  GetCompanyProfile
    * @apiDescription <b>Get token from login api</b> 
    *                 <br/>Get Company Details
    * @apiVersion 1.0.0
    * @apiName GetCompanyProfile 
    * @apiGroup Users
    * 
    * @apiPermission Uassess Admin
    * 
    * @apiParam {String} token  Token.
    * @apiParam {String} id  Company Id.
    * 
    * @apiExample Example usage:
    * curl -i https://api.uassess.com/3000/api/get-company-profile
    * 
    * @apiSuccess {String} name Company Name
    * @apiSuccess {String} manager Manager Name
    * @apiSuccess {Number} phone Phone Number
    * @apiSuccess {String} country Country
    * @apiSuccess {String} region Region
    * @apiSuccess {Number} companyId Unique company id
    * @apiSuccess {Image} logo Company Logo
    * @apiSuccess {Number} license Number of license purchased for assessments.
    * @apiSuccess {String} bu Business Unit.
    * @apiSuccess {Date} createdAt Company Registered date
    * @apiSuccess {Date} updatedAt Updated date
    * 
    * @apiSuccessExample {json} Success-Response:
    * 
    * HTTP/1.1 200 OK
    *  {
    *         "code": "0",
    *         "message": "Success",
    *         "data":{
    *                "logo": "http://ec2-35-165-30-80.us-west-2.compute.amazonaws.com/corporatesLogo/5980553be51aaa7cb7707589.png",
    *                "license": 1001,
    *                "bu": "buioio",
    *                "country": "india",
    *                "region": "bangalroe",
    *                "createdBy": "6566hghgg",
    *                "updatedBy": "5cb015bd28e60227e8d5fa4b",
    *                "name": "Appzoy909",
    *                "manager": "raju",
    *                "phone": "80888885616",
    *                "createdAt": "2019-02-25T10:01:59.428Z",
    *                "updatedAt": "2019-04-12T13:12:31.468Z",
    *                "id": "5c73bd17c9968924baa2b286"
    *         }
    *  }
    * 
    * @apiError {String} companyId Invalid CompanyId
    * 
    * @apiErrorExample {json} Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *           "code": "1",
    *           "message": "Company exist",
    *           "data": {
    *                "token": "7e450b60-5cde-11e9-afc5-8d7e47b0da65",
    *                 "companyId": "5c73bd17c9968924baa2b28"              
    *            }
    *     }
    */ 

   /** 
    * @api {post} https://api.uassess.com/3000/api/invite-admin  Invite Admin
    * @apiDescription <b>Get token from login api</b> 
    *                 <br/>Send invite link for register as admin
    * @apiVersion 1.0.0
    * @apiName Invite Admin 
    * @apiGroup Users
    * 
    * @apiPermission Uassess Admin or Company Admin
    * 
    * @apiParam {String} token  Token.
    * @apiParam {String} privilegeRole  Role.
    * @apiParam {String} email  Email id to invite.
    * @apiParam {String} companyId  Company Id.
    * 
    * @apiExample Example usage:
    * curl -i https://api.uassess.com/3000/api/invite-admin
    * 
    
    * @apiSuccessExample {json} Success-Response:
    * 
    * HTTP/1.1 200 OK
    *  {
    *         "code": "0"
    *  }
    * 
    * @apiError {String} companyId companyId required
    * 
    * @apiErrorExample {json} Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *           "code": "1",
    *           "message": "companyId required",
    *           "data": {
    *                "token": "7e450b60-5cde-11e9-afc5-8d7e47b0da65",
    *                "privilegeRole": "CompanyAdmin",
    *                "email": "deeba@appzoy.com"              
    *            }
    *     }
    */ 

    /** 
    * @api {post} https://api.uassess.com/3000/api/invite-assessee  Invite Assessee
    * @apiDescription <b>Get token from login api</b> 
    *                 <br/>Send invite link for taking test
    * @apiVersion 1.0.0
    * @apiName Invite Assessee 
    * @apiGroup Users
    * 
    * @apiPermission Uassess Admin or Company Admin
    * 
    * @apiParam {String} token  Token.
    * @apiParam {Number} licenseKey  Assessment Key.
    * @apiParam {String} emailIds  Assessee Email ids.
    * 
    * @apiExample Example usage:
    * curl -i https://api.uassess.com/3000/api/invite-assessee
    * 
    
    * @apiSuccessExample {json} Success-Response:
    * 
    * HTTP/1.1 200 OK
    *  {
    *         "code": "0"
    *         "message": "Emails sent successfully"
    *  }
    * 
    * @apiError {String} licenseKey License Key required
    * 
    * @apiErrorExample {json} Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *           "code": "1",
    *           "message": "License Key required",
    *           "data": {
    *                "token": "7e450b60-5cde-11e9-afc5-8d7e47b0da65",
    *                "email": "deeba@appzoy.com"              
    *            }
    *     }
    */ 

    /** 
    * @api {post} https://api.uassess.com/3000/api/logout  Logout
    * @apiDescription <b>Get token from login api</b> 
    *                 <br/>Logout
    * @apiVersion 1.0.0
    * @apiName Logout
    * @apiGroup Users
    * 
    * @apiPermission All
    * 
    * @apiParam {String} token  Token.
    * 
    * @apiExample Example usage:
    * curl -i https://api.uassess.com/3000/api/logout
    * 
    
    * @apiSuccessExample {json} Success-Response:
    * 
    * HTTP/1.1 200 OK
    *  {
    *         "code": "0"
    *         "message": "Success"
    *  }
    * 
    * @apiError {String} token Invalid Token
    * 
    * @apiErrorExample {json} Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *           "code": "1",
    *           "message": "Invalid Token",
    *           "data": {
    *                "token": "7e450b60-5cde-11e9-afc5-8d7e47b0da65",
    *            }
    *     }
    */
   
    /** 
    * @api {post} https://api.uassess.com/3000/api/get-users-profile  GetUsersProfile
    * @apiDescription Get Users Profile
    * @apiVersion 1.0.0
    * @apiName GetUsersProfile
    * @apiGroup Users
    * 
    * @apiPermission All
    * 
    * @apiParam {String} profileIds  Users Profile Ids.
    * 
    * @apiExample Example usage:
    * curl -i https://api.uassess.com/3000/api/get-users-profile
    * 
    
    * @apiSuccessExample {json} Success-Response:
    * 
    * HTTP/1.1 200 OK
    *  {
    *         "code": "0"
    *         "message": "Success"
    *  }
    * 
    * @apiError {String} profileIds Fail
    * 
    * @apiErrorExample {json} Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *           "code": "1",
    *           "message": "Fail",
    *           "data": {
    *                "profileIds":["5c6261499ff44c7c161ea21b","5c546d6ac22c326099b6ca01"]
    *            }
    *     }
    */
   
    /** 
    * @api {post} https://api.uassess.com/3000/api/send-feedback  Send Feedback
    * @apiDescription <b>Get token from login api</b> 
    *                 <br/>Users can send feedbacks
    * @apiVersion 1.0.0
    * @apiName Send Feedback
    * @apiGroup Users
    * 
    * @apiPermission All
    * 
    * @apiParam {String} token  Token.
    * @apiParam {String} name  User name
    * @apiParam {String} email  User Email Id
    * @apiParam {String} subject  Subject of the mail
    * @apiParam {String} message  Text Message   
    * 
    * @apiExample Example usage:
    * curl -i https://api.uassess.com/3000/api/send-feedback
    * 
    
    * @apiSuccessExample {json} Success-Response:
    * 
    * HTTP/1.1 200 OK
    *  {
    *         "code": "0"
    *         "message": "Thanks for Feedback"
    *  }
    * 
    * @apiError {String} email Email ID Required
    * 
    * @apiErrorExample {json} Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *           "code": "1",
    *           "message": "Email required",
    *           "data": {
    *                "token": "7e450b60-5cde-11e9-afc5-8d7e47b0da65",
    *                "name": "Test",
    *                "subject": "subject",
    *                "message": "message"
    *            }
    *     }
    */ 
