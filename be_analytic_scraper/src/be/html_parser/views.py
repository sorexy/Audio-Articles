from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json

from urllib.request import urlopen, Request
from bs4 import BeautifulSoup as bs4
import html2text
from google.cloud import texttospeech


def parse_html(link: str) -> str:
    parser = html2text.HTML2Text()
    parser.ignore_links = True

    req = Request(link, headers={'User-Agent': 'Mozilla/5.0'})
    soup = bs4(urlopen(req), 'html.parser')

    # remove elements with img tag
    imgs = soup.findAll('img')
    for img in imgs:
        img.decompose()
    footers = soup.findAll('footer')
    for footer in footers:
        footer.decompose()

    paragraphs = soup.findAll('p')
    parsedStr = parser.handle(str(paragraphs))

    return parsedStr


def text2speech(name: str, input: str) -> None:
    # docs: https://cloud.google.com/text-to-speech/docs/quickstart-client-libraries#client-libraries-install-python
    # TODO: split 5000 characters files
    DOWNLOADS_FOLDER = "/Users/sorex/Projects/youtubeAnalyticScraper/be_analytic_scraper/src/be/html_parser/media/"

    client = texttospeech.TextToSpeechClient()
    synthesis_input = texttospeech.types.SynthesisInput(text=input)
    # Build the voice request, select the language code ("en-US") and the ssml
    voice = texttospeech.types.VoiceSelectionParams(
        language_code='en-GB-Standard-C',
        ssml_gender=texttospeech.enums.SsmlVoiceGender.FEMALE)
    # Select the type of audio file you want returned
    audio_config = texttospeech.types.AudioConfig(
        audio_encoding=texttospeech.enums.AudioEncoding.MP3)
    # Perform the text-to-speech request on the text input with the selected
    # voice parameters and audio file type
    response = client.synthesize_speech(synthesis_input, voice, audio_config)

    with open(DOWNLOADS_FOLDER + name + '.mp3', 'wb') as out:
        out.write(response.audio_content)
        print('Audio content written to media/' + name)


# Main view
@csrf_exempt
def input(request):
    if request.method == 'POST':
        # TODO: Format the parsed article to extract only middle sentences and not ads, and commas in new paragraphs
        # Figure out how to do video
        title = json.loads(request.body)['title']
        linkToParse = json.loads(request.body)['link']
        parsedArticle = parse_html(linkToParse)
        print("=" * 150)
        print(parsedArticle)
        print("=" * 150)

        text2speech(title, parsedArticle)

        return HttpResponse("Posty post")
    elif request.method == 'GET':
        return HttpResponse("Don't look!")
