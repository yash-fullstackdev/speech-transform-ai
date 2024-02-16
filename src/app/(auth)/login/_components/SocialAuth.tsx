"use client";
import db, { auth } from "@/app/firebase";
import GoogleIcon from "@mui/icons-material/Google";
import { Typography } from "@mui/material";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { setToken } from "../utils/setToken";
import { storeUserDataDb } from "../utils/storeUserDb";
import { collection, getDocs, query, where } from "firebase/firestore";

const SocialAuth = () => {
  const router = useRouter();
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          storeUserDataDb(user?.displayName, user?.email, user?.uid);
          user
            .getIdToken()
            .then(async (idToken) => {
              setToken(idToken);
              const ref = collection(db, "users");
              const userRef = query(ref, where("id", "==", user.uid));
              const querySnapshot = await getDocs(userRef);
              querySnapshot.docs.forEach((doc) => {
                localStorage.setItem("userData", JSON.stringify(doc.data()));
              });
              router.push("/");
              toast.success("Login successful, redirecting to Home.");
            })
            .catch((error) => {
              console.log("Error occurred!");
            });
        } else {
          router.push("/login");
        }
      });
    } catch (error) {
      toast.error("An error occurred, please try again later!");
    }
  };

  return (
    <>
      <div className="w-full flex justify-center pt-4">
        <button
          className="border-2 rounded-md py-2 flex gap-2 px-2 text-sm items-center"
          onClick={handleGoogleLogin}
        >
          <GoogleIcon />
          Sign up with Google
        </button>
      </div>
      <div className="flex items-center justify-center mt-6">
        <hr className="w-1/3 bg-gray-300" />
        <Typography color="gray" className="mx-2 font-normal">
          Or
        </Typography>
        <hr className="w-1/3 bg-gray-300" />
      </div>
    </>
  );
};

export default SocialAuth;
