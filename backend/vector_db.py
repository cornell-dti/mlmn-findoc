from pymilvus import MilvusClient
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv, find_dotenv
from sample_files.syllabi import CS_2800_SP22, CS_2110
import os
import time

from milvus_abstraction import (
    DocumentSchema,
    QuestionSchema,
    MilvusInteraction,
    embed_from_text,
    get_closest_distance,
)

load_dotenv(find_dotenv(), override=True)
client = MilvusClient(
    uri=os.getenv("MILVUS_CLUSTER_ENDPOINT"),
    token=os.getenv("MILVUS_TOKEN"),
)


def process_query(doc: str, query: str):
    print(query)
    closest_doc = MilvusInteraction(
        client=client, collectionName="DocumentCollection"
    ).search(text=doc)
    closest_doc_dist = get_closest_distance(closest_doc)
    if closest_doc_dist:
        print(f"closest doc distance: {closest_doc_dist}")
        if closest_doc_dist >= 0.99:
            doc_id = closest_doc[0][0]["id"]
            print(doc_id)
            closest_query = MilvusInteraction(
                client=client, collectionName="QuestionAnswerCollection"
            ).search(
                text=query, output_fields=["answer"], filter=f"documentId == {doc_id}"
            )
            closest_query_dist = get_closest_distance(closest_query)
            if closest_query_dist:
                print(f"closest query distance: {closest_query_dist}")
                if closest_query_dist >= 0.75:
                    return closest_query[0][0]["entity"]["answer"]
            raise Exception("Query not found", doc_id)
    raise Exception("Document not found")


def insert_doc(doc: str):
    doc_schema = DocumentSchema(documentVector=embed_from_text(doc), documentText=doc)
    doc_id = MilvusInteraction(
        client=client, collectionName="DocumentCollection"
    ).insert(doc_schema)
    return doc_id


def insert_qa(query: str, answer: str, documentId: int):
    timestamp = int(time.time())
    q_schema = QuestionSchema(
        questionVector=embed_from_text(query),
        questionText=query,
        answer=answer,
        documentId=documentId,
        timestamp=timestamp,
    )
    MilvusInteraction(client=client, collectionName="QuestionAnswerCollection").insert(
        q_schema
    )


# client.delete("DocumentCollection", ids=0)
# client.insert("DocumentCollection", data=test_data_dict)
# print(client.get("DocumentCollection", ids=1))

# process_query(test_data, "")


# syllabus_vec = embed_from_text(syllabus)
# client.insert(
#     "DocumentCollection",
#     data={"documentVector": syllabus_vec, "documentText": syllabus},
# )

# q = embed_from_text("What class is this for?")
# client.insert(
#     "QuestionAnswerCollection",
#     data={
#         "questionVector": q,
#         "questionText": "What class is this for?",
#         "answer": "Discrete Structures",
#         "documentId": 448985163764903001,
#         "timestamp": 1,
#     },
# )


# print(process_query(syllabus, "What class is this from?"))
