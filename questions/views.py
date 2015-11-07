from django.shortcuts import render
from questions.models import Question,Sentence,Label,Grade
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
import zipfile
import requests
import unicodecsv as csv
import xlwt

# Create your views here.
@csrf_exempt
def gradeQuestion(request):
	questionList = json.loads(request.POST['questions'])
	for question in questionList:
		sentenceText = question['sentence']
		questionText = question['question']
		labelText = question['label']
		gradeVal = question['grade']
		if Sentence.objects.filter(text=sentenceText).exists() :
			sentence = Sentence.objects.get(text=sentenceText)
		else:
			sentence = Sentence(text=sentenceText)
			sentence.save()

		if Question.objects.filter(text=questionText).exists():
			question = Question.objects.get(text=questionText)
		else:
			question = Question(text=questionText)
			question.save()

		if Label.objects.filter(text=labelText).exists():
			label = Label.objects.get(text = labelText)
		else:
			label = Label(text = labelText)
			label.save()
		grade = Grade(sentence=sentence,question=question,label=label,grade=gradeVal)
		grade.save()
	return HttpResponse('200')

def generateQuestionView(request):
	return render(request,'questions/index.html',{})

@csrf_exempt
def generateQuestionsFromZip(request):
	if not "texts" in request.FILES:
		return HttpResponse("File Not Found!")
	zipedTexts = request.FILES['texts']
	if not zipfile.is_zipfile(zipedTexts):
		return HttpResponse("Not A ZipFile!")
	response = HttpResponse(content_type="application/vnd.ms-excel")
	response['Content-Disposition'] = 'attachment; filename="q.xls"'
	texts = zipfile.ZipFile(zipedTexts)
	url = "http://localhost:8100"
	headers = {"Content-Type": "application/x-www-form-urlencoded"}
	
	#writer = csv.writer(response,dialect=csv.excel, encoding="utf-8")
	wb = xlwt.Workbook(encoding="UTF-8")
	ws = wb.add_sheet('questions')
	row = 0
	for name in texts.namelist():
		content = texts.read(name).decode("utf-8")
		payload = {"text" : content, "api_key" : "158978305"}
		r = requests.post(url, data=payload, headers=headers)
		sentences = r.json()
		for sentence in sentences:
			for question in sentence["questions"]:
				p = name.encode("utf-8")
				s = sentence["sentenceContent"].encode("utf-8")
				q = question["text"].encode("utf-8")
				#writer.writerow((p,s,q))
				ws.write(row,0,p)
				ws.write(row,1,s)
				ws.write(row,2,q)
				row = row + 1
	wb.save(response)
	return response


