"use client";
import React, { useEffect, useState } from "react";
import { filterMenu } from "@/app/constants/constants";
import {
  Divider,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Box,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TrashIcon from "@mui/icons-material/DeleteOutline";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import db from "@/app/firebase";
import Link from "next/link";
import CheckBox from "./_components/checkBox";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CommenCheckBox from "./_components/commonCheckBox";

const drawerWidth = 340;

const SideDrawer = () => {
  const [patientData, setPatientData] = useState<Array<any>>([]);
  const [selectedNotesType, setSelectedNotesType] =
    useState<String>("allNotes");
     const [userData, setUserData] = useState({ name: "", id: "" });
  const [selectedPatient, setSelectedPatient] = useState<Array<any>>([]);

  const router = useRouter();

  const updateFirebaseData = async (docId: string, newData: any) => {
    try {
      await updateDoc(doc(db, "patient", docId), newData);
    } catch (error) {
      toast.error(
        "Oops! Something went wrong while updating data. Please try again later."
      );
    }
  };

  const handelDelete = async (docId: string) => {
    try {
      let updateData;
      if (selectedNotesType === "deletedSoon") {
        updateData = { isPdeleted: true };
        setSelectedPatient([]);
      } else {
        updateData = { isDeleted: true };
        setSelectedPatient([]);
      }
      await updateFirebaseData(docId, updateData);
      toast.success("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting data in Firebase:", error);
      toast.error(
        "Oops! Something went wrong while deleting data. Please try again later."
      );
    }
  };

  const createQueryPipeline = (): any => {
    let pipeline: any[] = [];
    switch (selectedNotesType) {
      case "allNotes":
        pipeline = [
          ...pipeline,
          where("createdBy", "==", userData.id),
          where("isDeleted", "==", false),
        ];
        break;
      case "unreadNotes":
        pipeline = [
          ...pipeline,
          where("createdBy","==", userData.id),
          where("isDeleted", "==", false),
          where("isRead", "==", false),
        ];
        break;
      case "deletedSoon":
        pipeline = [
          ...pipeline,
          where("createdBy","==", userData.id),
          where("isDeleted", "==", true),
          where("isPdeleted", "==", false),
        ];
        break;
      case "trash":
        pipeline = [
          ...pipeline,
          where("createdBy","==", userData.id),
          where("isPdeleted", "==", true),
        ];
        break;
      default:
        pipeline = [
          ...pipeline,
          where("createdBy","==", userData.id),
          where("isDeleted", "==", false),
        ];
    }
    return pipeline;
  };

  const handelMultipleSelect = (id: string) => {
    if (selectedPatient.includes(id)) {
      setSelectedPatient((prev) => prev.filter((item) => item !== id));
      return;
    }
    setSelectedPatient((prev) => [...prev, id]);
  };

  const handelSelectAll = () => {
    if (selectedPatient.length === patientData.length) {
      setSelectedPatient([]);
      return;
    }
    setSelectedPatient(patientData.map((data) => data._id));
  };

  const clearSelectedAll = () => {
    setSelectedPatient([]);
  };

  const handelDeleteAll = async () => {
    try {
      const updateData = {
        [selectedNotesType !== "deletedSoon" ? "isDeleted" : "isPdeleted"]:
          true,
      };
      selectedPatient.forEach(async (docId) => {
        await updateFirebaseData(docId, updateData);
      });
      toast.success("Data deleted successfully!");
      setSelectedPatient([]);
    } catch (error) {
      console.error("Error deleting data in Firebase:", error);
      toast.error(
        "Oops! Something went wrong while deleting data. Please try again later."
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ref = collection(db, "patient");
        const queryFilter = createQueryPipeline();
        const q = query(ref, ...queryFilter);
        const doc_refs = await getDocs(q);
        const data = doc_refs.docs.map((doc) => ({
          _id: doc.id,
          ...(doc.data() as object),
        }));
        setPatientData(data);
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
        toast.error(
          "Oops! Something went wrong while fetching data. Please try again later."
        );
      }
    };
    const fireBaseSnapshot = onSnapshot(
      collection(db, "patient"),
      (snapshot) => {
        fetchData();
      }
    );
    return () => fireBaseSnapshot();
  }, [db, selectedNotesType,userData]);
  
  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("userData") as string))
  }, [])

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          marginTop: "50px",
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Divider />
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        sx={{ minHeight: "40px" }}
        onClick={() => router.push("/")}
      >
        START A VISIT
      </Button>
      <List>
        <ListItem disablePadding>
          <CommenCheckBox
            key={selectedPatient.length}
            action={
              selectedPatient.length === patientData.length ||
              selectedPatient.length === 0
                ? handelSelectAll
                : clearSelectedAll
            }
            indeterminate={
              selectedPatient.length > 0 &&
              selectedPatient.length < patientData.length
            }
            value={selectedPatient.length !== 0}
          />
          {selectedPatient.length === 0 && (
            <Select
              value={selectedNotesType}
              variant="standard"
              name="notesType"
              displayEmpty
              sx={{ minWidth: "85%" }}
              disableUnderline
              className="capitalize"
              onChange={(e) => {
                setSelectedNotesType(e.target.value);
              }}
            >
              {filterMenu.map(({ icon, value }, index) => (
                <MenuItem key={index} value={value} className="capitalize">
                  <Box className="flex">
                    <ListItemIcon>{icon}</ListItemIcon>
                    {value}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          )}
          {selectedPatient.length > 0 && (
            <Button className="w-fit" onClick={handelDeleteAll}>
              DELETE SELECTED
            </Button>
          )}
        </ListItem>
        {patientData.map((data, index) => (
          <Link href={`/visit/${data?._id}`}>
            <ListItemButton>
              <CheckBox
                handelMultipleCheck={handelMultipleSelect}
                id={data._id}
                AllSelected={selectedPatient.includes(data._id)}
              />
              <ListItemText
                primary={data?.name}
                secondary={
                  data?.createdAt.toDate().toLocaleDateString() +
                  " " +
                  data?.createdAt.toDate().toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })
                }
                className={!data.isRead ? "list-item-text" : ""}
              />
              <IconButton
                onClick={(e) => {
                  e.preventDefault();
                  {
                    selectedNotesType !== "trash" ? handelDelete(data._id) : "";
                  }
                }}
              >
                <TrashIcon />
              </IconButton>
            </ListItemButton>
          </Link>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
};

export default SideDrawer;
