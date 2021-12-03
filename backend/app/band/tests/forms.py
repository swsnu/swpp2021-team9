from django import forms


class CoverPostForm(forms.Form):
    audio = forms.FileField()
    title = forms.CharField()
    description = forms.CharField()
    instrument = forms.CharField()
    tags = forms.CharField()
