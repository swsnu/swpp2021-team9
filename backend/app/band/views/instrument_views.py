""" Band views
instrument views for band
TODO ("implement")
"""
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotFound
from django.http.request import HttpRequest
from django.views.decorators.http import require_http_methods


@require_http_methods(['GET'])
def instrument(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=200)
