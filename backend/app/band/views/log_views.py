"""
Make log for counting views
"""
from datetime import datetime, timedelta

from django.db import IntegrityError
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from band.models import CoverLog, CombinationLog, Cover, Combination


def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        addr = x_forwarded_for.split(",")[0]
    else:
        addr = request.META.get("REMOTE_ADDR")
    return addr


class CoverLogsView(APIView):
    """View for count cover logs"""
    permission_classes = [AllowAny]

    def post(self, request: Request):
        user_id = request.user.id
        addr = get_client_ip(request)

        try:
            data = request.data
            cover_id = data["cover_id"]
        except KeyError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        timestamp_from = datetime.now() + timedelta(hours=-1)

        if CoverLog.objects.filter(
            addr=addr,
            user_id=user_id,
            cover_id=cover_id,
            timestamp__gte=timestamp_from,
        ).exists():
            return Response(status=status.HTTP_208_ALREADY_REPORTED)

        try:
            cover = Cover.objects.all().get(id=cover_id)
            CoverLog(addr=addr, user_id=user_id, cover=cover).save()
        except Cover.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_200_OK)


class CombinationLogsView(APIView):
    """View for count CombinationLog logs"""
    permission_classes = [AllowAny]

    def post(self, request: Request):
        user_id = request.user.id
        addr = get_client_ip(request)

        try:
            data = request.data
            combination_id = data["combination_id"]
        except KeyError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        timestamp_from = datetime.now() + timedelta(hours=-1)
        if CombinationLog.objects.filter(
            addr=addr,
            user_id=user_id,
            combination_id=combination_id,
            timestamp__gte=timestamp_from,
        ).exists():
            return Response(status=status.HTTP_208_ALREADY_REPORTED)

        try:
            combination = Combination.objects.all().get(id=combination_id)
            CombinationLog(addr=addr, user_id=user_id, combination=combination).save()
        except Combination.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_200_OK)
