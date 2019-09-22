from django.shortcuts import render
from django.http import HttpResponse, HttpResponseServerError
from django.views.decorators.csrf import csrf_exempt
from .forms import FileForm

from urllib.request import urlopen, Request
from bs4 import BeautifulSoup as bs4
import textract
import html2text
import json
import string

from google.cloud import texttospeech


def parse_html(link: str) -> str:
    parser = html2text.HTML2Text()
    parser.ignore_links = True

    req = Request(link, headers={'User-Agent': 'Mozilla/5.0'})
    soup = bs4(urlopen(req), 'html.parser')

    imgs = soup.findAll('img')
    for img in imgs:
        img.decompose()
    footers = soup.findAll('footer')
    for footer in footers:
        footer.decompose()
    headers = soup.findAll('header')
    for header in headers:
        header.decompose()

    paragraphs = soup.findAll('p')

    parsedStr = parser.handle(str(paragraphs))
    formattedStr = parsedStr
    charsToRemove = ['\n,', '[', ']', '_', '*']
    for c in charsToRemove:
        formattedStr = formattedStr.replace(c, "")

    return formattedStr


def text_to_speech(name: str, input: str) -> None:
    def split_article_and_convert(input: str) -> list:
        """Google T2S has a limit of 5000 chars, if we have an article of more,
        We have to split them into multiple requests and join them into a single
        mp3
        """
        tmp = input[:]
        cutoffChars = ['\n', '.', ',', ' ']
        cutoff = -1
        counter = 0

        segments = []

        while len(tmp) > 5000:
            while cutoff == -1 and counter < len(cutoffChars):
                cutoff = tmp.rfind(cutoffChars[counter], 0, 5000)
                counter += 1
            else:
                segments.append(tmp[:cutoff])
                tmp = tmp[cutoff:]

        if len(tmp) <= 5000:
            segments.append(tmp)

        print("Number of segments: %s" % (len(segments)))

        synSegments = []
        for segment in segments:
            synSegments.append(texttospeech.types.SynthesisInput(text=segment))

        responses = []
        for item in synSegments:
            responses.append(
                client.synthesize_speech(item, voice, audio_config)
            )

        return responses

    # Setup the client, voice, and format to be returned
    DOWNLOADS_FOLDER = "/Users/sorex/Projects/youtubeAnalyticScraper/be_analytic_scraper/src/be/html_parser/media/mp3s/"
    client = texttospeech.TextToSpeechClient()

    voice = texttospeech.types.VoiceSelectionParams(
        language_code='en-GB-Standard-C',
        ssml_gender=texttospeech.enums.SsmlVoiceGender.FEMALE)

    audio_config = texttospeech.types.AudioConfig(
        audio_encoding=texttospeech.enums.AudioEncoding.MP3)

    audio_responses = split_article_and_convert(input)

    with open(DOWNLOADS_FOLDER + name + '.mp3', 'wb') as out:
        for response in audio_responses:
            out.write(response.audio_content)
        print('Audio content written to media/mp3s/' + name)

# Main view
@csrf_exempt
def input(request):
    if request.method == 'POST':
        # TODO: Figure out how to do video
        title = json.loads(request.body)['title']
        linkToParse = json.loads(request.body)['link']
        parsedArticle = parse_html(linkToParse)

        print("=" * 150)
        print(parsedArticle)
        print("=" * 150)

        try:
            text_to_speech(title, parsedArticle)
        except:
            return HttpResponseServerError()

        return HttpResponse("Success")
    elif request.method == 'GET':
        return HttpResponseServerError()


@csrf_exempt
def upload(request):
    if request.method == 'POST':
        # Bind the request to the form (You dont have to do this)
        # But it keeps it cleaner as you have a form structure, and
        # it enforces the schema (i.e. when you POST the form from fe, it needs
        # a 'title' field and a 'file' field, as described in forms.py)
        form = FileForm(request.POST, request.FILES)
        name = form['title'].value()

        # Can just use the bare POST and FILES attributes, check docs
        # request.POST contains the form data that aren't files (title)
        # request.FILES contains the files uploaded
        # It only displays the title, when printed but this is the actual file
        print(form['file'].value())

        # TODO: handle file name clashes
        with open('./html_parser/media/files/' + name, 'wb+') as file:
            for chunk in form['file'].value().chunks():
                file.write(chunk)

        # read to string
        rawText = textract.process(
            './html_parser/media/files/' + name)

        # Only send printables to google t2s
        encodedText = rawText.decode('utf-8')
        printables = set(string.printable)
        printable = filter(lambda x: x in set(
            string.printable) and x != '\n', encodedText)
        text = "".join(printable)

        print(text)

        # TODO: fix google api error sending text TODO
        # try:
        text_to_speech(name, text)
        # except:
        #     return HttpResponseServerError()

        return HttpResponse("Success")
    elif request.method == 'GET':
        return HttpResponseServerError()
