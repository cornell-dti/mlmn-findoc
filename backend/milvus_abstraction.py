from pymilvus import MilvusClient
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv(), override=True)

OPENAI_API_KEY = os.getenv("YOUR_OPENAI_KEY")


class DocumentSchema:
    def __init__(self, documentVector, documentText):
        self.documentVector = documentVector
        self.documentText = documentText

    def schemaToDict(self):
        return {
            "documentVector": self.documentVector,
            "documentText": self.documentText,
        }


class QuestionSchema:
    def __init__(self, questionVector, questionText, answer, documentId, timestamp):
        self.questionVector = questionVector
        self.questionText = questionText
        self.answer = answer
        self.documentId = documentId
        self.timestamp = timestamp

    def schemaToDict(self):
        return {
            "questionVector": self.questionVector,
            "questionText": self.questionText,
            "answer": self.answer,
            "documentId": self.documentId,
            "timestamp": self.timestamp,
        }


embeddings = OpenAIEmbeddings(model="text-embedding-3-small")


def embed_from_text(text: str):
    return embeddings.embed_query(text=text)


class MilvusInteraction:
    def __init__(self, client: MilvusClient, collectionName):
        self.collectionName = collectionName
        self.client = client

    def insert(self, schema: DocumentSchema | QuestionSchema):
        response = self.client.insert(self.collectionName, data=schema.schemaToDict())
        return response["ids"][0]

    def delete(self, ids: list[int]):
        self.client.delete(self.collectionName, ids=ids)

    def search(self, text, output_fields=[], filter=""):
        embed_text = embed_from_text(text)
        closestQuery = self.client.search(
            self.collectionName,
            data=[embed_text],
            limit=1,
            output_fields=output_fields,
            filter=filter,
        )
        return closestQuery


def get_closest_distance(doc_list: list[list[dict]]):
    if len(doc_list[0]) > 0:
        return doc_list[0][0]["distance"]
    return None


def order_by_timestamp(queries: list[list[dict]]):
    return queries[0].sort(key=(lambda x: x["timestamp"]))
