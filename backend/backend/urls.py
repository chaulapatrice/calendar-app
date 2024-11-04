from django.contrib import admin
from django.urls import path, include, re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('calendar_app.urls')),
    re_path(r'^accounts/', include('allauth.urls')),
]
