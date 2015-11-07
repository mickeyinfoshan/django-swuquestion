# -*- coding: utf-8 -*-

from django.db import models

# Create your models here.
class Sentence(models.Model):
	text = models.TextField('句子')
	def __unicode__(self):
		return unicode(self.text)

class Label(models.Model):
	text = models.CharField('标签',max_length=20)
	def __unicode__(self):
		return unicode(self.text)

class Question(models.Model):
	text = models.TextField('问题')
	def __unicode__(self):
		return unicode(self.text)

class Grade(models.Model):
	sentence = models.ForeignKey(Sentence)
	label = models.ForeignKey(Label)
	question = models.ForeignKey(Question)
	grade = models.IntegerField('分数')
	date = models.DateField(auto_now = True)