# use streamlit run sum_doc.py to run
import os
import streamlit as st
from langchain.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv, find_dotenv
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Callable, Dict, Any


load_dotenv(find_dotenv(), override=True)


QUERY_INSTRUCTIONS = "Enter any query document to summarize:"

SUMMARIZE_HUMAN_PROMPT = (
    "Summarize this fictional story briefly. Use complete sentences.:\n\n{text}"
)
SUMMARIZE_SYSTEM_PROMPT = "You are an AI designed to provide concise summaries. Focus on extracting key findings, implications, and any significant conclusions from the provided text, suitable for a general audience."
SUMMARIZE_SYSTEM_PROMPT_SYLLABUS = "You are an AI designed to provide concise summaries of course syllabi for student use. Focus on the information that the user asks you to provide."
SUMMARIZE_HUMAN_PROMPT_SYLLABUS = (
    "Summarize this course syllabus briefly. Use complete sentences.:\n\n{text}"
)
RELEVANT_DATES_HUMAN_PROMPT = "Provide all the relevant dates mentioned in the document, including exam dates, assignment dates, and any other important deadlines. Provide the exact dates. If the syllabus mentions the frequency of exams or assignments, provide the specific dates for the all the exams and assignments. Given that the semester starts on January 24, 2024, and ends on May 18th, 2024 provide the dates for all the exams and assignments.:\n\n{text}"

FOLLOW_UP_PROMPT = (
    "This was your previous answer: {prev_ans}. Follow up question: {question}"
)

chat = ChatOpenAI(
    temperature=0,
    model="gpt-3.5-turbo-0125",
    openai_api_key=os.getenv("OPENAI_API_KEY"),
)


def sum_doc(doc: str):
    system_message = SystemMessagePromptTemplate.from_template(
        SUMMARIZE_SYSTEM_PROMPT_SYLLABUS
    )
    human_message = HumanMessagePromptTemplate.from_template(
        SUMMARIZE_HUMAN_PROMPT.format(text=doc)
    )
    chat_prompt = ChatPromptTemplate.from_messages([human_message, system_message])
    final_output = chat.invoke(chat_prompt.format_prompt().to_messages())
    return final_output.content


def get_dates(doc: str):
    system_message = SystemMessagePromptTemplate.from_template(
        SUMMARIZE_SYSTEM_PROMPT_SYLLABUS
    )
    human_message = HumanMessagePromptTemplate.from_template(
        RELEVANT_DATES_HUMAN_PROMPT.format(text=doc)
    )
    chat_prompt = ChatPromptTemplate.from_messages([human_message, system_message])
    final_output = chat.invoke(chat_prompt.format_prompt().to_messages())
    return final_output.content


def main(doc: str) -> Dict[str, Any]:
    response = {}
    tasks = [sum_doc, get_dates]

    with ThreadPoolExecutor(max_workers=len(tasks)) as executor:
        future_to_func = {executor.submit(task, doc): task.__name__ for task in tasks}

        for future in as_completed(future_to_func):
            func_name = future_to_func[future]
            try:
                result = future.result()
            except Exception as exc:
                print(f"{func_name} generated an exception: {exc}")
            else:
                response[func_name] = result

    return response


def streamlit():
    st.title("Document Summarizer")
    doc = st.text_area(QUERY_INSTRUCTIONS, height=100)
    button1 = st.button("Submit", key=0)
    if st.session_state.get("button") != True:
        st.session_state["button"] = button1
    if st.session_state["button"] == True:
        st.write("Summarizing...")
        st.session_state["button"] = False
        st.write(sum_doc(doc=doc))


if __name__ == "__main__":
    streamlit()
