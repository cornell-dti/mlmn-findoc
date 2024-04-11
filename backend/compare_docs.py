import os
import streamlit as st
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(), override=True)

temperature = 0.0
QUERY_INSTRUCTIONS1 = "Enter first query document to compare two documents:"
QUERY_INSTRUCTIONS2 = "Enter second query document to compare two documents:"
COMPARE_HUMAN_PROMPT = "Compare these two texts exactly and keep the formatting consistent:\n\n{text1}\n\n{text2}"
COMPARE_SYSTEM_PROMPT = "You are an AI designed to compare and contrast two different documents. Focus on highlighting the exact differences and similarities between the two documents."


def compare_docs(doc1: str, doc2: str):
    chat = ChatOpenAI(
        temperature=temperature,
        model="gpt-3.5-turbo-0125",
        openai_api_key=os.getenv("YOUR_OPENAI_KEY"),
    )

    system_message = {"role": "system", "content": COMPARE_SYSTEM_PROMPT}
    human_message = {
        "role": "user",
        "content": COMPARE_HUMAN_PROMPT.format(text1=doc1, text2=doc2),
    }
    prompt_messages = [system_message, human_message]

    for response in chat.stream(prompt_messages):
        yield response.content


if __name__ == "__main__":
    st.title("Document Comparison Tool")
    temperature = st.slider("Select the temperature for the AI model:", 0.0, 1.0, 0.0, 0.1)
    doc1 = st.text_area(QUERY_INSTRUCTIONS1, height=100)
    if st.checkbox("Done with first document? Click here to submit."):
        doc2 = st.text_area(QUERY_INSTRUCTIONS2, height=100)
        if st.checkbox("Done with second document? Click here to submit."):
            # Collect responses by iterating through the generator
            responses = []
            for response in compare_docs(doc1=doc1, doc2=doc2):
                responses.append(response)
            # Join all responses into a single string to display
            combined_responses = "".join(responses)
            st.write(combined_responses)
            
