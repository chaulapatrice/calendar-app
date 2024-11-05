from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import decorators, status
from .util import get_credentials
from urllib.parse import unquote
from .exception import InternalServerError
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:5173"
    client_class = OAuth2Client


@decorators.api_view(['GET'])
def list_calendar_events(request: Request) -> Response:
    service = build('calendar', 'v3', credentials=get_credentials(request.user))
    events = []
    calendars = []
    try:
        calendar_list = service.calendarList().list().execute()

        # We only get calendars where the user is the owner
        calendars = list(
            filter(
                lambda calendar: calendar['accessRole'] == 'owner', calendar_list['items']
            )
        )

        for calendar in calendars:
            event_list = service.events().list(calendarId=calendar['id']).execute()

            events.extend(list(
                map(lambda event: {
                    **event,
                    'calendarId': calendar['id'],
                }, event_list['items'])
            ))
    except HttpError as error:
        raise InternalServerError('Failed to list events and calendars')
    finally:
        service.close()

    return Response({
        'events': events,
        'calendars': calendars
    })


@decorators.api_view(['POST'])
def create_event(request: Request, calendar_id: str | None = None) -> Response:
    service = build('calendar', 'v3', credentials=get_credentials(request.user))
    calendarId = unquote(calendar_id)
    try:
        service.events() \
            .insert(calendarId=calendarId, body=request.data) \
            .execute()
    except HttpError as error:
        raise InternalServerError(str(error))
    finally:
        service.close()

    return Response({
        'detail': 'Event created',
    }, status=status.HTTP_201_CREATED)


@decorators.api_view(['PUT'])
def edit_event(
        request: Request,
        calendar_id: str | None = None,
        event_id: str | None = None
) -> Response:
    service = build('calendar', 'v3', credentials=get_credentials(request.user))
    calendarId = unquote(calendar_id)

    try:
        service.events() \
            .update(calendarId=calendarId,
                    eventId=event_id,
                    body=request.data) \
            .execute()
    except HttpError as error:
        raise InternalServerError(str(error))
    finally:
        service.close()

    return Response({
        'detail': 'Event edited',
    })


@decorators.api_view(['DELETE'])
def delete_event(
        request: Request,
        calendar_id: str | None = None,
        event_id: str | None = None
) -> Response:
    service = build('calendar', 'v3', credentials=get_credentials(request.user))
    calendarId = unquote(calendar_id)

    try:
        service.events() \
            .delete(calendarId=calendarId, eventId=event_id) \
            .execute()
    except HttpError as error:
        raise InternalServerError(str(error))
    finally:
        service.close()

    return Response({
        'detail': 'Event deleted',
    })
