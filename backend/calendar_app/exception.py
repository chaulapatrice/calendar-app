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
