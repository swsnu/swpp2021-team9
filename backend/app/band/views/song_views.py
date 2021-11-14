""" Band views
song views for band
TODO ("implement")
"""
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotAllowed, HttpResponseNotFound
from django.http.request import HttpRequest


def song(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)
    elif request.method == 'POST':
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])


def song_main(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(['GET'])


def song_search(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(['GET'])


def song_info(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)
    elif request.method == 'PUT':
        return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(['GET', 'PUT'])
