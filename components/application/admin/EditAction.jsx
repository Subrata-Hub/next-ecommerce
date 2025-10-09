import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { ListItemIcon, MenuItem } from "@mui/material";
import Link from "next/link";

const EditAction = ({ href }) => {
  return (
    <MenuItem key="edit">
      <Link href={href}>
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        Edit
      </Link>
    </MenuItem>
  );
};

export default EditAction;
