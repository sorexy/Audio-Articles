from django import forms


class FileForm(forms.Form):
    title = forms.CharField(max_length=150)
    file = forms.FileField()
