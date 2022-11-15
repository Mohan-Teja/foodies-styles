from rest_framework import serializers
from .models import Listing, Ingredient, IngredientPriceContribution, Comment
class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'       
class IngredientViewSerializer(serializers.ModelSerializer):
    estimated_price = serializers.DecimalField(6,2)
    class Meta:
        model = Ingredient
        fields = ('id','name','qty','estimated_price')
class NewListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = '__all__'
class ListingSerializer(serializers.ModelSerializer):
    estimated_total_price = serializers.DecimalField(6,2)
    ingredients = IngredientViewSerializer(many=True, source='ingredient_set')
    class Meta:
        model = Listing
        fields = '__all__'
class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    class Meta:
        model = Comment
        fields = '__all__'
        
class ListingViewSerializer(serializers.ModelSerializer):
    estimated_total_price = serializers.DecimalField(6,2)
    ingredients = IngredientViewSerializer(many=True, source='ingredient_set')
    likes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = Listing
        fields = ('id','ingredients','contributor_email','title','slug','description','meal_type','main_photo','date_created','contributor','estimated_total_price','likes')
           
class IngredientPriceContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = IngredientPriceContribution
        fields = '__all__'
        
