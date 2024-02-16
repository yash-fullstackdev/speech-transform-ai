import { Typography } from "@mui/material";

const FormHeader = () => {
  return (
    <Typography
      variant="h4"
      align="center"
      className="flex justify-start gap-2 flex-col "
      gutterBottom
    >
      <h3 className="text-xl  xl:text-2xl  flex ">
        Welcome to Speech To Ai Text
      </h3>
      <p className="text-sm flex justify-start ">
        Please sign-in to your account
      </p>
    </Typography>
  );
};

export default FormHeader;
