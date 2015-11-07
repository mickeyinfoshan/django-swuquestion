function pushQuestion(questions, newQuestion) {
    if(questions.length == 0){
        questions.push(newQuestion);
        return questions;
    }
    for (var questionIndex = 0; questionIndex<questions.length; questionIndex++) {
        question = questions[questionIndex];
        //console.log(newQuestion);
        if(newQuestion.text == question.text && newQuestion.label == question.label) {
            /*if(newQuestion.label != question.label)
                question.label += (" | " + newQuestion.label);*/
            break;
        }
        if(questionIndex == questions.length - 1)
            questions.push(newQuestion);
    }
    return questions;
}

function getSentenceContent(sentence){
    var str = '';
    for(var i = 0; i<sentence.length; i++) {
        str += sentence[i].cont;
    }
    return str;
}

function removeBrace(text){
    var lb = text.indexOf('（');
    while(lb>0) {
        var rb = text.indexOf('）');
        text = text.substring(0,lb) + text.substring(rb+1);
        lb = text.indexOf('（');
    }
    return text;
}

