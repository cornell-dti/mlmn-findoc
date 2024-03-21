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
    human_message = HumanMessagePromptTemplate.from_template(SUMMARIZE_HUMAN_PROMPT)
    system_message = SystemMessagePromptTemplate.from_template(SUMMARIZE_SYSTEM_PROMPT)
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


if __name__ == "__main__":
    st.title("Document Summarizer")
    doc = st.text_area(QUERY_INSTRUCTIONS, height=100)
    button1 = st.button("Submit", key=0)
    if st.session_state.get("button") != True:
        st.session_state["button"] = button1
    if st.session_state["button"] == True:
        ans = st.write(sum_doc(doc=doc).content)

        unique_val = 1
        follow_up_question = st.text_input("Enter a follow-up question")
        new_ans = ans

        if st.button("Submit", key=1):

            unique_val += 1
            chat, chat_prompt = get_resp(SUMMARIZE_SYSTEM_PROMPT, FOLLOW_UP_PROMPT)
            print("hello")
            follow = st.write(follow_up_question)
            print(follow)
            response = chat(
                chat_prompt.format_prompt(
                    prev_ans=new_ans, question=follow_up_question
                ).to_messages()
            ).content

            new_ans = st.write(response)
