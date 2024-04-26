import os
from supabase import create_client, Client

supabase_url: str = os.getenv("SUPABASE_URL")
supabase_key: str = os.getenv("SUPABASE_KEY")
supabase_client: Client = create_client(supabase_url, supabase_key)

USERS = supabase_client.table("user")
DOCS = supabase_client.table("user-doc")
QUERIES = supabase_client.table("user-query")

def get_docs_by_user(user_id: str):
    return supabase_client.from_("user-doc").select("*").eq("userID", user_id).execute()

def get_queries_by_user(user_id: str):
    return supabase_client.from_("query-doc").select("*").eq("userID", user_id).execute()

def get_user_by_email(email: str):
    return supabase_client.from_("user").select("*").eq("email", email).execute()

def upload_doc(user_id: str, doc_text: str):
    return supabase_client.from_("user-doc").insert({"userID": user_id, "docID": doc_text}).execute()

# def main():
#     data, _ = get_user_by_email("ow39@cornell.edu")
#     # USERS.delete().neq("first_name", 0).execute()
#     # DOCS.insert({"user_id": "5", "doc_text": "Hello, world!"}).execute()
#     uid = data[1][0]["id"]
#     # DOCS.insert({"userID": uid, "docID": 123456}).execute()
#     # QUERIES.insert({"userID": uid, "queryID": 123456}).execute()
#     print(get_docs_by_user(uid))

# if __name__ == "__main__":
#     main()