"use client";
import { useState } from "react";
import { Checkbox } from "@mui/material";

const CommenCheckBox = ({
  action,
  indeterminate = false,
  value = false,
}: {
  action: Function;
  indeterminate: Boolean;
  value: Boolean;
}) => {
  const [checked, setChecked] = useState(value as boolean | undefined);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  return (
    <Checkbox
      checked={checked}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setChecked(!checked);
        action();
      }}
      indeterminate={indeterminate as boolean | undefined}
      {...label}
    />
  );
};

export default CommenCheckBox;
