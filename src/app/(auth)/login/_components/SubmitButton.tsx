"use client";
import { Button, CircularProgress } from "@mui/material";

const SubmitBtn = ({ formType , isSubmitting=false }: { formType: Boolean,isSubmitting:Boolean }) => {
  return (
    <Button
      type="submit"
      variant="contained"
      className="bg-blue-600"
      sx={{
        padding: "10px 0",
        color: "white",
        borderRadius: "5px",
        marginTop: "20px",
      }}
      fullWidth
    >
      {isSubmitting && <CircularProgress sx={{color:"white"}} />}
      {!isSubmitting  ? (formType ? "Login" : "SignUp") : ""}
    </Button>
  );
};

export default SubmitBtn;
