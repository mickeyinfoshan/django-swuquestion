# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Grade',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('grade', models.IntegerField(verbose_name=b'\xe5\x88\x86\xe6\x95\xb0')),
                ('date', models.DateField(auto_now=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Label',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.CharField(max_length=20, verbose_name=b'\xe6\xa0\x87\xe7\xad\xbe')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.TextField(verbose_name=b'\xe9\x97\xae\xe9\xa2\x98')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Sentence',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.TextField(verbose_name=b'\xe5\x8f\xa5\xe5\xad\x90')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='grade',
            name='label',
            field=models.ForeignKey(to='questions.Label'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='grade',
            name='question',
            field=models.ForeignKey(to='questions.Question'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='grade',
            name='sentence',
            field=models.ForeignKey(to='questions.Sentence'),
            preserve_default=True,
        ),
    ]
