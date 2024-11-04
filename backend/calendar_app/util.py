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


def get_credentials(user):
    token = get_social_account_token(user)
    return Credentials(
        token=token.token,
        refresh_token=token.token_secret,
        token_uri='https://accounts.google.com/o/oauth2/token',
        client_id=settings.GOOGLE_OAUTH_CLIENT_ID,
        client_secret=settings.GOOGLE_AOUTH_CLIENT_SECRET,
    )
