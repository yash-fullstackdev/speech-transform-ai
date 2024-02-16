import { collection, getDocs, query, where } from "firebase/firestore";
import db from "../firebase";

export const verifyUser = async (id:string) => {
  const ref = collection(db, "users");
  const q = query(ref, where("id", "==", id));
  const doc_refs = await getDocs(q);
  const data = doc_refs.docs.map((doc) => ({
    _id: doc.id,
    ...(doc.data() as object),
  }));
  return data.length > 0;
};
