import NotesIcon from "@mui/icons-material/Notes";
import MailIcon from "@mui/icons-material/Mail";
import DeleteSoonIcon from "@mui/icons-material/DeleteSweep";
import TrashIcon from "@mui/icons-material/DeleteOutline";

export const filterMenu = [
  {
    icon: <NotesIcon />,
    value: "allNotes",
  },
  {
    icon: <MailIcon />,
    value: "unreadNotes",
  },
  {
    icon: <DeleteSoonIcon />,
    value: "deletedSoon",
  },
  {
    icon: <TrashIcon />,
    value: "trash",
  },
];
