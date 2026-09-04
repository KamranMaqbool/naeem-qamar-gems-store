from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # Django admin
    path('admin/', admin.site.urls),

    # API documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Auth & Users
    path('api/v1/auth/', include('apps.accounts.urls.auth_urls')),
    path('api/v1/users/', include('apps.accounts.urls.user_urls')),
    path('api/v1/admin/customers/', include('apps.accounts.urls.admin_urls')),

    # Catalog
    path('api/v1/products/', include('apps.catalog.urls.public_urls')),
    path('api/v1/admin/products/', include('apps.catalog.urls.admin_urls')),
    path('api/v1/admin/categories/', include('apps.catalog.urls.category_admin_urls')),

    # Inventory
    path('api/v1/admin/inventory/', include('apps.inventory.urls')),

    # Orders & Cart
    path('api/v1/cart/', include('apps.orders.urls.cart_urls')),
    path('api/v1/orders/', include('apps.orders.urls.order_urls')),
    path('api/v1/admin/orders/', include('apps.orders.urls.admin_urls')),

    # Payments
    path('api/v1/payments/', include('apps.payments.urls')),

    # Discounts
    path('api/v1/discounts/', include('apps.discounts.urls.public_urls')),
    path('api/v1/admin/discounts/', include('apps.discounts.urls.admin_urls')),

    # Bespoke
    path('api/v1/bespoke/', include('apps.bespoke.urls.public_urls')),
    path('api/v1/admin/bespoke/', include('apps.bespoke.urls.admin_urls')),

    # Certificates
    path('api/v1/certificates/', include('apps.certificates.urls')),

    # Settings
    path('api/v1/settings/', include('apps.settings_app.urls')),

    # Analytics
    path('api/v1/admin/analytics/', include('apps.analytics.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
