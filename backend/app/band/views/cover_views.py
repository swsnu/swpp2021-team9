""" Band views
cover views for band
TODO ("implement")
"""
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotFound
from django.http.request import HttpRequest
from django.views.decorators.http import require_http_methods


@require_http_methods(['GET', 'POST'])
def cover_song(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)
    elif request.method == 'POST':
        return HttpResponse(status=201)


@require_http_methods(['GET'])
def cover_song_instrument(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)


@require_http_methods(['GET', 'PUT', 'DELETE'])
def cover_info(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)
    elif request.method == 'PUT':
        return HttpResponse(status=200)
    elif request.method == 'DELETE':
        return HttpResponse(status=204)


@require_http_methods(['GET', 'PUT'])
def cover_like(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)
    elif request.method == 'PUT':
        return HttpResponse(status=200)
