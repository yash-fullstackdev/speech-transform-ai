"use client";
import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .required("Required")
    .min(8, "Password must be at least 8 characters"),
});

export const signUpSchema = Yup.object({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .required("Required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});
