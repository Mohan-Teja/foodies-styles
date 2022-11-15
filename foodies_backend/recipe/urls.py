from django.urls import path
from .views import ListingDetailView, SubscriptionListingsView, ManageRecipeView, SimilarRecipeView, SearchListingsView, ManageIngredientView, ManageIngredientPriceContributionView, CommentView, CommentManageView, ToggleLikeView,LikedRecipesView


urlpatterns = [
    path('ipc', ManageIngredientPriceContributionView.as_view()),
    path('ingredient', ManageIngredientView.as_view()),
    path('manage', ManageRecipeView.as_view()),
    path('detail', ListingDetailView.as_view()),
    path('similar', SimilarRecipeView.as_view()),
    path('subscription-listings', SubscriptionListingsView.as_view()),
    path('search', SearchListingsView.as_view()),
    path('comment-manage', CommentManageView.as_view()),
    path('comment', CommentView.as_view()),
    path('toggle-like', ToggleLikeView.as_view()),
    path('get-liked-listings', LikedRecipesView.as_view()),
]