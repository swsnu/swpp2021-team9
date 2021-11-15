""" Band views
user views for band
TODO ("implement")
"""
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotFound
from django.http.request import HttpRequest
from django.views.decorators.http import require_http_methods


@require_http_methods(['POST'])
def user_signup(request: HttpRequest):
    if request.method == 'POST':
        return HttpResponse(status=201)


@require_http_methods(['POST'])
def user_signin(request: HttpRequest):
    if request.method == 'POST':
        return HttpResponse(status=204)


@require_http_methods(['POST'])
def user_signout(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=204)


@require_http_methods(['GET', 'PUT', 'DELETE'])
def user_info(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)
    elif request.method == 'PUT':
        return HttpResponse(status=200)
    elif request.method == 'DELETE':
        return HttpResponse(status=204)
