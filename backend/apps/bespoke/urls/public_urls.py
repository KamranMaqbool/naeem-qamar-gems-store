from django.urls import path

from apps.bespoke.views import PublicBespokeCreateView

urlpatterns = [
    path('request/', PublicBespokeCreateView.as_view(), name='bespoke-request'),
]
