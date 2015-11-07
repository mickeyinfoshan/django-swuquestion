from django.contrib import admin
from questions.models import Question,Grade,Label,Sentence
# Register your models here.

class GradeAdmin(admin.ModelAdmin):
	list_display = ('sentence','question','label','grade','date')

admin.site.register(Sentence)
admin.site.register(Question)
admin.site.register(Label)
admin.site.register(Grade,GradeAdmin)