import {
  FormGroup,
  InputLabel,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { InputFieldsT } from "../types/FormTypes";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@mui/material";

const InputField = ({
  name,
  type,
  placeholder,
  label,
  register,
  error,
}: InputFieldsT) => {
  const [showPassword, setShowPassword] = useState(false);
  const pathName = usePathname();

  const size = "small";

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormGroup>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <TextField
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        autoFocus={
          pathName === "/login"
            ? name === "email"
              ? true
              : false
            : name === "name"
              ? true
              : false
        }
        placeholder={placeholder}
        className="mt-[4px]"
        autoComplete="off"
        {...register(name)}
        error={error ? true : false}
        helperText={error ? error : ""}
        size={size}
        InputProps={
          type === "password" && {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleClickShowPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }
        }
      />
    </FormGroup>
  );
};

export default InputField;
