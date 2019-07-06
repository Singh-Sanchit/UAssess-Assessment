/**
 * @api {post} /create-question Create Question
 * @apiVersion 1.0.0
 * 
 * @apiGroup Questions
 * @apiPermission Uassess Admin
 *
 * @apiDescription Create question
 *
 * @apiParam {String}   token             Token ID for authentication.
 * @apiParam {String}   title             Question Title, should be unique.
 * @apiParam {Date}     expiresAt         Expiry date of the Assessment.
 * @apiParam {Number}   weightage         Question weightage
 * @apiParam {String}   [fixedOptionsOrder] Options order true/false.
 * @apiParam {String}   answerType        Valid values: "correctAnswer", "notApplicable".
 * @apiParam {String}   optionType        Valid values: "radiogroup", "checkbox", "boolean", "file", "imagepicker", "text", "rating".
 * @apiParam {Object[]} options           List of Question options (Array of Objects).
 * @apiParam {Number}   options.id        Option ID.
 * @apiParam {Boolean}  options.level     Option Level ID.
 * @apiParam {String}   options.answer    Option Answer Key true/false.
 *
 * @apiExample Example usage:
 * curl -i https://api.uassess.com/3002/v1/create-question
 *
 * @apiSuccess {String}   code            API Status Code 1 for error 0 for success.
 * @apiSuccess {String}   message         Success message.
 * @apiSuccess {Object}   data            Returns Question data with question ID.
 *
 */


 /**
 * @api {post} /update-question Update Question
 * @apiVersion 1.0.0
 * 
 * @apiGroup Questions
 * @apiPermission Uassess Admin
 *
 * @apiDescription update question
 *
 * @apiParam {String}   token           Token ID for authentication.
 * @apiParam {String}   questionId      Question ID.
 * @apiParam {String}   [title]         Question Title, should be unique.
 * @apiParam {Date}     [expiresAt]     Expiry date of the Assessment.
 * @apiParam {Number}   [weightage]     Question weightage.
 * @apiParam {String}   [fixedOptionsOrder] Options order true/false.
 * @apiParam {String}   [answerType]    Valid values: "correctAnswer", "notApplicable".
 * @apiParam {String}   [optionType]    Valid values: "radiogroup", "checkbox", "boolean", "file", "imagepicker", "text", "rating".
 * @apiParam {Object[]} [options]       List of Question options (Array of Objects).
 * @apiParam {Number}   options.id      Option ID.
 * @apiParam {Boolean}  options.level   Option Level ID.
 * @apiParam {String}   options.answer  Option Answer Key true/false.
 *
 * @apiExample Example usage:
 * curl -i https://api.uassess.com/3002/v1/create-question
 *
 * @apiSuccess {String}   code            API Status Code 1 for error 0 for success.
 * @apiSuccess {String}   message         Success message.
 * @apiSuccess {Object}   data            Returns Question data with question ID.
 *
 */

/**
 * @api {post} /get-questions Get Questions
 * @apiVersion 1.0.0
 * 
 * @apiGroup Questions
 * @apiPermission Uassess Admin
 *
 * @apiDescription get all questions
 *
 * @apiParam {String}   token           Token ID for authentication.
 *
 * @apiExample Example usage:
 * curl -i https://api.uassess.com/3002/v1/get-questions
 *
 * @apiSuccess {String}   code            API Status Code 1 for error 0 for success.
 * @apiSuccess {String}   message         Success message.
 * @apiSuccess {Object}   data            Returns all Questions data.
 *
 */

 /**
 * @api {post} /update-question-status Delete Question
 * @apiVersion 1.0.0
 * 
 * @apiGroup Questions
 * @apiPermission Uassess Admin
 *
 * @apiDescription get all questions
 *
 * @apiParam {String}   token           Token ID for authentication.
 * @apiParam {ObjectId} questionId      Question Object ID.
 * @apiParam {Boolean}   active          true/false
 *
 * @apiExample Example usage:
 * curl -i https://api.uassess.com/3002/v1/update-question-status
 *
 * @apiSuccess {String}   code            API Status Code 1 for error 0 for success.
 * @apiSuccess {String}   message         Success message.
 * @apiSuccess {Object}   data            Returns all Question Status with data.
 *
 */

/**
 * @api {post} /create-multi-questions Create Multi Questions
 * @apiVersion 1.0.0
 * 
 * @apiGroup Questions
 * @apiPermission Uassess Admin
 *
 * @apiDescription create multiple questions
 *
 * @apiParam {String}   token           Token ID for authentication.
 * @apiParam {Object[]} questions       Question (Array of Objects).
 *
 * @apiExample Example usage:
 * curl -i https://api.uassess.com/3002/v1/create-multi-questions
 *
 * @apiSuccess {String}   code            API Status Code 1 for error 0 for success.
 * @apiSuccess {String}   message         Success message.
 * @apiSuccess {Object}   data            Returns all Question Status with data.
 *
 */

 /**
 * @api {post} /get-question-counts Get Question Count
 * @apiVersion 1.0.0
 * 
 * @apiGroup Questions
 * @apiPermission Uassess Admin
 *
 * @apiDescription create multiple questions
 *
 * @apiParam {String}    token            Token ID for authentication.
 * @apiParam {Number}    noOfQuestion     Total question number to split.
 * @apiParam {Object[]}  Skills           Skills - Array of Objects.
 * @apiParam {Object[]}  competencies     Competenies - Array of Objects.
 * @apiParam {Object[]}  subCompetencies  Sub Competencies - Array of Objects.
 *
 * @apiExample Example usage:
 * curl -i https://api.uassess.com/3002/v1/get-question-counts
 *
 * @apiSuccess {String}   code            API Status Code 1 for error 0 for success.
 * @apiSuccess {String}   message         Success message.
 * @apiSuccess {Object}   data            Returns all splitted Axis count and available questions count.
 *
 */