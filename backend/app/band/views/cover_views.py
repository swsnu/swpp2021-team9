""" Band views
cover views for band
TODO ("implement")
"""
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotAllowed, HttpResponseNotFound
from django.http.request import HttpRequest


def cover_song(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)
    elif request.method == 'POST':
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])


def cover_song_instrument(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(['GET'])


def cover_info(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)
    elif request.method == 'PUT':
        return HttpResponse(status=200)
    elif request.method == 'DELETE':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])


def cover_like(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)
    elif request.method == 'PUT':
        return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(['GET', 'PUT'])
