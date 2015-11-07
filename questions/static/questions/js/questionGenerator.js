
/**
 * Created by mwq on 2015/3/28.
 */
function analyze() {
    var base     = "http://ltpapi.voicecloud.cn/analysis/?";
    var api_key  = "r3V2w3W9bXtZNXDIbqqlbY0IOPZpQh2bdhOupgcK";
    var element  = document.getElementById("pattern");
    var pattern  = 'all';
    var text     = removeBrace(document.getElementById("text").value).toUpperCase();
    var format   = "json";
    var uri      = (base
    + "api_key="   + api_key   + "&text="   + text
    + "&pattern="  + pattern   + "&format=" + format
    + "&callback=" + "successCallBack");
    $('#hgdApi').remove();
    var script = document.createElement('script');
    script.setAttribute('src', uri);
    script.setAttribute('id','hgdApi');
    document.getElementsByTagName('head')[0].appendChild(script);
    $('#originText').html('分析中，请耐心等候');
    $('#questions').html('');
}


// 请求成功的回调函数，
function successCallBack(d) {
    $('#originText').html('');
    //获取的数据data[[[{}]]],所以data[0][n]才是要用的数据
    var paragraph = d[0];
    for(var sentenceIndex = 0; sentenceIndex<paragraph.length; sentenceIndex++){
        var sentence = paragraph[sentenceIndex];
        var p = document.createElement('p');
        p.className = "sentence";
        //拼接分词后的字放回到#originText中
        p.innerHTML = getSentenceContent(sentence);     
        //console.log(JSON.stringify(sentence));
        $('#originText').append(p);
        (function(){
            var s = sentence;
            p.onclick = function(e) {
                questions = generateQuestionBySentence(s);
                showQuestions(questions);
                $('p').removeClass('sentence-selected');
                e.target.className = "sentence sentence-selected"
            };
        })();
        $('.sentence')[0].click();
        var questions = generateQuestionBySentence(sentence);
        if(document.expando || '-ms-scroll-limit' in document.documentElement.style) {
            ExportExcel(sentence,questions);
        }
    }
}

//srl: 语义角色标注; pos: 词性标注; last: 持续; mq: 数字;根据句子得到问题的集合
function generateQuestionBySentence(sentence) {
    var questions = [];
    var sentence = wipeNeedlessComponent(sentence);
    var srlQuestions = srlGenerateQuestionsBySentence(sentence);
    var posQuestions = posGenerateQuestionsBySentence(sentence);
    var lastQuestions = lastQuestionsBySentence(sentence);
    var mqQuestions = mqQuestion(sentence);
    for(var i = 0; i<srlQuestions.length; i++){
        questions = pushQuestion(questions,srlQuestions[i]);
    }
    for(i = 0; i<posQuestions.length; i++) {
        questions = pushQuestion(questions,posQuestions[i]);
    }
    for(i = 0; i<lastQuestions.length; i++) {
        questions = pushQuestion(questions,lastQuestions[i]);
    }
    for(i = 0; i<mqQuestions.length; i++) {
        questions = pushQuestion(questions,mqQuestions[i]);
    }
    return questions;
}


//出现问题
function showQuestions(questions) {
    $('#questions').html('');
    if(questions.length==0) {
        var alertDiv = $('<div></div>');
        alertDiv.addClass('alert');
        alertDiv.addClass('alert-warning');
        alertDiv.html('抱歉，该句不能产生问题');
        $('#questions').append(alertDiv);
        return;
    }
    for(var i = 0; i<questions.length; i++){
        var question = questions[i];
       var p = document.createElement('p');
       var questionWrapper = document.createElement('span');
       questionWrapper.innerHTML = question.text;
        p.appendChild(questionWrapper);
        var label = document.createElement('span');
        label.innerHTML = question.label;
        label.className = "label label-info";
        p.appendChild(label);
        var gradeInput = document.createElement('input');
        gradeInput.className = 'gradeInput';
        p.appendChild(gradeInput);
        $("#questions").append(p);
    }
    var submitButton = document.createElement('button');
    submitButton.innerHTML = '提交';
    submitButton.onclick = gradeBtnHandler;
    $('#questions').append(submitButton);
}

function constructDataToPost() {
    var questions = [];
    //var gradeInputs = $('.gradeInput');
    //for(var i = 0; i<gradeInputs.length; i++){
    $('.gradeInput').each(function(){
        var gradeInput = $(this);
        if(gradeInput.val()=="")
            return true;
        label = gradeInput.prev().html();
        question = gradeInput.prev().prev().html();
        grade = gradeInput.val();
        sentence = $('.sentence.sentence-selected').html();
        question = {
            sentence : sentence,
            question : question,
            label : label,
            grade : grade
        };
        questions.push(question);
    });
    return questions;
}

function gradeBtnHandler() {
    var data = JSON.stringify(constructDataToPost());
    var url = 'grade/question/';
    $.post(url,{'questions':data}).done(function(d){
        if(d=='200')
            alert('打分成功');
    });
}