from rest_framework import fields
from rest_framework.serializers import ModelSerializer
from .models import Bridge


class BridgeLocationFieldSerializer(ModelSerializer):

    class Meta:
        model = Bridge
        fields = ('latitude', 'longitude')

    def __init__(self, *args, **kwargs):
        self._fields_to_add = kwargs.pop('fields', None)

        super().__init__(*args, **kwargs)

    def get_field_names(self, *args, **kwargs):
        original_fields = super().get_field_names(*args, **kwargs)
        if self._fields_to_add:
            return set(list(original_fields) + list(self._fields_to_add))
        return original_fields
