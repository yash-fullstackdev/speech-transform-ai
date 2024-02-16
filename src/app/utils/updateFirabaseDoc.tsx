import { doc, updateDoc } from "firebase/firestore";
import db from "../firebase";

export const updateFirebaseData = async (docId: string, newData: any) => {
  try {
      const data = await updateDoc(doc(db, "patient", docId), newData);
      return data;
  } catch (error) {
    console.error("Error updating data in Firebase:", error);
  }
};
