"""
Banner Serializers
"""
from rest_framework import serializers
from ..models import Banner, MarqueeSetting


class BannerSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Banner
        fields = [
            'id', 'image', 'image_url', 'link', 'alt_text',
            'order', 'enabled', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class MarqueeSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarqueeSetting
        fields = [
            'id', 'text', 'link', 'speed', 'enabled',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
