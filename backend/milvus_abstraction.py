from pymilvus import MilvusClient
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv, find_dotenv
import os

class DocumentSchema:
    def __init__(self, documentId, documentVector, documentText):
        self.documentId = documentId
        self.documentVector = documentVector
        self.documentText = documentText

    def schemaToDict(self):
        return {
            "documentId": self.documentId,
            "documentVector": self.documentVector,
            "documentText": self.documentText
        }

class QuestionSchema:
    def __init__(self, questionId, questionVector, questionText, answer, documentId, timestamp):
        self.questionId = questionId
        self.questionVector = questionVector
        self.questionText = questionText
        self.answer = answer
        self.documentId = documentId
        self.timestamp = timestamp
    
    def schemaToDict(self):
        return {
            "questionId": self.questionId,
            "questionVector": self.questionVector,
            "questionText": self.questionText,
            "answer": self.answer,
            "documentId": self.documentId,
            "timestamp": self.timestamp
        }

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
def embed_from_text(text: str):
  embeddings.embed_query(text=text)

class MilvusInteraction:
  def __init__(self, client, collectionName):
    self.collectionName = collectionName
    self.client = client

    def insert(self, schema: DocumentSchema | QuestionSchema):
      client.insert(collectionName, data=schema.schemaToDict())
    
    def delete(self, ids: list[int]):
      client.delete(collectionName, ids=ids)
    
    def search(self, text, output_fields=[], filter=""):
      embed_text = embed_from_text(text)
      closestQuery = client.search(collectionName, data = [embed_text], limit=1, output_fields=output_fields, filter=filter)
      return closestQuery

def get_closest_distance(doc_list: list[list[dict]]):
  return doc_list[0][0]["distance"]



