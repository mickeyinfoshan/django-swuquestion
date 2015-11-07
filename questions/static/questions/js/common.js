//将新问题放入questions数组中
function pushQuestion(questions, newQuestion) {
    if(questions.length == 0){
        questions.push(newQuestion);
        return questions;
    }
    for (var questionIndex = 0; questionIndex<questions.length; questionIndex++) {
        question = questions[questionIndex];
        //console.log(newQuestion);
        if(newQuestion.text == question.text 
            && newQuestion.label == question.label) {
            /*if(newQuestion.label != question.label)
                question.label += (" | " + newQuestion.label);*/
            break;
        }
        if(questionIndex == questions.length - 1)
            questions.push(newQuestion);
    }
    return questions;
}

//把收到的对象中每个字拼接到一起，cont属性对应分词后的字
function getSentenceContent(sentence){
    var str = '';
    for(var i = 0; i<sentence.length; i++) {
        str += sentence[i].cont;
    }
    return str;
}

//移除括号
function removeBrace(text){
    var lbz = text.indexOf('（');
    var lby = text.indexOf('(');
    while(lbz>=0 || lby>=0) {
        if(lbz>=0) {
            var rb = text.indexOf('）');
            var lb = lbz;
        }else {
            rb = text.indexOf(')');
            lb = lby;
        }
        text = text.substring(0,lb) + text.substring(rb+1);
        lbz = text.indexOf('（');
        lby = text.indexOf('(');
    }
    return text;
}

//创建Excel
(function CreateExcel() {
    //document.expando是IE老版本专有属性，'-ms-scroll-limit'是IE11所有
    if(document.expando || '-ms-scroll-limit' in document.documentElement.style) {
        oXL = new ActiveXObject("Excel.Application"); //创建AX对象excel 
        oWB = oXL.Workbooks.Add(); //获取workbook对象 
        oSheet = oWB.ActiveSheet; //激活当前sheet 
        currQuestion = 0;
    }
})();

//将产生的问题放入Excel中
function ExportExcel(sentence,questions) { //读取表格中每个单元到EXCEL中 
    oSheet.Cells(currQuestion + 1, 1).value = getSentenceContent(sentence);
    for(var questionIndex = 0; questionIndex < questions.length; questionIndex++) {
        oSheet.Cells(currQuestion + 1, questionIndex + 2).value = questions[questionIndex].text + '--' + questions[questionIndex].label;
    }
    currQuestion++;
    console.log(currQuestion);
    //oXL.Visible = true; //设置excel可见属性 
    $('.save').removeClass('disabled');
}

//输出Excel
function OutExcel() {
    try {
        var fname = oXL.Application.GetSaveAsFilename("question.xls", 'Excel Spreadsheets(*.xls),*.xls');
        console.log('true');
    }catch(error) {
        console.log(error);
    }finally {
        if(fname) {
            oWB.SaveAs(fname);
            oWB.Close(savechange = false);
            oXL.Quit();
            oXL = null;
        }else {
            console.log('导出失败');
        }

        window.setTimeout(function() {
            CollectGarbage();
        }, 1);
    }
}