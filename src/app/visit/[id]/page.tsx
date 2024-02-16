"use client";
import { AppBar, Box, Button, TextField, Toolbar, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import React, { useEffect, useState } from "react";
import TransciptCard from "../../components/transcript-card";
import { useParams } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import db from "@/app/firebase";
import { ToastContainer, toast } from "react-toastify";
import { updateFirebaseData } from "@/app/utils/updateFirabaseDoc";

const drawerWidth = 320;

const PatientInfoPage = () => {
  const [isLoading, setIsloading] = useState(false);
  const [patientData, setPatientData] = useState(null as any);
  const [patientName, setPatientName] = useState("" as string);
  const { id } = useParams();

  const markAsRead = async (docId: string) => {
    try {
      await updateFirebaseData(docId, { isRead: true });
    } catch (error) {
      console.error("Error marking data as read in Firebase:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsloading(true);
        const docRef = doc(db, "patient", id);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        setPatientData({ _id: docSnap.id, ...data });
        setPatientName(data?.name);
        if (data?.isRead) {
          return setIsloading(false);
        }
        markAsRead(docSnap.id);
        setIsloading(false);
      } catch (error) {
        setIsloading(false);
      }
    };
  fetchData()
  }, [id, db]);

  const handelNameChange = async () => { 
    try {
      await updateFirebaseData(patientData._id, { name: patientName });
    } catch (error) {
      toast.error("please try again later");
    }
  }

  return (
    <div className=" mt-28">
      <ToastContainer autoClose={3000} />
      <AppBar
        sx={{
          marginTop: "50px ",
          display: "block",
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          justifyContent: "space-between",
          alignContent: "center",
          backgroundColor: "rgb(245, 245, 245)",
          color: "black",
        }}
      >
        <div>
          <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="bg-primary">
              <Box width={300}>
                <TextField
                  id="standard-basic"
                  fullWidth
                  value={patientName}
                  // sx={{
                  //   "& .MuiInputBase-root": {
                  //     "& ::after": {
                        
                  //     }
                  //   },
                  // }}
                  onBlur={handelNameChange}
                  onChange={(e) => setPatientName(e.target.value)}
                  variant="standard"
                />
              </Box>
              <span style={{ fontSize: "12px" }}>Condition • 3 minutes</span>
            </div>
            <Button variant="outlined" startIcon={<ContentCopyIcon />}>
              Copy All
            </Button>
          </Toolbar>
        </div>
      </AppBar>
      <Box sx={{ marginTop: "50px" }}>
        <TransciptCard
          title="Full Transcript"
          transcriptText={patientData?.full_transcript}
          summaryLoading={isLoading}
        />
        <TransciptCard
          title="Subjective"
          transcriptText={patientData?.summary.subjective}
          summaryLoading={isLoading}
        />

        <TransciptCard
          title="objective"
          transcriptText={patientData?.summary.objective}
          summaryLoading={isLoading}
        />
        <TransciptCard
          title="assessment & Plan"
          transcriptText={patientData?.summary.assessmentPlan}
          summaryLoading={isLoading}
        />
        <TransciptCard
          title="Patient Instructions"
          transcriptText={patientData?.summary.PatientInstructions}
          summaryLoading={isLoading}
        />
        <TransciptCard
          title="Summary"
          transcriptText={patientData?.summary.summaryMeeting}
          summaryLoading={isLoading}
        />
      </Box>
    </div>
  );
};

export default PatientInfoPage;
