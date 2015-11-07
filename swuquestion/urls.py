from django.conf.urls import patterns, include, url
from django.contrib import admin
import questions.views
urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'swuquestion.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^grade/question/',questions.views.gradeQuestion),
    url(r'^$',questions.views.generateQuestionView),
    url(r'^questions/from/zip/$', questions.views.generateQuestionsFromZip),
    url(r'^admin/', include(admin.site.urls)),
)
