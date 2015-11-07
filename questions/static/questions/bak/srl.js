function srlGenerateQuestionsBySentence(sentence) {
    var questions = [];
    for(var wordIndex = 0; wordIndex<sentence.length; wordIndex++){
        var word = sentence[wordIndex];
        var newQuestions = srlGenrateQuestionsByWord(sentence,word);
        for(var qi = 0;qi<newQuestions.length;qi++){
            questions = pushQuestion(questions,newQuestions[qi]);
        }
    }
    return questions;
}

function srlGenrateQuestionsByWord(sentence,word) {
    var questions = [];
    if(word.arg.length != 0) {
        for(var componentIndex = 0; componentIndex<word.arg.length; componentIndex++){
            var component = word.arg[componentIndex];
            if (component.type=='A0') {
                A0 = component;
            };
            if (component.type=='A1') {
                A1 = component;
            };
        }
        for(var componentIndex = 0; componentIndex<word.arg.length; componentIndex++){
            var component = word.arg[componentIndex];
            var newQuestion = srlGenrateQuestionByComponent(sentence, component);
            if(newQuestion)
                questions = pushQuestion(questions, newQuestion);
        }
    }
    return questions;
}

function srlGenrateQuestionByComponent(sentence, component) {
    var ruleFactory = function(srl,label,rpc){
        return {
            srl : srl,
            label : label,
            replacement : rpc
        };
    };
    var rules = [
        ruleFactory('LOC','地点状语','在哪里'),
        ruleFactory('TMP','时间状语','什么时候'),
        ruleFactory('A0','A0','谁/什么东西')
    ];
    for(var i = 0; i<rules.length; i++) {
        var rule = rules[i];
        if(component.type == rule.srl) {
            var replacement = rule.replacement;
            var text = null;
            if(component.type == 'TMP') {
                replacement = getTMPReplacement(sentence,component);               
            }
            if(component.type == 'A0') {
                A0 = component;
                text = componentReplace(sentence,component,replacement);
            }
            else{
                if(A0){
                    var sentence_ = removeComponent(sentence,component);
                    replacement = getComponentStr(sentence,A0) + replacement;
                    console.log(replacement);
                    text = componentReplace(sentence_,A0,replacement);
                }
                else{
                    text = componentReplace(sentence,component,replacement);
                }
            }
            var question = {
                label : rule.label, 
                text : text
            };
            return question;
        }
    }
}


function componentReplace(sentence,component,replacement){
    var str = "";
    if(component.beg == 0){
        str += replacement;
        for(var i = component.end + 1; i<sentence.length; i++){
            str += sentence[i].cont;
        }
        return str;
    }
    for(var i = 0; i<sentence.length; i++) {
        var word = sentence[i];
        if(word.id<component.beg || word.id>component.end) {
            str += word.cont;
        }
        if(i == component.beg-1){
            str += replacement;
        }
    }
    return str;
}

function getComponentStr(sentence,component) {
    var str = ""
    for (var i = component.beg; i<=component.end; i++) {
        str += sentence[i].cont;
    }
    return str;
}

function getTMPReplacement(sentence, component) {
    var componentStr = getComponentStr(sentence, component);
    if(componentStr.indexOf('年')>0){
        return '哪一年';
    }
    if(componentStr.indexOf('月')>0) {
        return '几月份';
    }
    if(componentStr.indexOf('世纪')>0) {
        return '几世纪';
    }
    else
        return '什么时候';
}

function removeComponent(sentence,component) {
    var sent = [];
    for(var i = 0; i<sentence.length; i++) {
        var word = sentence[i];
        if(i<component.beg || i>component.end) {
            sent.push(word);
        }
    }
    return sent;
}
