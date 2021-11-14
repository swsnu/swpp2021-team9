""" Band views
instrument views for band
TODO ("implement")
"""
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotAllowed, HttpResponseNotFound
from django.http.request import HttpRequest


def instrument(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(['GET'])
