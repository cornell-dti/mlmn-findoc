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


QUERY_INSTRUCTIONS1 = "Enter first query document to compare two documents:"
QUERY_INSTRUCTIONS2 = "Enter second query document to compare two documents:"


COMPARE_HUMAN_PROMPT = "Compare these two texts exactly:\n\n{text1}\n\n{text2}"
COMPARE_SYSTEM_PROMPT = "You are an AI designed to compare and contrast two different documents. Focus on highlighting the exact differences and similarities between the two documents."


def compare_docs(doc1: str, doc2: str):
    chat = ChatOpenAI(
        temperature=0,
        model="gpt-3.5-turbo-0125",
        openai_api_key=os.getenv("YOUR_OPENAI_KEY"),
    )
    human_message = HumanMessagePromptTemplate.from_template(COMPARE_HUMAN_PROMPT)
    system_message = SystemMessagePromptTemplate.from_template(COMPARE_SYSTEM_PROMPT)
    chat_prompt = ChatPromptTemplate.from_messages([system_message, human_message])
    return chat(chat_prompt.format_prompt(text1=doc1, text2=doc2).to_messages())


if __name__ == "__main__":
    st.title("Document Comparison Tool")
    doc1 = st.text_area(QUERY_INSTRUCTIONS1, height=100)
    if st.checkbox("Done with first document? Click here to submit."):
        doc2 = st.text_area(QUERY_INSTRUCTIONS2, height=100)
        if st.checkbox("Done with second document? Click here to submit."):
            answer = compare_docs(doc1=doc1, doc2=doc2).content
            st.write(answer)
