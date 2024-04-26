import os
import json
from flask import (
    Flask,
    redirect,
    render_template_string,
    request,
    jsonify,
    Response,
    session,
    url_for,
)
from dotenv import load_dotenv, find_dotenv
import werkzeug
from sum_doc import main, follow_up
from compare_docs import compare_docs
from flask_cors import CORS
from gcal_integration import CalendarClient, CredentialsPayload
from typing import Optional

load_dotenv(find_dotenv(), override=True)

server = Flask(__name__)

server.secret_key = os.environ.get("SECRET_KEY")
server.config["SESSION_TYPE"] = "filesystem"

CORS(server)

os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "1"
CALLBACK_URL = os.environ.get("CALLBACK_URL")
API_CLIENT_ID = os.environ.get("API_CLIENT_ID")
API_CLIENT_SECRET = os.environ.get("API_CLIENT_SECRET")
SCOPES = ["https://www.googleapis.com/auth/calendar"]


@server.route("/")
def index():
    return jsonify("DTI GPT Server is running!"), 200


@server.route("/summarize", methods=["GET", "POST"])
def summarize():
    content = ""
    if request.method == "POST":
        if "file" not in request.files:
            return Response("No file part in the request", status=400)
        file = request.files["file"]
        if file.filename == "":
            return Response("No selected file", status=400)
        if file and werkzeug.utils.secure_filename(file.filename):
            content = file.read().decode("utf-8")
        selected_options = json.loads(request.form.get("options", "{}"))

    def generate():
        for response in main(content, selected_options):
            yield response

    return Response(generate(), mimetype="text/event-stream")


@server.route("/compare", methods=["GET", "POST"])
def compare():
    if request.method == "POST":
        if "file1" not in request.files or "file2" not in request.files:
            return Response("No file part in the request", status=400)
        file1 = request.files["file1"]
        file2 = request.files["file2"]
        if file1.filename == "" or file2.filename == "":
            return Response("No selected file", status=400)
        if (
            file1
            and werkzeug.utils.secure_filename(file1.filename)
            and file2
            and werkzeug.utils.secure_filename(file2.filename)
        ):
            content1 = file1.read().decode("utf-8")
            content2 = file2.read().decode("utf-8")

    def generate():
        for response in compare_docs(content1, content2):
            yield response

    return Response(generate(), mimetype="text/event-stream")


@server.route("/followup", methods=["POST"])
def followup():
    data = request.get_json()
    content = data.get("doc")
    query = data.get("query")
    resp = follow_up(content, query)
    return jsonify(resp)


client = CalendarClient(API_CLIENT_ID, API_CLIENT_SECRET, SCOPES)


def is_authenticated() -> Optional[CredentialsPayload]:
    if session.get("credentials"):
        return session["credentials"]


@server.route("/callback")
def callback():
    credentials = client.get_credentials(
        code=request.args.get("code"),
        callback_url=CALLBACK_URL,
    )
    session["credentials"] = {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes,
    }
    return render_template_string(
        """
        <html>
        <body>
            <script>
                window.opener.postMessage(
                    {
                        type: 'authentication',
                        data: {{ creds | tojson }}
                    }, 
                    '*'
                );
                window.close();
            </script>
        </body>
        </html>
    """,
        creds=session["credentials"],
    )


@server.route("/auth")
def auth():
    return redirect(client.get_auth_url(CALLBACK_URL))


@server.route("/export", methods=["POST"])
def export_to_gcal():
    credentials_payload = is_authenticated()
    if not credentials_payload:
        data = request.get_json()
        credentials_payload = data.get("credentials")
        if not credentials_payload:
            return jsonify("Not authenticated with Google Calendar"), 401
    data = request.get_json()
    updated_events = []
    # Find the key that contains the events list
    event_key = next(
        (key for key in data["dates"] if isinstance(data["dates"][key], list)), None
    )

    if event_key:
        for event in data["dates"][event_key]:
            updated_event = {
                "summary": event["summary"],
                "location": event["location"],
                "description": event["description"],
                "start": {
                    "dateTime": event["start_datetime"],
                    "timeZone": "America/New_York",
                },
                "end": {
                    "dateTime": event["end_datetime"],
                    "timeZone": "America/New_York",
                },
            }
            updated_events.append(updated_event)
    else:
        print("No event list found in data['dates']")

    client.upload_events(credentials_payload, updated_events)
    return jsonify("Events added to Google Calendar")

if __name__ == "__main__":
    server.run(
        host="0.0.0.0" if os.environ.get("ENV") == "production" else "localhost",
        port=8080,
        debug=os.environ.get("ENV") != "production",
    )
