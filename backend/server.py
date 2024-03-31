from datetime import datetime
import json
from flask import Flask, request, jsonify, Response
from dotenv import load_dotenv, find_dotenv
import werkzeug
from sum_doc import main
from compare_docs import compare_docs
from flask_cors import CORS
from gcal_integration import add_event_to_calendar
from datetime import datetime
from beautiful_date import Jan, Apr, BeautifulDate


server = Flask(__name__)
CORS(server)
load_dotenv(find_dotenv(), override=True)


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


@server.route("/export", methods=["POST"])
def export_to_gcal():
    data = request.get_json()
    events = data.get("events", [])
    for event in events:
        try:
            add_event_to_calendar(
                summary=event["summary"],
                start_datetime=datetime.strptime(
                    # event["start_datetime"], "%Y-%m-%dT%H:%M:%S.%f%z"
                    event["start_datetime"],
                    "%Y-%m-%dT%H:%M:%S",
                ),
                end_datetime=datetime.strptime(
                    # event["end_datetime"], "%Y-%m-%dT%H:%M:%S.%f%z"
                    event["end_datetime"],
                    "%Y-%m-%dT%H:%M:%S",
                ),
                description=event.get("description", ""),
                location=event.get("location", ""),
                email_reminder_minutes=event.get("email_reminder_minutes", None),
            )
        except Exception as e:
            print("Error in exporting to Google Calendar before: ", e)
            return (
                jsonify({"error": "Failed to add some events to Google Calendar"}),
                500,
            )

    return jsonify({"message": "Events successfully exported to Google Calendar"}), 200


if __name__ == "__main__":
    server.run(host="0.0.0.0", port=8080, debug=True)
