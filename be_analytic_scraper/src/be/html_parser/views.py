from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
@csrf_exempt
def input(request):
    if request.method == 'POST':
        # TODO: Parse the json to get the link, input cleansing, and parse the contents of the link as text using html2text
        # https://pypi.org/project/html2text/
        # Then put the text into text2speech, and download the audio
        # Figure out how to do video
        return HttpResponse("Posty post")
    elif request.method == 'GET':
        return HttpResponse("Don't look!")
