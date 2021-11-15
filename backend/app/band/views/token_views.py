""" Band views
token views for band
"""
from django.http import HttpResponse
from django.http.request import HttpRequest
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import ensure_csrf_cookie


@ensure_csrf_cookie
@require_http_methods(['GET'])
def token(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=204)
