from flask import Flask, request, jsonify, Response
import os
from langchain.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv, find_dotenv
import werkzeug
from sum_doc import sum_doc, get_resp
from compare_docs import compare_docs
from flask_cors import CORS

server = Flask(__name__)
CORS(server)
load_dotenv(find_dotenv(), override=True)


QUERY_INSTRUCTIONS = "Enter any query document to summarize:"

HUMAN_PROMPT = (
    "Summarize this fictional story briefly. Use complete sentences.:\n\n{text}"
)
SYSTEM_PROMPT = "You are an AI designed to provide concise summaries. Focus on extracting key findings, implications, and any significant conclusions from the provided text, suitable for a general audience."

FOLLOW_UP_PROMPT = (
    "This was your previous answer: {prev_ans}. Follow up question: {question}"
)


@server.route("/")
def testing():
    return "hi"


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

    def generate():
        for response in sum_doc(content):
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


if __name__ == "__main__":
    server.run(host="0.0.0.0", port=8080, debug=True)
