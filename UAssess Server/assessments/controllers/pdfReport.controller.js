const Assessment = require('../models/companyAssessments.model');
const UserAssessment = require("../models/userAssessments.model");
var Request = require('request');

module.exports = {


    generateReport:function(req, res){

        let input = req.params;
        var filename = input.id;
        var title = "uassess auto report generation";
        var author = "uassess admin";
        var subject = "pdf report";
        var preparedFor = "Prepared for";
        var introduction = "";
        var startDate = "Assessment Start Date :";
        var endDate = "Assessment End Date :";
        var noOfQuestions = "Number of Questions :";
        var skillReportTitle = "Skill Report for";
        var competencyReportTitle = "Competency Report for";
        var frontCover = "";
        var avgScore = "";
        var competencyScoreData = [];
        var skillScoreTable = [[
            {text: 'Skill', fillColor: '#87CEEB', alignment: 'center', style: 'tableHeader13'}, 
            {text: 'Description', fillColor: '#87CEEB', alignment: 'center', style: 'tableHeader13'}, 
            // {text: 'Expected Proficiency', fillColor: '#87CEEB', alignment: 'center', style: 'tableHeader13'}, 
            {text: 'Score', fillColor: '#87CEEB', alignment: 'center', style: 'tableHeader13'}]];
    
        var competencyScoreTable = [[
            {text: 'Skill', fillColor: '#87CEEB', alignment: 'center', style: 'tableHeader13'}, 
            {text: 'Competency', fillColor: '#87CEEB', alignment: 'center', style: 'tableHeader13'}, 
            {text: 'Description', fillColor: '#87CEEB', alignment: 'center', style: 'tableHeader13'}, 
            // {text: 'Expected Proficiency', fillColor: '#87CEEB', alignment: 'center', style: 'tableHeader13'}, 
            {text: 'Score', fillColor: '#87CEEB', alignment: 'center', style: 'tableHeader13'}]];
        var assessmentinfotable = [[
            {text: 'Start Date', fillColor: '#a8a8a8', alignment: 'center', style: 'tableHeader12'}, 
            {text: 'End Date', fillColor: '#a8a8a8', alignment: 'center', style: 'tableHeader12'},
            {text: 'No of Questions', fillColor: '#a8a8a8', alignment: 'center', style: 'tableHeader12'},
            {text: 'Test Duration', fillColor: '#a8a8a8', alignment: 'center', style: 'tableHeader12'},
            {text: 'Avg Score', fillColor: '#a8a8a8', alignment: 'center', style: 'tableHeader12'}]];

        UserAssessment.findById(input.id).then(function(resultA){
            if(resultA){
                if(resultA.status == "pending"){
                    return res.send({"code":"1", "message":"Assessment not completed"})
                }else if(resultA.reportGeneration == false){
                    return res.send({"code":"1", "message":"This assessment does not have report, Please contact admin"})
                }else{
                    var options = { year: 'numeric', month: 'long', day: 'numeric' };
                    startDate = (new Date( resultA.createdAt )).toLocaleDateString("en-US", options);
                    endDate = (new Date( resultA.updatedAt )).toLocaleDateString("en-US", options);
                    noOfQuestions = resultA.noOfQuestions;
                    frontCover = frontCover+resultA.frontCover;
                    avgScore = resultA.avgScore;
                    var go = false;
                    if(resultA.axisScore.skills.length > 0){
                        resultA.axisScore.skills.forEach((element, index)=>{
                            skillScoreTable.push([element.label, element.description, {text:element.score, alignment:'center'}]);
                            resultA.competencies.forEach((element3, index)=>{
                                if(element.id == element3.skillId){
                                    resultA.axisScore.competencies.forEach((element2, index)=>{
                                        if(element2.id == element3.id){
                                            competencyScoreData.push([element.label, element2.label, element2.description, {text:element2.score, alignment:'center'}]);
                                            if(Object.is(resultA.axisScore.competencies.length -1, index)){
                                                go = true;
                                            }
                                        }
                                    })
                                }
                            })
                            if(Object.is(resultA.axisScore.skills.length -1, index)){
                                totalSkillAxis = competencyScoreData.reduce((p,c) => (p[c[0]] ? p[c[0]]++ : p[c[0]] = 1,p),{});
                                //console.log(totalSkillAxis);
                                for (var key in totalSkillAxis) {
                                    if(key != '[object Object]'){
                                        let skillComps = [{rowSpan: totalSkillAxis[key], text: key, fillColor: '#cccccc'}];
                                        let i = 1;
                                        competencyScoreData.forEach((compaxis, index2)=>{
                                            if(compaxis[0] == key){
                                                if(i == 1){
                                                    skillComps.push(compaxis[1],compaxis[2],compaxis[3]);
                                                    competencyScoreTable.push(skillComps);
                                                    i = i + 1;
                                                }else{
                                                    competencyScoreTable.push(compaxis);
                                                }
                                            }
                                            // if(Object.is(competencyScoreTable.length -1, index2)){
                                            // }
                                        })
                                    }
                                }
                                if(competencyScoreTable.length > 0){
                                    //console.log(competencyScoreTable);
                                    go = true;
                                }
                            }
                        })
                    }else if(resultA.axisScore.competencies.length > 0){
                        resultA.axisScore.competencies.forEach((element, index)=>{
                            competencyScoreTable.push(["", "", "", {text:element.score, alignment:'center'}]);
                            if(Object.is(resultA.axisScore.competencies.length -1, index)){
                                go = true;
                            }
                        })
                    }else{
                        go = true;
                    }

                    if(go){
                    Request.post({
                        "headers":{ 'Content-Type': 'application/json'},
                        "url": "http://"+base_url+":3000/api/get-users-profile",
                        "body": JSON.stringify({"profileIds":[resultA.profileId]})
                    }, (error, response, body)=>{
                        if(error){
                            return res.send({"code":"1", "message":"Something went wrong"});
                        }else{
                            var body = JSON.parse(body);
                            if(body.code == "0"){
                                preparedFor = preparedFor + " " +body.data[0].name;
                                Assessment.findOne({"licenseKey":resultA.licenseKey}).then(function(resultB){
                                    if(resultB){
                                        introduction = resultB.description;
                                        skillReportTitle = skillReportTitle + " " + resultB.title;
                                        competencyReportTitle = competencyReportTitle + " " + resultB.title;

                                        let duration = resultB.duration+" Minutes";
                                        assessmentinfotable.push([{text:startDate, alignment:'center'}, {text:endDate, alignment:'center'}, {text:noOfQuestions, alignment:'center'}, {text:duration, alignment:'center'}, {text:avgScore, alignment:'center'}]);
                                        var fonts = {
                                            Roboto: {
                                                normal: 'public/fonts/Roboto-Regular.ttf',
                                                bold: 'public/fonts/Roboto-Medium.ttf',
                                                italics: 'public/fonts/Roboto-Italic.ttf',
                                                bolditalics: 'public/fonts/Roboto-MediumItalic.ttf'
                                            }
                                        };
                                        var PdfPrinter = require('pdfmake');
                                        var printer = new PdfPrinter(fonts);
                                        var dd = {
                                            pageSize: 'A4',
                                            info: {
                                                title: title,
                                                author: author,
                                                subject: subject,
                                            },
                                            background: function (page) {
                                                if (page == 1) {
                                                    return [
                                                        {
                                                            image: 'bgimage',
                                                            width: 595                            
                                                        }
                                                    ];
                                                }
                                            },
                                            footer: function(page){
                                                if(page == 1){
                                                    return { columns: [
                                                        { text: preparedFor, bold: true, margin:[40, 0], alignment: 'left', style: 'preparedFor' },
                                                      ]
                                                    }
                                                }else{
                                                    return { columns: [
                                                        //{ text: page, margin:[40, 0], alignment: 'right' },
                                                      ]
                                                    }
                                                }
                                            },
                                
                                            content: [
                                                // {text:"Introduction", bold:true, pageBreak: 'before', style: 'title18'},
                                                {text:"Introduction", bold: true, pageBreak: 'before', style:"title20"},
                                                {text:introduction, bold: false, style: 'introduction'},
                                                {text:'', margin:[0, 10]},
                                                // {text:startDate, bold: true, style: 'title13'},
                                                // {text:endDate, bold: true, style: 'title13'},
                                                // {text:noOfQuestions, bold: true, style: 'title13'},
                                                // {text:"Test Duration :", bold: true, style: 'title13'},
                                                {text:"Assessment Information", bold: true, style:"title15"},
                                                {
                                                    style: 'table',
                                                    table: {
                                                        headerRows: 1,
                                                        widths: ['20%', '20%', '20%', '20%', '20%'],
                                                        body: assessmentinfotable
                                                    },                                                    
                                                },
                                                {text:skillReportTitle, bold: true, pageBreak: 'before', style:"titleGray"},
                                                {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 3, "lineColor": "gray" }]},
                                                {text:'', margin:[0, 10]},
                                                {
                                                    style: 'table',
                                                    table: {
                                                        headerRows: 1,
                                                        body: skillScoreTable
                                                    },
                                                    //layout: 'headerLineOnly'
                                                },
                                                {text:competencyReportTitle, bold: true, pageBreak: 'before', style:"titleGray"},
                                                {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 3, "lineColor": "gray" }]},
                                                {text:'', margin:[0, 10]},
                                                {
                                                    style: 'table',
                                                    table: {
                                                        headerRows: 1,
                                                        body: competencyScoreTable
                                                    },
                                                    //layout: 'headerLineOnly'
                                                },
                                                {text:'', pageBreak: 'before'},
                                                {image: 'public/images/logo-light.png', width: 60, alignment: 'center', margin:[0,10]},
                                                {text:'', margin:[0, 10]},
                                                {
                                                    columns: [
                                                        { width: '*', image: 'public/images/twitter.png', width: 20 },
                                                        { width: 'auto', style:"title13", text: 'https://twitter.com/uassesshq', margin:[6,3,0,0]}],
                                                    
                                                },
                                                {text:'', margin:[0, 3]},
                                                {
                                                    columns: [
                                                        { width: '*', image: 'public/images/linkedin.png', width: 20 },
                                                        { width: 'auto', style:"title13", text: 'https://www.linkedin.com/company/uassess', margin:[6,3,0,0]}],
                                                },
                                                {text:'', margin:[0, 3]},
                                                {
                                                    columns: [
                                                        { width: '*', image: 'public/images/web.png', width: 20 },
                                                        { width: 'auto', style:"title13", text: 'https://uassess.com/', margin:[6,3,0,0]}],
                                                },
                                                {text:'', margin:[0, 3]},
                                                {
                                                    columns: [
                                                        { width: '*', image: 'public/images/mail.png', width: 20 },
                                                        { width: 'auto', style:"title13", text: 'engage@uassess.com', margin:[6,3,0,0]}],
                                                },

                                                // {
                                                //     table: {
                                                //         widths: ['60%', '40%'],                                                 
                                                //         body: [
                                                //             [[
                                                //                 {text:'', margin:[0, 3]},
                                                //                 {text:"https://twitter.com/prodleader", style:"title13"},
                                                //                 {text:'', margin:[0, 3]},
                                                //                 {text:"https://linkd.in/prodleader", style:"title13"},
                                                //                 {text:'', margin:[0, 3]},
                                                //                 {text:"www.productleadership.in", style:"title13"},
                                                //                 {text:'', margin:[0, 3]},
                                                //                 {text:"engage@productleadership.in", style:"title13"},
                
                                                //             ], 
                                                //                 {text:'Address', margin:[0, 3]},
                                                //             ],
                                                //         ],
                                                //         layout: {
                                                //             defaultBorder: false,
                                                //         }
                                                //     }
                                                // }
                                            ],
                                            
                                            defaultStyle: {
                                                fontSize: 11,
                                                font: 'Roboto', // The font name was defined above.
                                                lineHeight: 1.2,
                                            },
                                
                                            styles:{
                                                title13:{
                                                    fontSize: 13,
                                                    lineHeight: 1.5
                                                },
                                                title15:{
                                                    fontSize: 15,
                                                    lineHeight: 1.5
                                                },
                                                title18:{
                                                    fontSize: 18,
                                                    lineHeight: 1.5
                                                },
                                                title20:{
                                                    fontSize: 20,
                                                    lineHeight: 1.5
                                                },
                                                paragraph:{
                                                    fontSize: 13,
                                                    lineHeight: 1.5
                                                },
                                                titleGray:{
                                                    fontSize: 15,
                                                    lineHeight: 1.5,
                                                    color:'gray'
                                                },
                                                introduction:{
                                                    fontSize: 14
                                                },
                                                table:{
                                                    margin: [0, 5, 0, 15]
                                                },
                                                tableHeader13: {
                                                    bold: true,
                                                    fontSize: 13,
                                                    color: 'black'
                                                },
                                                tableHeader12:{
                                                    bold: true,
                                                    fontSize: 12,
                                                    color: 'black',
                                                    alignment: 'center',
                                                },
                                                preparedFor:{
                                                    fontSize: 14,
                                                }
                                            },                                
                                            images: { bgimage : resultB.frontCoverImage }
                                        };
                                        var doc = printer.createPdfKitDocument(dd)
                                        doc.end()
                                        res.writeHead(200, {
                                            'Content-Type': 'application/force-download',
                                            'Content-disposition': 'attachment; filename='+filename+'.pdf'
                                        });
                                        doc.pipe(res)                                        
                                    }else{
                                        return res.send({"code":"1", "message":"somthing went wrong"});
                                    }
                                })
                            }else{
                                return res.send({"code":"1", "message":"Something went wrong"});
                            }
                        }
                    })}   
                }
            }else{
                return res.send({"code":"1", "message":"Invalid report Id", "data":input});
            }
        }).catch((err)=>{
            return res.send({"code":"1","message":err.message});
        });

    },
}