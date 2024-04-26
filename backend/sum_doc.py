# use streamlit run sum_doc.py to run
import json
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
from prompts import *
from typing import Generator
from vector_db import process_query, insert_doc, insert_qa
from sample_files.syllabi import CS_2110, CS_2800_SP22

load_dotenv(find_dotenv(), override=True)


chat = ChatOpenAI(
    temperature=0,
    model="gpt-3.5-turbo-0125",
    openai_api_key=os.getenv("OPENAI_API_KEY"),
)


def do_task(doc: str, system_prompt, human_prompt):
    try:
        return process_query(doc=doc, query=human_prompt.format(text=""))
    except Exception as e:
        system_message = SystemMessagePromptTemplate.from_template(system_prompt)
        human_message = HumanMessagePromptTemplate.from_template(
            human_prompt.format(text=doc)
        )
        chat_prompt = ChatPromptTemplate.from_messages([human_message, system_message])
        final_output = chat.invoke(chat_prompt.format_prompt().to_messages())
        print(e)
        if len(e.args) > 1:
            _, doc_id = e.args
            q_id = insert_qa(
                query=human_prompt.format(text=""),
                answer=final_output.content,
                documentId=doc_id,
            )
            return final_output.content, str(doc_id), str(q_id)
        else:
            doc_id = insert_doc(doc=doc)
            print(
                "insertiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiing documeeeeeeeeeeeeent",
                doc_id,
            )
            insert_qa(
                query=human_prompt.format(text=""),
                answer=final_output.content,
                documentId=doc_id,
            )
        return final_output.content, str(doc_id)


def sum_doc(doc: str):
    return do_task(doc, SUMMARIZE_SYSTEM_PROMPT_SYLLABUS, SUMMARIZE_HUMAN_PROMPT)


def get_dates(doc: str):
    return do_task(doc, BACKEND_DATES_SYSTEM_PROMPT, BACKEND_DATES_HUMAN_PROMPT)


def get_policies(doc: str):
    return do_task(doc, POLICIES_SYSTEM_PROMPT, POLICIES_HUMAN_PROMPT)


def get_resources(doc: str):
    return do_task(doc, RESOURCES_SYSTEM_PROMPT, RESOURCES_HUMAN_PROMPT)


def get_instructors(doc: str):
    return do_task(doc, INSTRUCTOR_SYSTEM_PROMPT, INSTRUCTOR_HUMAN_PROMPT)


def follow_up(doc: str, query: str):
    return do_task(
        doc,
        FOLLOW_UP_SYSTEM_PROMPT.format(doc=doc),
        query,
    )


def main(doc: str, tasks: dict) -> Generator[Any, Any, Any]:
    options_to_tasks = {
        "summary": sum_doc,
        "dates": get_dates,
        "policies": get_policies,
        "resources": get_resources,
        "instructors": get_instructors,
    }

    jobs = []
    for task_name in tasks:
        if tasks[task_name]:
            task_name = task_name.lower()
            jobs.append(options_to_tasks[task_name])

    with ThreadPoolExecutor(max_workers=len(jobs)) as executor:
        future_to_func = {executor.submit(job, doc): job.__name__ for job in jobs}

        for future in as_completed(future_to_func):
            func_name = future_to_func[future]
            try:
                result = future.result()
                response_dict = dict()
                response_dict[func_name] = result
                yield json.dumps(response_dict)
            except Exception as exc:
                print(f"{func_name} generated an exception: {exc}")
            else:
                print(f"{func_name} completed successfully")


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
    # print(do_task(CS_2110, SUMMARIZE_SYSTEM_PROMPT_SYLLABUS, SUMMARIZE_HUMAN_PROMPT))
    print(do_task(CS_2110, BACKEND_DATES_SYSTEM_PROMPT, BACKEND_DATES_HUMAN_PROMPT))
    # streamlit()
