""" Band views
user views for band
TODO ("implement")
"""
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotAllowed, HttpResponseNotFound
from django.http.request import HttpRequest


def user_signup(request: HttpRequest):
    if request.method == 'POST':
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['POST'])


def user_signin(request: HttpRequest):
    if request.method == 'POST':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['POST'])


def user_signout(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])


def user_info(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)
    elif request.method == 'PUT':
        return HttpResponse(status=200)
    elif request.method == 'DELETE':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])
