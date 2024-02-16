import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyByMnz6Xh9isVHo4ovf5xVRLXY9KFMqmyg",
  authDomain: "speech-transform-ai.firebaseapp.com",
  projectId: "speech-transform-ai",
  storageBucket: "speech-transform-ai.appspot.com",
  messagingSenderId: "850040078739",
  appId: "1:850040078739:web:ad8965513efad3e6572866",
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);

export default db;
