import os
from supabase import create_client, Client

supabase_url: str = os.getenv("SUPABASE_URL")
supabase_key: str = os.getenv("SUPABASE_KEY")
supabase_client: Client = create_client(supabase_url, supabase_key)

def get_docs_by_user(user_id: str):
    return supabase_client.from_("docs").select("*").eq("userID", user_id).execute()

def get_queries_by_user(user_id: str):
    return supabase_client.from_("user-query").select("*").eq("userID", user_id).execute()