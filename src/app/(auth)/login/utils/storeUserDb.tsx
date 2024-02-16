import db from "@/app/firebase";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { verifyUser } from "@/app/utils/verifyUser";
export const storeUserDataDb = async (
  name: string | null,
  email: string | null,
  id: string
) => {
  const data = await verifyUser(id);
  if (data) {
    return;
  }
  await addDoc(collection(db, "users"), {
    name: name,
    email: email,
    id: id,
    createdAt: Timestamp.now(),
  });
};
