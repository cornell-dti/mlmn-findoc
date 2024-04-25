from __future__ import print_function

import datetime
from typing import Optional, Sequence, TypedDict
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


class CredentialsPayload(TypedDict):
    token: str
    refresh_token: Optional[str]
    token_uri: str
    client_id: str
    client_secret: str
    scopes: str


class CalendarClient:
    API_SERVICE = "calendar"
    API_VERSION = "v3"

    def __init__(self, client_id: str, client_secret: str, scopes: Sequence[str]):
        self._client_id = client_id
        self._client_secret = client_secret
        self._scopes = scopes
        self._client_config = {
            "web": {
                "client_id": client_id,
                "client_secret": client_secret,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        }

    def get_auth_url(self, callback_url: str) -> str:
        flow = self._get_flow(callback_url)
        auth_url, _ = flow.authorization_url(
            access_type="offline", approval_prompt="force"
        )
        return auth_url

    def get_credentials(self, code: str, callback_url: str) -> Credentials:
        flow = self._get_flow(callback_url)
        flow.fetch_token(code=code)
        return flow.credentials

    def refresh_credentials(
        self, credentials_payload: CredentialsPayload
    ) -> Credentials:
        credentials = Credentials.from_authorized_user_info(credentials_payload)
        if not credentials.valid:
            if credentials and credentials.expired and credentials.refresh_token:
                credentials.refresh(Request())
        return credentials

    def get_upcoming_events(
        self,
        credentials_payload: CredentialsPayload,
        from_credentials: Optional[Credentials] = None,
        n: int = 10,
    ):
        try:
            credentials = from_credentials or self.refresh_credentials(
                credentials_payload
            )
            service = self._build_service(credentials)
            now = datetime.datetime.utcnow().isoformat() + "Z"  # 'Z' indicates UTC time
            events_result = (
                service.events()
                .list(
                    calendarId="primary",
                    timeMin=now,
                    maxResults=n,
                    singleEvents=True,
                    orderBy="startTime",
                )
                .execute()
            )
            events = events_result.get("items", [])
            if not events:
                print("No upcoming events found.")
                return []
            return events

        except HttpError as error:
            print("An error occurred: %s" % error)
            return []

    def upload_events(self, credentials_payload: CredentialsPayload, events: list):
        try:
            credentials = self.refresh_credentials(credentials_payload)
            service = self._build_service(credentials)
            for event in events:
                service.events().insert(
                    calendarId="primary",
                    body=event,
                    sendUpdates="all",
                    sendNotifications=True,
                ).execute()
            return "Events added to Google Calendar"

        except HttpError as error:
            print("An error occurred: %s" % error)
            return "An error occurred"

    def _get_flow(self, callback_url: str) -> Flow:
        return Flow.from_client_config(
            self._client_config, self._scopes, redirect_uri=callback_url
        )

    def _build_service(self, credentials: Credentials):
        return build(self.API_SERVICE, self.API_VERSION, credentials=credentials)
