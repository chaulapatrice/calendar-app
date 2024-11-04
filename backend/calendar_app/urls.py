from django.urls import path
from .views import (
    GoogleLogin,
    list_calendar_events,
    create_event,
    edit_event,
    delete_event
)

urlpatterns = [
    path('login/', GoogleLogin.as_view(), name='login'),
    path('events/', list_calendar_events, name='events'),
    path('events/<str:calendar_id>/create/', create_event, name='create_event'),
    path('events/<str:calendar_id>/<str:event_id>/edit/', edit_event, name='edit_event'),
    path('events/<str:calendar_id>/<str:event_id>/delete/', delete_event, name='delete_event'),
]
