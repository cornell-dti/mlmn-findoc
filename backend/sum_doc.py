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

load_dotenv(find_dotenv(), override=True)


QUERY_INSTRUCTIONS = "Enter any query document to summarize:"

SUMMARIZE_HUMAN_PROMPT = (
    "Summarize this fictional story briefly. Use complete sentences.:\n\n{text}"
)
SUMMARIZE_SYSTEM_PROMPT = "You are an AI designed to provide concise summaries. Focus on extracting key findings, implications, and any significant conclusions from the provided text, suitable for a general audience."
SUMMARIZE_SYSTEM_PROMPT_SYLLABUS = "You are an AI designed to provide concise summaries of course syllabi for student use. Focus on extracting key findings, implications, and any significant conclusions from the provided text, suitable for a general audience."


FOLLOW_UP_PROMPT = (
    "This was your previous answer: {prev_ans}. Follow up question: {question}"
)

chat = ChatOpenAI(
    temperature=0,
    model="gpt-3.5-turbo-0125",
    openai_api_key=os.getenv("OPENAI_API_KEY"),
)


def sum_doc(doc: str):
    system_message = SystemMessagePromptTemplate.from_template(SUMMARIZE_SYSTEM_PROMPT)
    human_message = HumanMessagePromptTemplate.from_template(SUMMARIZE_HUMAN_PROMPT.format(text=doc))
    chat_prompt = ChatPromptTemplate.from_messages([human_message, system_message])
    final_output = chat_prompt.format_prompt().to_messages()
    print(final_output)
    return(final_output)



if __name__ == "__main__":
    st.title("Document Summarizer")
    doc = st.text_area(QUERY_INSTRUCTIONS, height=100)
    button1 = st.button("Submit", key=0)
    if st.session_state.get("button") != True:
        st.session_state["button"] = button1
    if st.session_state["button"] == True:
        st.write("Summarizing...")
        st.session_state["button"] = False

        ans = st.write(sum_doc(doc=doc))

        unique_val = 1
        follow_up_question = st.text_input("Enter a follow-up question")
        new_ans = ans
