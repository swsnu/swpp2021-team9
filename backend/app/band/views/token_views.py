""" Band views
token views for band
"""
from django.http import HttpResponse
from django.http.request import HttpRequest
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import ensure_csrf_cookie


@ensure_csrf_cookie
@require_GET
def token(request: HttpRequest):
    if request.method == 'GET':
        return HttpResponse(status=204)
