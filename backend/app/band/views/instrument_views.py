""" Band views
instrument views for band
TODO ("implement")
"""
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotFound
from django.http.request import HttpRequest
from django.views import View


# instrument/
class Instrument(View):
    def get(self, request: HttpRequest):
        return HttpResponse(status=200)
