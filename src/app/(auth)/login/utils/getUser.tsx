import db from "@/app/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getUser = async (userData: any) => {
  const ref = collection(db, "users");
  const userRef = query(ref, where("id", "==", userData.user.uid));
  const querySnapshot = await getDocs(userRef);
  querySnapshot.forEach((doc) => {
    console.log(doc.data());
    localStorage.setItem("userData", JSON.stringify(doc.data()));
  });
};
