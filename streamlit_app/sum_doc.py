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

HUMAN_PROMPT = (
    "Summarize this fictional story briefly. Use complete sentences.:\n\n{text}"
)
SYSTEM_PROMPT = "You are an AI designed to provide concise summaries. Focus on extracting key findings, implications, and any significant conclusions from the provided text, suitable for a general audience."


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


if __name__ == "__main__":
    st.title("Document Summarizer")
    doc = st.text_area(QUERY_INSTRUCTIONS, height=100)
    if st.checkbox("Submit"):
        ans = st.write(sum_doc(doc=doc).content)
        
        unique_val  = 0 
        follow_up_question = st.text_input("Enter a follow-up question")

        while follow_up_question:
            unique_val +=1
            combined_context = f"{doc}\n\n{follow_up_question}"
            response = sum_doc(doc=combined_context).content
            st.write(response)
            follow_up_question = st.text_input("Enter a follow-up question", key = unique_val)
    
