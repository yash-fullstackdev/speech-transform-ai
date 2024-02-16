import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, signUpSchema } from "../validation/formValidation";

export const useForms = (formType: Boolean) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(formType ? loginSchema : signUpSchema),
  });

  return {
    handleSubmit,
    register,
    errors,
    reset,
  };
};
