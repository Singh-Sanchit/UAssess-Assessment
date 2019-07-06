import React, { Component } from 'react';
import { render } from 'react-dom';

import * as Survey from 'survey-react';
import 'survey-react/survey.css';
import { apiRoot} from '../../config.js'

const $ = window.$;

class ReactSurvey extends Component {
    constructor(props){
        super(props); 
        this.state={
            questionDetails:'   '
        }
        this.getWebAssessment= this.getWebAssessment.bind(this);
    }
    
    componentWillMount() {  
        this.getWebAssessment();  
        // Survey.Survey.cssType = "bootstrap";
        // Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
    }

    getWebAssessment(){
        let data = JSON.stringify({
            "token":"0d633410-5c13-11e9-8274-532bc5d640a4",//sessionStorage.getItem('u_token'),//"1-2-3",
            "licenseKey":"144239"
        
        });
        fetch(apiRoot+'3003/api/get-web-assessment', {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json();
        }).then(data =>{   
            if(data.code === "0")
            {
                console.log(data);
                // console.log(JSON.stringify(data.data.title).replace (/"/g,'')) ;
                this.setState({q_title:JSON.stringify(data.data.title).replace (/"/g,'')})
                this.setState({questionDetails:JSON.stringify(data)});
                this.setState({questionId:JSON.stringify(data.data.id).replace (/"/g,'')})
                this.setState({optionType:JSON.stringify(data.data.optionType).replace (/"/g,'')})
                
                var options=[];
                 
                var optionLen=Object.keys(data.data.options).length;
                for(var i = 0; i < optionLen; i++){ 
                    var label =JSON.stringify(data.data.options[i].label).replace (/"/g,'');
                    var id =JSON.stringify(data.data.options[i].id).replace (/"/g,'');  
                    if(data.data.selectedAnswer){
                       var selectedans= JSON.stringify(data.data.selectedAnswer).replace (/"/g,'');
                       this.setState({selectedAnswer:selectedans})   
                    }  
                    options.push({text:label,value:id});  
                }
                this.setState({options:options});
            }else{
                alert(data.message);
            }
        });
    
    }

    render() {  
        
        var json = {
            questionTitleTemplate: "{title}",
            title: "Question ",
            "completeText": "NEXT",
            "pageNextText": "Next Page",
            "pagePrevText": "Previous",                    
            questions: [
                {
                    type: this.state.optionType,//"radiogroup",
                    name: this.state.questionId,
                    title: this.state.q_title,
                    isRequired: true,
                    colCount: 1,
                    defaultValue:this.state.selectedAnswer,
                    choices: this.state.options
                }                                       
            ],                                                                                     
            // completedHtml: ' '
        };  

        var model = new Survey.Model(json);    
        return (
        <Survey.Survey model={model}/>
        );
    }
}
export default ReactSurvey;
// render(<App />, document.getElementById('root'));