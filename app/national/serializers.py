from rest_framework import fields
from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import Serializer
from .models import Bridge
from typing import Dict, Any


# -----------------------------------------------------------
# Serializers are not currently in use.
# Led to significant slowdown for passing data to express for
# post-processing.
# StreamingHTTPRequest used instead
# ----------------------------------------------------------
class BridgeLocationFieldSerializer(ModelSerializer):

    class Meta:
        model = Bridge
        fields = ('latitude', 'longitude')

        read_only_fields = fields

    def __init__(self, *args, **kwargs):
        self._fields_to_add = kwargs.pop('fields', None)

        super().__init__(*args, **kwargs)

   # slow Serializer to add additional fields to a serializer on the fly
    def get_field_names(self, *args, **kwargs):
        original_fields = super().get_field_names(*args, **kwargs)
        if self._fields_to_add:
            return set(list(original_fields) + list(self._fields_to_add))
        return original_fields

class BridgeLocationSerializer(ModelSerializer):

    class Meta:
        model = Bridge
        fields = ('latitude', 'longitude')

        read_only_fields = fields

class BridgeSerializer(ModelSerializer):
    class Meta:
        model = Bridge
        fields = "__all__"
