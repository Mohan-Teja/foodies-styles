from django.urls import path
from .views import RegisterView, RetrieveUserView, Subscribe, Unsubscribe, Subscriptions, TipView


urlpatterns = [
    path('subscribe', Subscribe.as_view()),
    path('unsubscribe', Unsubscribe.as_view()),
    path('subscriptions', Subscriptions.as_view()),
    path('user', RetrieveUserView.as_view()),
    path('tip', TipView.as_view())
]