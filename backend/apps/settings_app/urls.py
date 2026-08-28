from django.urls import path

from apps.settings_app.views import AdminSettingsView, PublicSettingsView

urlpatterns = [
    path('public/', PublicSettingsView.as_view(), name='public-settings'),
    path('', AdminSettingsView.as_view(), name='admin-settings'),
]
