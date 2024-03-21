from flask import Flask, request, jsonify
import os
from langchain.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv, find_dotenv

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


def sum_doc(doc: str):
    chat = ChatOpenAI(
        temperature=0,
        model="gpt-3.5-turbo-0125",
        openai_api_key=os.getenv("OPENAI_API_KEY"),
    )
    print(os.getenv("OPENAI_API_KEY"))
    human_message = HumanMessagePromptTemplate.from_template(HUMAN_PROMPT)
    system_message = SystemMessagePromptTemplate.from_template(SYSTEM_PROMPT)
    chat_prompt = ChatPromptTemplate.from_messages([system_message, human_message])
    return chat(chat_prompt.format_prompt(text=doc).to_messages())


def get_resp(sys_prompt: str, hmn_prompt: str):
    chat = ChatOpenAI(
        temperature=0,
        model="gpt-3.5-turbo-0125",
        openai_api_key=os.getenv("OPENAI_API_KEY"),
    )
    print(os.getenv("OPENAI_API_KEY"))
    human_message = HumanMessagePromptTemplate.from_template(hmn_prompt)
    system_message = SystemMessagePromptTemplate.from_template(sys_prompt)
    chat_prompt = ChatPromptTemplate.from_messages([system_message, human_message])
    return chat, chat_prompt


@server.route("/")
def testing():
    return "hi"


@server.route("/summarize", methods=["GET", "POST"])
def summarize():
    content = request.args.get("message")
    return sum_doc(content).content
