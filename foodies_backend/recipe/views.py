from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Listing, User, Ingredient, IngredientPriceContribution, Comment
from .serializers import ListingSerializer, IngredientSerializer, ListingViewSerializer, IngredientPriceContributionSerializer, CommentSerializer, NewListingSerializer
from django.contrib.postgres.search import SearchVector, SearchQuery
from django.db.models import Count
import math
class ToggleLikeView(APIView):
    # submit a comment
    def post(self, request):
        try:
            user = request.user
            
            # request must have a text field, it also must have a Listing ID
            listing_id = request.data['listing_id']
            l = Listing.objects.get(id=listing_id)
            if l.likes.filter(id = user.id).count() == 0:
                l.likes.add(user)
                return Response({'success': 'Liked'}, status=status.HTTP_201_CREATED)
            else:
                l.likes.remove(user)
                return Response({'success': 'Unliked'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )    
class CommentManageView(APIView):
    # submit a comment
    def post(self, request):
        try:
            user = request.user
            
            # request must have a text field, it also must have a Listing ID
            listing_id = request.data['listing_id']
            text = request.data['text']
            
            Comment.objects.create(listing_id=listing_id, text=text, user_id=user.id)
            return Response({'success': 'Comment added'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )    
class CommentView(APIView):
    permission_classes = (permissions.AllowAny, )
    # recipe/comment?listing=39
    def get(self, request, format=None):
        
        try:
            listing_id = request.query_params.get('listing')
            comments = Comment.objects.filter(listing_id=listing_id)
            comments_serialized = CommentSerializer(comments, many=True)

            return Response(
                {'comments': comments_serialized.data},
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class ManageIngredientView(APIView):
    def post(self, request):
        try:
            user = request.user
            
            if not user.is_contributor:
                return Response(
                    {'error': 'User does not have necessary permissions for updating this listing data'},
                    status=status.HTTP_403_FORBIDDEN
                )

            ing = IngredientSerializer(data=request.data)
            
            if ing.is_valid():
                listing = Listing.objects.get(pk=ing.validated_data['listing'].id)
                if not listing.contributor_email == user.email:
                    return Response(
                        {'error': 'Forbidden'},
                        status=status.HTTP_403_FORBIDDEN
                    )
                
                ing.save()
                return Response({'success': 'Ingredient added'}, status=status.HTTP_201_CREATED)
            else:
                return Response(listing.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ManageIngredientPriceContributionView(APIView):
    def post(self, request):

        try:
            user = request.user
            ing = request.query_params.get('id')
            ipc = IngredientPriceContributionSerializer(data=request.data)
            
            if ipc.is_valid():
                obj, created = IngredientPriceContribution.objects.update_or_create(
                        ingredient_id=ing,
                        user_id=user.id,
                        defaults={'price': ipc.validated_data['price']},
                    )

                return Response({'success': 'Ingredient added'}, status=status.HTTP_201_CREATED)
            else:
                return Response(listing.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ManageRecipeView(APIView):
    def get(self, request, format=None):
        try:
            user = request.user

            if not user.is_contributor:
                return Response(
                    {'error': 'User does not have necessary permissions for getting this listing data'},
                    status=status.HTTP_403_FORBIDDEN
                )

            slug = request.query_params.get('slug')

            if not slug:
                listing = Listing.objects.order_by('-date_created').filter(
                    contributor_email=user.email
                )
                listing = ListingSerializer(listing, many=True)
                return Response(
                    {'listing': listing.data},
                    status=status.HTTP_200_OK
                )

            if not Listing.objects.filter(
                contributor_email=user.email,
                slug=slug
            ).exists():
                return Response(
                    {'error': 'Listing not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            listing = Listing.objects.get(
                contributor_email=user.email,
                slug=slug
            )
            listing = ListingSerializer(listing)

            return Response(
                {'listing': listing.data},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        try:
            user = request.user

            if not user.is_contributor:
                return Response(
                    {'error': 'User does not have necessary permissions for getting this listing data'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            listing = NewListingSerializer(data=request.data)

            if listing.is_valid():
                if Listing.objects.filter(slug=listing.validated_data['slug']).exists():
                    return Response(
                        {'error': 'Listing with this slug already exists'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                listing = listing.save()
                listing.contributor_email = user.email
                listing.contributor = User.objects.get(pk=user.id)
                listing.save()
                return Response({'id': listing.id}, status=status.HTTP_201_CREATED)
            else:
                return Response(listing.errors, status=status.HTTP_400_BAD_REQUEST)


        except Exception as e:
            return Response(
                {'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    def patch(self, request):
        try:
            user = request.user

            if not user.is_contributor:
                return Response(
                    {'error': 'User does not have necessary permissions for updating this listing data'},
                    status=status.HTTP_403_FORBIDDEN
                )

            data = request.data

            slug = data['slug']

            is_published = data['is_published']
            
            if is_published == 'True':
                is_published = True
            else:
                is_published = False

            if not Listing.objects.filter(contributor_email=user.email, slug=slug).exists():
                return Response(
                    {'error': 'Listing does not exist'},
                    status=status.HTTP_404_NOT_FOUND
                )

            Listing.objects.filter(contributor_email=user.email, slug=slug).update(
                is_published=is_published
            )

            return Response(
                {'success': 'Listing publish status updated successfully'},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when updating listing'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    def delete(self, request):
        try:
            user = request.user

            if not user.is_contributor:
                return Response(
                    {'error': 'User does not have necessary permissions for deleting this listing data'},
                    status=status.HTTP_403_FORBIDDEN
                )

            data = request.data

            try:
                slug = data['slug']
            except:
                return Response(
                    {'error': 'Slug was not provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not Listing.objects.filter(contributor_email=user.email, slug=slug).exists():
                return Response(
                    {'error': 'Listing you are trying to delete does not exist'},
                    status=status.HTTP_404_NOT_FOUND
                )

            Listing.objects.filter(contributor_email=user.email, slug=slug).delete()

            if not Listing.objects.filter(contributor_email=user.email, slug=slug).exists():
                return Response(
                    status=status.HTTP_204_NO_CONTENT
                )
            else:
                return Response(
                    {'error': 'Failed to delete listing'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except:
            return Response(
                {'error': 'Something went wrong when deleting listing'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request):
        try:
            user = request.user

            if not user.is_contributor:
                return Response(
                    {'error': 'User does not have necessary permissions for updating this listing data'},
                    status=status.HTTP_403_FORBIDDEN
                )
                
            origListing = Listing.objects.get(slug=request.data['slug'])
            origListingPhoto = origListing.main_photo
            listing = NewListingSerializer(origListing,data=request.data)
            

            
            if listing.is_valid():
                if not Listing.objects.filter(contributor_email=user.email, slug=listing.validated_data['slug']).exists():
                    return Response(
                        {'error': 'Listing does not exist'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                listing = listing.save()
                if not listing.main_photo:
                    listing.main_photo = origListingPhoto
                    listing.save()
                    
                Ingredient.objects.filter(listing=listing).delete()
                return Response(
                    {'success': 'Listing_updated Successfully'},
                    status=status.HTTP_200_OK
                )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class LikedRecipesView(APIView):
    def get(self, request, format=None):
        try:
            user = request.user
            listing = user.liked.all()
            listing = ListingSerializer(listing, many=True)
            
            return Response(
                {'listing': listing.data},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class ListingDetailView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, format=None):
        try:
            slug = request.query_params.get('slug')

            if not slug:
                return Response(
                    {'error': 'Must provide slug'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not Listing.objects.filter(slug=slug, is_published=True).exists():
                return Response(
                    {'error': 'Published listing with this slug does not exist'},
                    status=status.HTTP_404_NOT_FOUND
                )

            listing = Listing.objects.get(slug=slug, is_published=True)
            listing = ListingViewSerializer(listing)

            return Response(
                {'listing': listing.data},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SimilarRecipeView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, format=None):
        try:
            slug = request.query_params.get('slug')

            if not slug:
                return Response(
                    {'error': 'Must provide slug'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not Listing.objects.filter(slug=slug, is_published=True).exists():
                return Response(
                    {'error': 'Published listing with this slug does not exist'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            def norm(ingredients, idf):
                v = 0
                for i in ingredients:
                    v = v + idf[i]**2
                return math.sqrt(v)
                

            
            alllistings = Listing.objects.all()
            
            idf = {x['name']: 1+math.log(len(alllistings)/x['df']) for x in list(Ingredient.objects.values('name').annotate(df=Count('name') ).order_by())}
            listing_ingredients = [x['name'] for x in Listing.objects.get(slug=slug).ingredient_set.all().values('name')]
            listing_norm = norm(listing_ingredients, idf)
            
            results = []
            
            for a in alllistings:
                if a.slug != slug:
                    dotproduct = 0
                    a_ingredients = [x['name'] for x in a.ingredient_set.all().values('name')]
                    for i in a_ingredients:
                        if i in listing_ingredients:
                            dotproduct = dotproduct + idf[i]**2
                    a_norm = norm(a_ingredients,idf)
                    results.append({'recipe':ListingSerializer(a).data,'cosine_similarity':dotproduct/(listing_norm * a_norm)})

            results = [a for a in results if a['cosine_similarity'] > 0]
            results.sort(key=lambda x: x['cosine_similarity'], reverse=True)

            return Response(
                results[0:4],
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SubscriptionListingsView(APIView):
    #permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        try:
        
            limit = int(request.query_params.get('limit', 4))
            offset = int(request.query_params.get('offset', 0))
            
            subscriptions = [u.id for u in request.user.subscriptions.all().only("id")]
            listings = Listing.objects.order_by(
                '-date_created').filter(contributor__in = subscriptions)
                
            if not listings.exists():
                return Response(
                    {'error': 'No published listings in the database'},
                    status=status.HTTP_404_NOT_FOUND
                )

            
            listings = ListingSerializer(listings[offset:offset+limit], many=True)

            return Response(
                {'listings': listings.data},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when retrieving listings'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class SearchListingsView(APIView):
    permission_classes = (permissions.AllowAny, )
    
    def get(self, request, format=None):
        try:
            search_title = request.query_params.get('search', None)
            search_method = request.query_params.get('method', None)
            price = request.query_params.get('price', None)
            meal_type = request.query_params.getlist('meal_type')
            ingredient = request.query_params.getlist('ingredient')
            
            existing_ingredient = request.query_params.getlist('existing_ingredient')
            
            limit = int(request.query_params.get('limit', 6))
            offset = int(request.query_params.get('offset', 0))
            

            l = Listing.objects.order_by('-id')
            if search_title != None:
                l = l.filter(title__icontains=search_title)
            if search_method != None:
                l = l.filter(description__icontains=search_method)
            if len(meal_type) > 0:
                l = l.filter(meal_type__in=meal_type)
            if len(ingredient) > 0:
                for i in ingredient:
                    l = l.filter(ingredient__name=i)
            
            l = list(l)
            
            if price != None:
                if price == '<$5':
                    l = [a for a in l if a.estimated_adjusted_total_price(existing_ingredient)<=5]
                elif price == '$5-10':
                    l = [a for a in l if a.estimated_adjusted_total_price(existing_ingredient)>=5 and a.estimated_adjusted_total_price(existing_ingredient)<=10]    
                elif price == '$10-20':
                    l = [a for a in l if a.estimated_adjusted_total_price(existing_ingredient)>=10 and a.estimated_adjusted_total_price(existing_ingredient)<=20] 
                elif price == '$20+':
                    l = [a for a in l if a.estimated_adjusted_total_price(existing_ingredient)>=20] 
                    
            if len(l) == 0:
                return Response(
                    {'error': 'No listings found with this criteria'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            listings = ListingSerializer(l[offset:offset+limit], many=True)

            return Response(
                {'listings': listings.data},
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
            

