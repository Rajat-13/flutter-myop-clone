"""
Asset Serializers
"""
from rest_framework import serializers
from ..models import Asset


class AssetSerializer(serializers.ModelSerializer):
    size_formatted = serializers.CharField(read_only=True)
    uploader_name = serializers.SerializerMethodField()

    class Meta:
        model = Asset
        fields = [
            'id', 'name', 'type', 'storage_path', 'url',
            'size_bytes', 'size_formatted', 'mime_type',
            'used_in', 'uploaded_by', 'uploader_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'size_formatted', 'created_at', 'updated_at']

    def get_uploader_name(self, obj):
        if obj.uploaded_by:
            return obj.uploaded_by.full_name or obj.uploaded_by.username or 'Unknown'
        return 'Unknown'


class AssetCreateSerializer(serializers.ModelSerializer):
    """For creating assets after file upload"""
    class Meta:
        model = Asset
        fields = [
            'name', 'type', 'storage_path', 'url',
            'size_bytes', 'mime_type', 'used_in'
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['uploaded_by'] = request.user
        return super().create(validated_data)


class AssetUpdateUsageSerializer(serializers.Serializer):
    """For updating where an asset is used"""
    used_in = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=True
    )
