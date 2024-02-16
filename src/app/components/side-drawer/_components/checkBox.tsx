"use client";
import { Checkbox } from "@mui/material";

const CheckBox = ({
  handelMultipleCheck,
  id,
  AllSelected,
}: {
  handelMultipleCheck: Function;
  id: string;
  AllSelected: boolean;
}) => {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  return (
    <Checkbox
      checked={AllSelected}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handelMultipleCheck(id);
      }}
      {...label}
    />
  );
};

export default CheckBox;
