from flask import Flask, request, jsonify
import os
from langchain.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv, find_dotenv
from sum_doc import sum_doc, get_resp
from compare_docs import compare_docs

server = Flask(__name__)
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
    content = request.args.get("message")
    return sum_doc(content).content


@server.route("/compare", methods=["GET", "POST"])
def compare():
    content1 = request.args.get("message1")
    content2 = request.args.get("message2")
    return compare_docs(content1, content2).content
