"use client";
import { useState } from "react";
import { Container, Box } from "@mui/material";
import {
  loginInputs,
  signUpFormInputs,
} from "@/app/(auth)/login/constants/formFields";
import { toast } from "react-toastify";
import { useRouter, usePathname } from "next/navigation";
import {
  FormFooter,
  FormHeader,
  InputField,
  SocialAuth,
  SubmitBtn,
} from "./_components";
import { useForms } from "./Hook/useForms";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/app/firebase";
import { getUser } from "./utils/getUser";
import { setToken } from "./utils/setToken";
import { storeUserDataDb } from "./utils/storeUserDb";

const LoginPage = () => {
  const pathName = usePathname();
  const router = useRouter();
  const [formType, setFormType] = useState(
    pathName === "/login" ? true : false
  );
  const { register, handleSubmit, errors, reset } = useForms(formType);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handelFormType = async () => {
    setFormType(!formType);
  };

  const handelLogin = async (data: any) => {
    const { email, password } = data;
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      getUser(userCredential);
      setToken(token);
      toast.success("login successfull redirecting to Home", {
        autoClose: 3000,
        closeButton: true,
      });
setIsSubmitting(false);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      toast.error("email or password wrong!");
    }
  };

  const handelSignUp = async (data: any) => {
    const { email, password, name } = data;
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await storeUserDataDb(
        name,
        userCredential.user?.email,
        userCredential.user?.uid
      );

      toast.success("Account created successfully! redirecting to login", {
        autoClose: 3000,
        closeButton: true,
      });
      setIsSubmitting(false);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      toast.error("Something went wrong! please try again later");
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (formType) {
        handelLogin(data);
      } else {
        handelSignUp(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      reset();
    }
  };

  return (
    <>
      <div className="w-screen  flex  justify-center items-center h-screen ">
        <div className=" w-[90%] lg:w-[50%] xl:w-[53%]  sm:px-24 lg:px-30 pt-[48px]  flex flex-col justify-center items-center relative  rounded-3xl font-sans">
          <Container maxWidth="xl">
            <FormHeader />
            <SocialAuth />
            <Box
              component="form"
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              {(formType ? loginInputs : signUpFormInputs).map(
                ({ label, type, name, placeholder }) => (
                  <InputField
                    key={name}
                    label={label}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    register={register}
                    error={errors[name as keyof typeof errors]?.message}
                  />
                )
              )}
              <SubmitBtn formType={formType} isSubmitting={isSubmitting} />
              <FormFooter formType={formType} action={handelFormType} />
            </Box>
          </Container>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
