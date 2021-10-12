from rest_framework import fields
from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import Serializer
from .models import Bridge
from typing import Dict, Any


class BridgeLocationFieldSerializer(ModelSerializer):

    class Meta:
        model = Bridge
        fields = ('latitude', 'longitude')

        read_only_fields = fields

    def __init__(self, *args, **kwargs):
        self._fields_to_add = kwargs.pop('fields', None)

        super().__init__(*args, **kwargs)

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
# class BridgeLocationSimpleSerializer(bridge: Bridge) -> Dict[str, Any]:
#     return {
#         'latitude': bridge.latitude,
#         'longitude': bridge.longitude,
#         'rating': bridge.lowest_rating
#     }
