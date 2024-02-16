"use client"
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { useState } from "react";
import { updateFirebaseData } from "@/app/utils/updateFirabaseDoc";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: "0.3rem",
  boxShadow: 24,
  py: 2,
  px: 3,
};

export default function NameModel({ open, id , handleClose} :{open:boolean,id:string,handleClose:()=>void}) {
    const [userName, setUserName] = useState("");
    const handelSubmitName = async (e:any) => {
        e.preventDefault();
        if (userName.trim() === "") { 
            handleClose()
        }
        try {
           const data:any = await updateFirebaseData(id, { name: userName.trim() });
              if (data) {
                 toast.success("Name added successfully.");
              }
       } catch (error) {
         toast.error("Oops! Something went wrong while adding Name. Please try again later.");
       }finally{
           handleClose();
       }
    }
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Thank you for healing another human
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2, mb: 2, color: "GrayText" }}
          >
            Who was the patient for visit?
          </Typography>
          <Box component="form" onSubmit={handelSubmitName}>
            <TextField
              id="standard-basic"
              label="Patient Name"
              autoFocus={true}
              variant="standard"
              fullWidth
              value={userName}
              name="userName"
              placeholder="john doe"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUserName(e.target.value);
              }}
            />
            <Box className="flex gap-2 justify-end">
              <Button
                variant="text"
                sx={{ mt: 2, color: "black" }}
                onClick={handleClose}
              >
                Skip
              </Button>
              <Button variant="text" type="submit" sx={{ mt: 2 }}>
                CONFIRM NAME
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
