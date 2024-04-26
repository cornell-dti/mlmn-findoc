import supabase from "@/utils/supabase";

export const getUserIdByEmail = async (email: string): Promise<number> => {
  const { data, error } = await supabase.from("user").select("id").eq("email", email);
  if (error) {
    throw error;
  }
  return data[0].id;
};

/**
 * Returns an array of document IDs for a given user
 * @param userId
 * @returns
 */
export const getDocsByUserId = async (userId: number): Promise<BigInt[]> => {
  const { data, error } = await supabase.from("user-doc").select("docID").eq("userID", userId);
  if (error) {
    throw error;
  }
  return data.map((doc) => BigInt(doc.docID));
};

/**
 * Returns a sorted array of query IDs based on timestamp for a given user and document
 * @param userId
 * @param docId
 * @returns
 */
export const getQueries = async (userId: number, docId: BigInt): Promise<BigInt[]> => {
  const { data, error } = await supabase
    .from("user-query")
    .select("queryID, timestamp")
    .filter("docID", "eq", docId)
    .filter("userID", "eq", userId);
  if (error) {
    throw error;
  }
  return data.sort((a, b) => a.timestamp - b.timestamp).map((query) => BigInt(query.queryID));
};

export const uploadDoc = async (userId: number, docId: BigInt, title: string) => {
  getDocsByUserId(userId).then((data) => {
    if (data.includes(docId)) {
      throw new Error("Document already exists");
    }
  });

  const { data, error } = await supabase.from("user-doc").insert([{ userID: userId, docID: docId.toString(), title }]);
  if (error) {
    throw error;
  }
  return data;
};

export const uploadQuery = async (userId: number, docId: BigInt, queryId: BigInt, timestamp?: number) => {
  timestamp = timestamp || Date.now();
  const { data, error } = await supabase
    .from("user-query")
    .insert([{ userID: userId, docID: docId.toString(), queryID: queryId.toString(), timestamp }]);
  if (error) {
    throw error;
  }
  return data;
};
