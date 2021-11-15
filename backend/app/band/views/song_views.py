""" Band views
song views for band
TODO ("implement")
"""
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotFound
from django.http.request import HttpRequest
from django.views.decorators.http import require_http_methods


@require_http_methods(['GET', 'POST'])
def song(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)
    elif request.method == 'POST':
        return HttpResponse(status=201)


@require_http_methods(['GET'])
def song_main(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)


@require_http_methods(['GET'])
def song_search(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)


@require_http_methods(['GET', 'PUT'])
def song_info(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)
    elif request.method == 'PUT':
        return HttpResponse(status=200)
