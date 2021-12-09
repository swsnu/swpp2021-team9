""" Band views
instrument views for band
TODO ("implement")
"""
from rest_framework import viewsets
from band.serializers import InstrumentSerializer
from band.models import Instrument


class InstrumentView(viewsets.ModelViewSet):
    """Viewset for instrument"""

    queryset = Instrument.objects.all()
    serializer_class = InstrumentSerializer
