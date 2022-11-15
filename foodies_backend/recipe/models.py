from email.policy import default
from django.db import models
from django.utils.timezone import now
from django.contrib.auth import get_user_model
from django.db.models import Avg, Sum
User = get_user_model()

class Listing(models.Model):
    class FoodType(models.TextChoices):
        VEGETARIAN = 'Vegetarian'
        NON_VEGETARIAN = 'Non Vegetarian'

    class CuisineType(models.TextChoices):
        CHINESE = 'Chinese'
        INDIAN = 'Indian'
        MEXICAN = 'Mexican'
        OTHER = 'Other'
        
    class MealType(models.TextChoices):
        BREAKFAST = 'BREAKFAST'
        LUNCH = 'LUNCH'
        DINNER = 'DINNER'
        SNACK = 'SNACK'
        DRINK = 'DRINK'


    contributor = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    contributor_email = models.EmailField(max_length=255, null=True)
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    rating = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    description = models.TextField()
    #prep_time = models.IntegerField()
    #cook_time = models.IntegerField()
    #food_type = models.CharField(max_length=100, choices=FoodType.choices, default=FoodType.VEGETARIAN)
    #cuisine_type = models.CharField(max_length=100, choices=CuisineType.choices, default=CuisineType.OTHER)
    meal_type = models.CharField(max_length=100, choices=MealType.choices, default=MealType.LUNCH)
    main_photo = models.ImageField(upload_to='listings/', null=True, blank=True)
    #photo_1 = models.ImageField(upload_to='listings/', null=True, blank=True)
    #photo_2 = models.ImageField(upload_to='listings/', null=True, blank=True)
    #photo_3 = models.ImageField(upload_to='listings/', null=True, blank=True)
    is_published = models.BooleanField(default=False)
    date_created = models.DateTimeField(default=now)
    
    likes = models.ManyToManyField(User, related_name='liked', blank=True)
    
    @property
    def estimated_total_price(self):
        if self.ingredient_set.count() > 0:
            return sum(i.estimated_price for i in self.ingredient_set.all())
        return 0

    def estimated_adjusted_total_price(self, existing_ingredients):
        if self.ingredient_set.count() > 0:
            return sum(i.estimated_price for i in self.ingredient_set.all() if i.name not in existing_ingredients )
        return 0
    
    def delete(self):
        self.main_photo.storage.delete(self.main_photo.name)
        #self.photo_1.storage.delete(self.photo_1.name)
        #self.photo_2.storage.delete(self.photo_2.name)
        #self.photo_3.storage.delete(self.photo_3.name)

        super().delete()

    def __str__(self):
        return self.title
    
class Ingredient(models.Model):
    name = models.CharField(max_length=255)
    qty = models.CharField(max_length=255, blank=True)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, null=True)
    
    @property
    def estimated_price(self):
        if self.ingredientpricecontribution_set.count() > 0:
            return self.ingredientpricecontribution_set.aggregate(Avg('price')).get('price__avg')
        elif IngredientPriceContribution.objects.filter(ingredient__name=self.name).count() > 0:
            return IngredientPriceContribution.objects.filter(ingredient__name=self.name).aggregate(Avg('price')).get('price__avg')
        elif IngredientPriceContribution.objects.count() > 0:
            return IngredientPriceContribution.objects.aggregate(Avg('price')).get('price__avg')
        else:
            return 0.00
    
class IngredientPriceContribution(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)

class Comment(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    text = models.TextField()
    date_created = models.DateTimeField(default=now)
    @property
    def username(self):
        return self.user.username if self.user.username else 'User '+str(self.user.id)