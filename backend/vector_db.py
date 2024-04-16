from pymilvus import MilvusClient
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv(), override=True)

OPENAI_API_KEY = os.getenv("YOUR_OPENAI_KEY")
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

CLUSTER_ENDPOINT = "https://in03-841f674328869e6.api.gcp-us-west1.zillizcloud.com"  # Set your cluster endpoint
TOKEN = "7ac7f603b5c904ec69967d5bd1386eb958ba271c7aee24d867ab53fce126890ad7d3496a33597afd32db4459d050853da2c5494e"  # Set your token

# Initialize a MilvusClient instance
# Replace uri and token with your own
client = MilvusClient(
    uri=CLUSTER_ENDPOINT,  # Cluster endpoint obtained from the console
    token=TOKEN,  # API key or a colon-separated cluster username and password
)

test_data = "some silly question"
test_data_vec = embeddings.embed_query(test_data)
test_data_dict = {"documentId": 1, "document": test_data_vec}

# client.delete("DocumentCollection", ids=0)
# client.insert("DocumentCollection", data=test_data_dict)
# print(client.get("DocumentCollection", ids=1))
