# Bryntum Calendar App

We are going to build an application that uses the [Bryntum](https://bryntum.com/products/calendar/docs/) calendar to
view, create and update events.
This tutorial uses [Django](https://www.djangoproject.com) on the backend and [React](https://react.dev) on the
frontend.
We start by implementing the Backend API using Django then we implement frontend application using React. A guide on how
to get started with Django is found [here](https://www.djangoproject.com/start/) and a guide for how to get started with
React is
found [here](https://react.dev/learn)

A full working application for this tutorial can be found [here](https://calendar.creativewebtech.co.za/)

## Backend API

In this section we will learn how to set up a Django application. We will do the following activities

1. Create a virtual enviroment
2. Create a django project
3. Setup API and Authentication
4. Setup Cross-Origin Resource Sharing (CORS)
4. Setup Google OAuth2
4. Create calendar app
5. Add events CRUD endpoints

### Setup a django project

In your projects directory create a new directory using the command

```bash
mkdir bryntum-calendar-app
```

We now create a virtual environment in the directory.
A virtual environment enables us to maintain our project dependencies separately from other projects and the system.

Let's install `virtualenv` first

```
pip3 install virtualenv
```

```bash
python3 -m virtualenv .venv
```

We should also initialize a git repository and create a `.gitignore` file. In the `.gitignore` file we add `.venv`
so that the .venv won't be added to the files tracked by git

```
touch .gitignore
```

Edit your .gitignore file using code editor of your choice

```
.venv
```

Activate the virtual environment using the following command

```bash
source .venv/bin/activate
```

We now install django

```bash
pip install django
```

We need to keep track of the dependencies we have installed. We do it by creating a requirements.txt file
using the command. This is necessary for installing them in a different environment using the file.

```bash
pip freeze > requirements.txt
```

Create a new project

```bash
django-admin startproject backend
```

We have successfully created a new project. In the next section we will be setting up authentication

### Setup API and Authentication

In this section we will be setting up authentication and the API using the
libraries [Google OAuth](https://developers.google.com/identity/protocols/oauth2), [Django Rest Framework](https://www.django-rest-framework.org)
and [DJ Rest Auth](https://dj-rest-auth.readthedocs.io/en/latest/).
Open your root project folder using a code editor of your choice for
example [Visual Studio Code](https://code.visualstudio.com).

In your code editor open the terminal window. If your virtual environment is not active, activate it using the command.

```base 
source .venv/bin/activate
```

Next we install and configure Django Rest Framework

#### Install Django Rest Framework and Configure

We install Django Rest Framework using the following command

```bash
pip install djangorestframework
```

Once again we update our requirements

```bash 
pip freeze > requirements.txt
```

We now configure Django Rest Framework. Before we jump into coding, let us examine
our directory structure

```
./
├── backend
│   ├── backend
│   │   ├── asgi.py
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── manage.py
└── requirements.txt
```

To configure our Django Rest Framework we need to update `settings.py` module to include Django Rest Framework settings.

Add `rest_framework` and `rest_framework.authtoken` to your `INSTALLED_APPS` setting.

```python
INSTALLED_APPS = [
    ....
    'rest_framework',
    'rest_framework.authtoken',
]
```

Global settings for Django Rest Framework are kept in a single configuration dictionary named `REST_FRAMEWORK`.

Add the following to your `settings.py` module

```python
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    )
}
```

In the above code `DEFAULT_PERMISSION_CLASSES` allows access to users that have logged in
only. `DEFAULT_AUTHENTICATION_CLASSES` sets the Django Rest Framework to use a randomly generated string of characters
to authenticate
user. Below is an example of authorisation header

``` yaml
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4
```

We have successfully set up our api and authentication. In the next section we set
up [Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) to allow our frontend
application to communicate with the backend application.

### Setup Cross-Origin Resource Sharing (CORS)

Cross-Origin Resource Sharing (CORS) is an HTTP-header based mechanism that allows a server to indicate any origins (
domain, scheme, or port) other than its own from a browser should allow making AJAX requests.
Our backend API will be running on http://localhost:8000 and frontend application will be running
on http://localhost:5173.
We need to allow our frontend application to make requests to the backend API.

We start by installing a dependency called django-cors-headers

```bash
pip install django-cors-headers
```

Once again we update our requirements.txt file

```bash
pip freeze > requirements.txt
```

In our `settings.py` module we add `corsheaders` application to our `INSTALLED_APPS`

```python
INSTALLED_APPS = [
    ...,
    "corsheaders",
    ...,
]
```

Next we add a middleware class to listen in on responses

```python
MIDDLEWARE = [
    ...,
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    ...,
]
```

We now add origins that we want to allow make requests. In our case it is `http://localhost:5173`.

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173"
]
```

We have successfully configured Cross-Origin Resource Sharing (CORS) for our backend and frontend to
communicate with each other. In the next section we will be setting
up [Google OAuth2](https://developers.google.com/identity/protocols/oauth2) login.

### Setup Google OAuth2

To set up google oauth2 will need the
dependencies [django-allauth](https://docs.allauth.org/en/latest/), [dj-rest-auth](https://dj-rest-auth.readthedocs.io/en/latest/)
and [python-dotenv](https://pypi.org/project/python-dotenv/). We use `dj-rest-auth` to allow users to register and login
using their
google account. `dj-rest-auth` is built on top of [django-allauth](https://docs.allauth.org/en/latest/) which has
already implemented Google OAuth2 registration. You can learn more about
it [here](https://docs.allauth.org/en/dev/socialaccount/providers/google.html).

We use `python-dotenv` to load enviroment variables from a `.env` file.

We install these libraries using the command

```bash
pip install 'dj-rest-auth[with_social]' python-dotenv
```

We installed `dj-rest-auth[with_social]` since we be using google oauth 2 registration and login

We have added two new packages, we need to update our `requirements.txt` again

```bash
pip freeze > requirements.txt
```

Now add the following applications to your `INSTALLED_APPS` in `settings.py` module.

```python
INSTALLED_APPS = [
    ...,
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'dj_rest_auth',
    'dj_rest_auth.registration',
]
```

We are adding `allauth` applications alongside `dj_rest_auth` applications because `dj_rest_auth` is just an abstraction
layer on top of
`django-allauth`. Underneath it is `django-allauth` that handles social acoount login using Google OAuth2.

Next we configure `allauth.socialaccount.providers.google` to save `refresh_token` and `access_token` from Google

#### Save `refresh_token` and `access_token` in database

We need to save `refresh_token` and `access_token` for every user in the database. We will use the `access_token` to get
access to the user profile data, calendars and events. We use the refresh token to refresh the `access_tokem` whenever
it expires.
By default, the `access_token` is set to expire after 1 hour.

The refreshing of access tokens is
handled by [google-oauth](https://google-auth.readthedocs.io/en/master/index.html) library
class [Credentials](https://google-auth.readthedocs.io/en/master/reference/google.oauth2.credentials.html).

```
SOCIALACCOUNT_STORE_TOKENS = True
```

#### Set the `SITE_ID`

`SITE_ID` is required by `django.contrib.sites` application to identify current project site. Django Allauth
depends on the `django.contrib.sites` application. For example when sending user verification emails it retrieves the
site name and domain using the `SITE_ID` setting.

```
SITE_ID = 1
```

#### Update Authentication Backends

We also update django `AUTHENTICATION_BACKENDS` setting in `settings.py` module.

```python
AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend"
)
```

This gives django two methods of
logging in users.
`django.contrib.auth.backends.ModelBackend` allows users using password and username, For example when an admin wants to
login to the admin interface http://localhost:8000/admin.
`allauth.account.auth_backends.AuthenticationBackend` allows users to login using username and password and social
accounts.
This is important our users will be logging in user google.

#### Add middleware

We are going to add `allauth.account.middleware.AccountMiddleware` to our `MIDDLEWARE` setting in our module.
It is placed as the last middleware. It checks if there are no dangling logins when serving html pages. In our case
it is not necessary, but it required by django allauth. Django allauth will throw an error if it's not included.

```python
MIDDLEWARE = [
    ...,
    'allauth.account.middleware.AccountMiddleware',
]
```

#### Run database migrations

There are two types of database migrations. We have schema migrations which update the structure of the database.
We also have data migrations which change the data in the database or move it to a different database.

Here we will run a schema migration to create database tables used by django and the applications we added
to `INSTALLED_APPS` in `settings.py` module.

We run the migrations using the following command

```
cd backend 
python manage.py migrate 
```

We have created database tables in our database. We can verify this back

#### Create admin user

No we are going to create an admin user. We will login on http://localhost:8000/admin with this user to create a social
application.
Inside `./backend` folder run the command

```
python manage.py createsuperuser
```

Enter your user details as illustrated in the image below
![img.png](tutorial/images/createsuperuser.png)

We have created our database tables and created a superuser. Now we are ready to configure Google social application.

#### Configure Google Social Application

We need to configure our social application in the database. We start by running our django server.

```
python manage.py runserver 
```

First we need to set up Google Consent Screen and create Google OAuth2 credentials for a web application.

Follow the steps below to set up Google Consent Screen and create Google OAuth2 credentials

1. If you don't have one, set up a Google Cloud project using
   this [guide](https://developers.google.com/workspace/guides/create-project).
2. Setup google consent screen using
   this [guide](https://developers.google.com/workspace/marketplace/configure-oauth-consent-screen).
3. Create oauth credentials for a web application using
   this [guide](https://developers.google.com/workspace/guides/create-credentials#web-application).
   Don't forget to download the credentials `*.json` after you have completed creating your credentials. Keep the
   credentials secure, exposing them can lead to an attacker gaining access to users data.

After completing the above steps take the following steps to create a social application in django administration site.

1. Add a new Social application on the page
   http://localhost:8000/admin/socialaccount/socialapp/add/

2. For **Provider** select 'Google'.
3. For **Name** type 'Google'.
4. For **Client ID** copy `cliend_id` from `*.json` file and paste it into the input field.
5. For **Secret Key** copy the `client_secret` from `*.json` file and paste it into the input field.
6. Move `example.com` from **Available Sites** to **Chosen Sites**
7. Save

### Add Google Login Endpoint

In this section we are going to create a django application `calendar_app` and add it to installed applications.
We are going to add a Google login endpoint. The endpoint receives a `code` from the frontend application and
exhanges it for `refresh_token` and `access_token`. The `access_token` is used to access user data, apis.

We will use it to access the calendar api to Create, Read, Update and Delete (CRUD) events.

The `access_token` expires
after 1 hour. If an `access_token` expires the `refresh_token` is used to retrieve a new `access_token`. Refreshing
of access tokens is
handled by [google-oauth](https://google-auth.readthedocs.io/en/master/index.html) library
class [Credentials](https://google-auth.readthedocs.io/en/master/reference/google.oauth2.credentials.html).

We start by creating a `calendar_app` application.
In the `./backend` folder run the command

```
python manage.py startapp calendar
```

Next we add it to `INSTALLED_APPS` in our `settings.py` module.

```python

INSTALLED_APPS = [
    ...,
    'calendar_app',
]

```

Let's examine our folder structure again. Now we have a new directory `calendar_app` with the following files and
directories.

```
.
├── backend
│   ├── backend
│   │   ├── asgi.py
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── calendar_app
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── __init__.py
│   │   ├── migrations
│   │   │   └── __init__.py
│   │   ├── models.py
│   │   ├── tests.py
│   │   └── views.py
│   ├── db.sqlite3
│   └── manage.py
└── requirements.txt
```

1. `admin.py` is where we register our models to django admin. Django admin will create user Create, Read, Update and
   Delete CRUD user interface for a registered model
2. `apps.py` defines and configures the `calendar_app` application
3. `migrations` directory contains migrations are stored here
4. `models.py` is where Object Relation Mapping models are defined (ORM). Learn more about
   ORM [here](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping)
5. `tests.py` is where we write our test code.
6. `views.py` is where we define endpoints that serve mostly `text/html`, `text/plain` and `application/json` content
   types.

In this tutorial we will focus on `views.py`. This is where we define our `GoogleLogin` view.

#### Create `GoogleLogin` view

In the file in `./backend/calendar_app/views.py` add the following code

```python
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.conf import settings
from dj_rest_auth.registration.views import SocialLoginView


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:5173"
    client_class = OAuth2Client
```

In `./backend/calendar_app/` folder create a new file `urls.py` and add the following code

```python
from django.urls import path
from .views import (
    GoogleLogin
)

urlpatterns = [
    path('login/', GoogleLogin.as_view(), name='login')
]
```

In the `./backend/backend/urls.py` replace the code with the following code

```python
from django.contrib import admin
from django.urls import path, include, re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('calendar_app.urls')),
    re_path(r'^accounts/', include('allauth.urls')),
]
```

I have included the `allauth.urls` because `django-allauth` requires them to be present for it to work.
Without including it the `GoogleLogin` view will throw a missing url error.

### Add Events CRUD endpoints

In this section we will add list, create, update and delete event endpoints.
Let's start by installing the required dependencies to work with google api

```
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

`google-auth` simplifies using Google's various server to server authentication mechanisms to access
Google APIs. `google-auth-oauthlib` provides [oauthlib](https://github.com/oauthlib/oauthlib) integration with
`google-oauth`. `google-auth-httplib2` provides HTTP/2 protocol features. `google-api-python-client` is a client library
that we are going to use to access [Google Calendar API](https://developers.google.com/calendar/api/v3/reference)

Before we add our endpoints we need to configure `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_AOUTH_CLIENT_SECRET` environment
variables.
We will use to refresh users' access tokesns.

#### Configure environment variables

We are going to install a package `python-dotenv` that helps use to load environment variables from
`.env` file. First we need to create a .env file in `./backend` directory.

In `./backend` directory create a new `.env` file and paste in the following files

```dotenv
GOOGLE_OAUTH_CLIENT_ID=<client_id>
GOOGLE_AOUTH_CLIENT_SECRET=<client_secret>
```

Update `GOOGLE_OAUTH_CLIENT_ID` with `client_id` and  `GOOGLE_AOUTH_CLIENT_SECRET` with `client_secret`
from the `*.json` file you downloaded from google cloud.

Next we load environment variables by adding the following code to `manage.py`.

```python
import os
import sys

...

from dotenv import load_dotenv


def main():
    load_dotenv()


...
...
```

The function `load_env()` will read environment variables from .env file we created in backend folder

Next we add the following code to our `settings.py` module to read environment variables from the system

```python
...
import os

...

GOOGLE_OAUTH_CLIENT_ID = os.environ.get('GOOGLE_OAUTH_CLIENT_ID')
GOOGLE_AOUTH_CLIENT_SECRET = os.environ.get('GOOGLE_AOUTH_CLIENT_SECRET')
```

#### Define API exceptions

When an error happens on our API we need to return a response with an appropriate status code.
TO achieve this we create subclasses of `rest_framework.exceptions.APIException` class and define
status codes and default messages

Create a new module `exceptions.py` in the folder `./backend/calendar_app`  and the code

```python
from rest_framework.exceptions import APIException
from rest_framework import status


class BadRequest(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Bad request'
    default_code = 'bad_request'


class InternalServerError(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = 'Internal Server Error'
    default_code = 'internal_server_error'

```

Next we create utility functions to retrieve each user's `refresh_token` and `access_token`

#### Creating utility functions to retrieve credentials

Create a new module `util.py` in the folder `./backend/calendar_app`  and the code

```python
from allauth.socialaccount.models import SocialAccount, SocialToken
from .exception import BadRequest
from google.oauth2.credentials import Credentials
from django.conf import settings


def get_social_account_token(user):
    try:
        social_account = SocialAccount.objects.get(user=user, provider='google')
        token = SocialToken.objects.get(account=social_account)
    except SocialAccount.DoesNotExist:
        raise BadRequest('User does not have a google social account.')
    except SocialToken.DoesNotExist:
        raise BadRequest('User does not have a google social token.')

    return token
```

In the code above we retrieve a social account for the current logged in user from the database. If the
token is not found then the user didn't sign up using google. If the token is found then we proceed to
retrieve the token from the database. If the token is not found we return 400 Bad request response.

In the same module paste the following code below `get_social_account_token`

```python
def get_credentials(user):
    token = get_social_account_token(user)
    return Credentials(
        token=token.token,
        refresh_token=token.token_secret,
        token_uri='https://accounts.google.com/o/oauth2/token',
        client_id=settings.GOOGLE_OAUTH_CLIENT_ID,
        client_secret=settings.GOOGLE_AOUTH_CLIENT_SECRET,
    )
```

In the code above `get_credentials` function returns a `Credentials` instance. The credentials instance is
used to gain access to each user's calendars using the `access_token`. If the `access_token` expires, the
credentials instance uses the `refresh_token`, `client_id` and `client_secret` to retrieve a new `access_token`
from the endpoint `token_uri`.

We defined our exceptions and utils. We proceed to add API endpoints to list, create, update and delete events

#### Endpoint to list events

We are going to define a django view that list endpoints from
Google calendar api using Google Python Client Library.

In the `views.py` module in the folder `./backend/calendar_app` add the following code

```python
from dj_rest_auth.registration.views import SocialLoginView

...

from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import decorators, status
from .util import get_credentials
from .exception import InternalServerError
from urllib.parse import unquote
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

...


# After GoogleLogin view
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
```

In the code above we define a Django Restframework API view by adding a decoractor `@decorators.api_view(['GET'])`
which allows it to only accept `GET` requests.

In the view we have created a service that makes http requests to `calendar/v3` endpoint. It uses the access token used
in our credentials instance.

```python
...
service = build('calendar', 'v3', credentials=get_credentials(request.user))
```

The remainder of the code fetches a list of calendar events from google. It filters the calendar where the user is the
owner. It iterates through the calendars
fetching events under that calendar and adding them to a flat list of events.

If an error happens it returns 500 internal server error. In the `finally` clause we close our service.

### Endpoint to create an event

Add the following code after `list_calendar_events`

```python
@decorators.api_view(['POST'])
def create_event(request: Request, calendar_id: str | None = None) -> Response:
    service = build('calendar', 'v3', credentials=get_credentials(request.user))
    calendarId = unquote(calendar_id)
    try:
        service.events()
        .insert(calendarId=calendarId, body=request.data)
        .execute()

except HttpError as error:
raise InternalServerError(str(error))
finally:
service.close()

return Response({
    'detail': 'Event created',
}, status=status.HTTP_201_CREATED)
```

The endpoint for creating events accepts only `POST` requests. It takes in a parameter
`calendar_id`. We use `calendar_id` to select a calendar the new event belongs to.
We are also using `unqoute` function to retrieve characters like '#' which are quoted on frontend.

For successful event creation it returns status code 201 which means the event was created.

#### Endpoint to update an event

Add the following code after `create_event`

```python
@decorators.api_view(['PUT'])
def edit_event(
        request: Request,
        calendar_id: str | None = None,
        event_id: str | None = None
) -> Response:
    service = build('calendar', 'v3', credentials=get_credentials(request.user))
    calendarId = unquote(calendar_id)

    try:
        service.events()
        .update(calendarId=calendarId,
                eventId=event_id,
                body=request.data)
        .execute()

except HttpError as error:
raise InternalServerError(str(error))
finally:
service.close()

return Response({
    'detail': 'Event edited',
})
```

The endpoint for updating events accepts only `PUT` requests. It takes parameters
`calendar_id` and `event_id`. We use `calendar_id` to select the calendar which the event belongs to.
We use `event_id` to select the event we are updating.

It returns a status code of 200 for a successful update. It returns status code 500 if an error occurs.

#### Endpoint to delete an endpoint

Add the following the code after `edit_event`

```python
@decorators.api_view(['DELETE'])
def delete_event(
        request: Request,
        calendar_id: str | None = None,
        event_id: str | None = None
) -> Response:
    service = build('calendar', 'v3', credentials=get_credentials(request.user))
    calendarId = unquote(calendar_id)

    try:
        service.events()
        .delete(calendarId=calendarId, eventId=event_id)
        .execute()

except HttpError as error:
raise InternalServerError(str(error))
finally:
service.close()

return Response({
    'detail': 'Event deleted',
})
```

The endpoint for deleting events accepts only `DELETE` requests. It takes parameters
`calendar_id` and `event_id`. We use `calendar_id` to select the calendar which the event belongs to.
We use `event_id` to select the event we are deleting.

It returns a status code of 200 for a successful update. It returns status code 500 if an error occurs.

#### Update the calendar_app.urls module

We have created our endpoints to list, create, update and delete event. We proceed to add urls for each.

Replace the code in module `urls.py` in folder `backend/calendar_app` with the following

```python
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
```

The syntax `<str:calendar_id>` defines the parameter `calendar_id` which is a string. The same is true
for `<str:event_id>`.

The endpoints parameters in `views.py` should match the names defined here.

We have completed the first part of the tutorial. Here we learned about django, django rest frameworks,
Cross-Origin Resource Sharing, Google OAuth2 authentication, Python Google Client Library and Google Calendar API.

In the next section we are going to build a frontend application using React.

##    

Frontend Application

In this section we are going to build a frontend application
using [React](http://react.dev), [Bryntum Calandar](https://bryntum.com/products/calendar/docs/),
[Axios](https://axios-http.com/docs/intro), [React OAuth2 | Google](https://www.npmjs.com/package/@react-oauth/google)
and [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction).

We use Axios to make ajax requests to our backend api. We use Zustand for state management. It provides a simole way
to manage state in a similar way we use [`useState`](https://react.dev/reference/react/useState).

To build our application we are going to complete the following activities

1. Setup React project
2. Install dependencies
3. Setup Environment variables
4. Add login functionality
5. List events
6. Create events
7. Update events

### Setup React project

There are many ways to set up a React application.
For this project we will use [Vite](https://vite.dev/) with [Typescript](https://www.typescriptlang.org/). In
the root folder of your project run the following command

```
npm create vite@latest frontend -- --template react-ts
```

Once the project is created, install the node modules

```
cd frontend
npm install && npm install sass --save-dev
```

We have set up our project successfully.
Now we are going to install Bryntum Calendar, Axios,React OAuth2 | Google and Zustand.

### Install dependencies

#### Install Bryntum Calendar dependencies

We will start by installing Bryntum Calendar dependencies.

Before you install Bryntum Calendar dependencies you need to configure npm by following
this [guide](https://bryntum.com/products/calendar/docs/guide/Calendar/npm-repository)

Now you can install the package using the following command

```
npm install @bryntum/calendar@npm:@bryntum/calendar-trial @bryntum/calendar-react
```

#### Install Axios, React OAuth2 | Google and Zustand dependencies

```
npm install axios @react-oauth/google zustand
```

We have installed all the required dependencies. Next we setup our environment variables

In your `frontend` application directory create a new `.env` file and paste the following

```dotenv
VITE_GOOGLE_OAUTH_CLIENT_ID=<client_id>
VITE_API_BASE_URL=http://localhost:8000
```

Copy `client_id` from `*.json` credentials file you downloaded from Google Cloud console and update
`VITE_GOOGLE_OAUTH_CLIENT_ID`.
We will use `VITE_GOOGLE_OAUTH_CLIENT_ID` to configure `GoogleOAuthProvider` context from `@react-oauth/google`
package.

We will use `VITE_API_BASE_URL` to configure a `baseUrl` used my axios when making requests

### Add login functionality

We are going to create a Zustand store to keep of our authentication state

Create a new directory `store` inside `src` directory. Add a new file `auth.ts` in the `store` directory.

Add the following code in `auth.ts` file

```typescript
import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'

interface AuthState {
    token: string | null,
    signIn: (token: string | null) => void
    signOut: () => void
}
```

In the above code we import `create` function. We are going to use it to create our authentication store.
It creates a hook which we will use in our `App.tsx` file.

We also import `createJSONStorage` and `persist` functions. These enable us to save and retrieve authentication state
to [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

We have defined an interface `AuthState` which describes the structure of our state.

Next we create our store hook. Add the following code to `auth.ts`

```typescript
const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            hydrated: false,
            token: null,
            signIn: (token) => {
                set({token})
            },
            signOut: () => {
                localStorage.clear()
                set({token: null})
            }
        }),
        {
            name: 'auth',
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export default useAuthStore
```

We have created our `useAuthStore` authentication store. Next we setup `axios`.

#### Configure Axios

Create a new directory `util` inside `src` directory. Add a new file `axios.ts` in the `util` directory.

Add the following code to your `axios.ts`

```typescript
import _axios from "axios";
import useAuthStore from "../store/auth.ts";

const axios = _axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});
```

In the above code we are creating an `axios` instance with `baseUrl` set to `VITE_API_BASE_URL` environment
variable.

Next we configure axios interceptor to include add an `Authorization` header
whenever we make a request.

```typescript
axios.interceptors.request.use(function (config) {
    if (config.url?.includes("login")) {
        return config;
    }

    const {token} = useAuthStore.getState();

    if (!token) {
        throw new Error("User not authenticated");
    }

    config.headers["Authorization"] = `Token ${token}`;

    return config;
});

export default axios;
```

We are whitelisting `login` endpoint because it doesn't require auhtorization.

We have setup Axios, next we are going to implement React OAuth2 | Google login.

Replace the code in `main.tsx` under `src` directory with the following

```typescript jsx
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import App from "./App.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
            <App/>
        </GoogleOAuthProvider>
    </StrictMode>,
);
```

The code above adds `GoogleOAuthProvider` [context](https://react.dev/reference/react/createContext) that
uses `clientId`
we defined in our environment variables.

Rename the file `index.css` to `index.scss` and paste in

We have successfully added our google oauth provider context.

To retrieve an authorisation code from google we need to replace the code in `App.tsx` with the following code

```typescript jsx
import {useGoogleLogin} from "@react-oauth/google";
import {useState} from "react";
import axios from "./util/axios.ts";
import useAuthStore from "./store/auth.ts";
import {AxiosResponse} from "axios";

function App() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const {signIn, signOut, token} = useAuthStore();

    const handleSignIn = useGoogleLogin({
        onSuccess: async (response) => {
            const {code} = response;
            try {
                setIsLoading(true);
                const response = await axios.post<
                    { key: string },
                    AxiosResponse,
                    {
                        code: string;
                    }
                >("/login/", {
                    code: code,
                });

                const {
                    data: {key},
                } = response;
                signIn(key);
            } catch {
                setError("Authentication failure");
            } finally {
                setIsLoading(false);
            }
        },
        flow: "auth-code",
        scope:
            "https://www.googleapis.com/auth/calendar.events.readonly " +
            "https://www.googleapis.com/auth/calendar.readonly " +
            "https://www.googleapis.com/auth/calendar.events.owned",
    });

    function handleSignOut() {
        signOut()
    }

    return (
        <div>
            {isLoading && (
                <div id="overlay">
                    <h1>Loading...</h1>
                </div>
            )}
            <div className={"container"}>
                <div className={"auth-ui-container"}>
                    <>
                        {token ? (
                            <button className={"sign-out-btn"} onClick={handleSignOut}>
                                Sign out of my account
                            </button>
                        ) : (
                            <button
                                className={"login-btn"}
                                disabled={isLoading}
                                onClick={handleSignIn}
                            >
                                Sign in with google
                            </button>
                        )}
                    </>
                    <>{error && <p className={"error"}>{error}</p>}</>
                </div>
            </div>
        </div>
    )
}

export default App;
```

In the code above we call `useGoogleLogin` function that returns
a function. We are going to use to open google login page.

Run the application with the command

```
npm run dev 
```

Open a new terminal, activate your virtual environment and run the backend with the command

```
cd backend && python manage.py runserver 
```

Open url on http://localhost:5173. Click on the **Sign in with google** button.

After signing in the button will change to **Sign out of my account**.

We have successfully added login and logout functionality. In the next tutorial we are going to add styles for our
user interface.

### Styling Our User Interface

In the `src` directory rename `App.css to App.scss` and add the the following styles

```scss
@import "@bryntum/calendar/calendar.material.css";


body,
#root {
  margin: 0;
  font-family: Lato, "Open Sans", Helvetica, Arial, sans-serif;
  font-size: 14px;
  width: 100vw;
}

.container {
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 5fr;

  .auth-ui-container {
    padding: 16px;
    border-right: 1px solid #ddd;

    .login-btn {
      padding: 8px 24px 8px 50px;
      line-height: 24px;
      background: url(https://cdn.cdnlogo.com/logos/g/35/google-icon.svg) no-repeat;
      background-size: 18px 18px;
      background-position: 11px 11px;
      background-color: #fff;
      color: #757575;
      font-family: Roboto, arial, sans-serif;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border-radius: 2px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .25);
      transition: background-color .218s, border-color .218s, box-shadow .218s;
      border-color: transparent;
      width: 100%;
    }

    .sign-out-btn {
      padding: 8px 24px 8px 50px;
      line-height: 24px;
      background-color: #2196f3;
      color: #fff;
      font-family: Roboto, arial, sans-serif;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border-radius: 2px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .25);
      transition: background-color .218s, border-color .218s, box-shadow .218s;
      border-color: transparent;
      width: 100%;
    }

    .error {
      color: red;
      text-align: center;
      border: 1px solid red;
      font-weight: bolder;
      padding: 8px;
    }
  }
}

#overlay {
  position: fixed; /* Sit on top of the page content */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  height: 100vh; /* Full width (cover the whole page) */
  width: 100vw; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Black background with opacity */
  z-index: 9999; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}
```

In `App.tsx` add the following import

```typescript
import "./App.scss";
```

Open url on http://localhost:5173, the buttons look good now.

You will also notice that we imported a stylesheet at the top

```scss
@import "@bryntum/calendar/calendar.material.css";
```

It styles the `BryntumCalendar` component that we are going to use in the next section

### List Events

To list events we need to make an ajax request to our API using axios. The endpoint requires user
to be logged in.

We will start by adding the following import in our App.tsx file

```typescript
import {BryntumCalendar} from "@bryntum/calendar-react";
```

Next we add the following code just after the imports

```typescript
interface GoogleEvent {
    id: string;
    summary: string;
    start: {
        dateTime: string;
        timeZone: string;
    };
    end: {
        dateTime: string;
        timeZone: string;
    };
    calendarId: string;
}

interface BryntumEvent {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    resourceId: string;
}

interface BryntumResource {
    id: string;
    name: string;
    eventColor: string;
}

interface GoogleCalendar {
    id: string;
    summary: string;
    backgroundColor: string;
}
```

Here we are defining our data types. Vite does strict type checking when building. Without defining data types our build
will
fail. We can also use `any` type and turn off eslint [rules](https://eslint.org/docs/latest/rules/). Turning off eslint
rules works, but it defeats the point of using Typescript.

Next we will add the following code after `handleSignout` function

```typescript
const [events, setEvents] = useState<Array<BryntumEvent>>([]);
const [resources, setResources] = useState<Array<BryntumResource>>([]);
    
useEffect(() => {
    if (token) {
        (async () => {
            try {
                setIsLoading(true);
                const response: AxiosResponse<{
                    events: Array<GoogleEvent>;
                    calendars: Array<GoogleCalendar>;
                }> = await axios.get("/events/");

                const {
                    data: {events: fetchedEvents, calendars: fetchedCalendars},
                } = response;

                setEvents(
                    fetchedEvents.map((event) => ({
                        id: event.id,
                        name: event.summary,
                        startDate: event.start.dateTime,
                        endDate: event.end.dateTime,
                        resourceId: event.calendarId,
                    })),
                );

                setResources(
                    fetchedCalendars.map((calendar) => ({
                        id: calendar.id,
                        name: calendar.summary,
                        eventColor: calendar.backgroundColor,
                    })),
                );
            } catch {
                setError("Failed to fetch events");
            } finally {
                setIsLoading(false);
            }
        })();
    }
}, [token]);
```

In the above code whenever the `token` changes the code inside `useEffect`'s callback function runs if the token is
not `null`.
The code makes a request to `/events/` endpoint. It retrieves a list of `events` and `calendars` and updates state
variables
`events` and `resources` respectively.

Next we replace our `jsx` in `App.tsx` with the following

```jsx
<div>
    {isLoading && (
        <div id="overlay">
            <h1>Loading...</h1>
        </div>
    )}
    <div className={"container"}>
        <div className={"auth-ui-container"}>
            <>
                {token ? (
                    <button className={"sign-out-btn"} onClick={handleSignOut}>
                        Sign out of my account
                    </button>
                ) : (
                    <button
                        className={"login-btn"}
                        disabled={isLoading}
                        onClick={handleSignIn}
                    >
                        Sign in with google
                    </button>
                )}
            </>
            <>{error && <p className={"error"}>{error}</p>}</>
        </div>
        <BryntumCalendar
            date={new Date()}
            events={events}
            resources={resources}
            draggable
        />
    </div>
</div>
```

In this section we added logic to fetch events and calendars from `/events/` and updates `events` and `resources`.
`events` and `resources` are passed in as props to `BryntumCalendar` component. 

In the next section we are going to add functionality to create events. 

### Create Events 

To create events using `BryntumCalendar` component we have to define an event handler for `onAfterEventSave` event.

Before we define the event handler we need to add a  utility function to helps  with creating events.

Add the following code between `useEffect` hook fetching events and the `return (` statement for jsx.
```typescript
const createEvent = async (calendarId: string, payload: object) => {
    try {
      setIsLoading(true);
      const url = `/events/${encodeURIComponent(calendarId)}/create/`;
      await axios.post(url, payload);
    } catch {
      setError("Failed to add event");
    } finally {
      setIsLoading(false);
    }
  };
```
In the code above we are making a `POST` request to `/events/<str:calendar_id>/create/` endpoint we create in the API.
We enoode the `calendaId` because some calendars can have an id like `foo#bar`. If we don't encode, it will break 
Django's URL scheme. 

We have defined our utility functionality. Next we define our event handler 
```typescript
const onAfterEventSave = (event: any) => {
    const { eventRecord, type } = event;
    const { data, originalData } = eventRecord;
    const payload = {
      summary: data.name,
      location: " ",
      start: {
        dateTime: data.startDate,
        timeZone: "Africa/Johannesburg",
      },
      end: {
        dateTime: data.endDate,
        timeZone: "Africa/Johannesburg",
      },
    };

    switch (type) {
      case "aftereventsave":
        if (data.id.includes("_generated")) {
          createEvent(data.resourceId, payload);
        } else {
            //... Code to update events goes here
        }
        break;
      default:
        break;
    }
  };
```

We have added our event handler. On the `BryntumCalendar` component we add a prop `onAfterEventSave`
```typescript jsx
<BryntumCalendar
    onAfterEventSave={onAfterEventSave}
    date={new Date()}
    events={events}
    resources={resources}
    draggable
/>
```

##### Test if the event is creating 
1. Open the link http://localhost:5173
2. Right click anywhere on the calendar grid
3. Click create 
4. Save the event

You will the event has been added on the UI, but we need to verify that it has synced. 

5. Reload the page 
6. If the event still shows then it has synced to google. 

You can double check on your Google Calendar. 

We have successfully added code to sync events. Next we add code to update events 


### Edit calendar events 

To edit calendar events we add the following utility code to our `App.tsx`

```typescript
// createEvent code 
// ...
 const editEvent = async (
    calendarId: string,
    eventId: string,
    payload: object,
  ) => {
    try {
      setIsLoading(true);
      await axios.put(
        `/events/${encodeURIComponent(calendarId)}/${eventId}/edit/`,
        payload,
      );
    } catch {
      setError("Failed to edit event");
    } finally {
      setIsLoading(false);
    }
  };
// ....
// onAfterEventSave
```
The code above edits all event properties except the calendar 

To edit the calendar we need to delete the existing event and create it on a newly selected calendar. 
To achieve this we will need to add the following code after `editEvent`

```typescript
const changeEventCalendar = async (
    oldCalendarId: string,
    newCalendarId: string,
    eventId: string,
    payload: object,
  ) => {
    try {
      setIsLoading(true);

      // Caveat: this would cause data inconsistencies. A better approach would be to use
      // some sort of transaction on the backend

      // First delete
      await axios.delete(
        `/events/${encodeURIComponent(oldCalendarId)}/${eventId}/delete/`,
      );

      // Then add on new calendar

      await axios.post(
        `/events/${encodeURIComponent(newCalendarId)}/create/`,
        payload,
      );
    } catch {
      setError("Failed to edit event");
    } finally {
      setIsLoading(false);
    }
  };
```

Now we add these utility functions to our `onAfterEventSave` handler. 
Replace the comment 
```typescript
//... Code to update events goes here
```
with 
```typescript
          if (originalData.resourceId === data.resourceId) {
            editEvent(data.resourceId, data.id, payload);
          } else {
            changeEventCalendar(
              originalData.resourceId,
              data.resourceId,
              data.id,
              payload,
            );
          }
```

## Conclusion
We have managed to setup our API using Django Restframework. We secured our API using DJ Rest Auth, Django Allauth, Google OAuth. We used Python Google API Client
to list, create, update and delete events on Calendar API. 

We created a frontend application using React, Bryntum Calendar, Zustand, Axios and React OAuth2 | Google. Our application allows users to 

1. Login using their google account
2. List calendars
3. List events
4. Create events
5. Update events









