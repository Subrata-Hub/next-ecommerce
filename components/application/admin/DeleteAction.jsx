import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { ListItemIcon, MenuItem } from "@mui/material";
import Link from "next/link";

const DeleteAction = ({ handleDelete, row, deleteType }) => {
  return (
    <div>
      <MenuItem
        key="delete"
        onClick={() => handleDelete([row.original._id], deleteType)}
      >
        {/* <Link href={href}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          Delete
        </Link> */}

        <ListItemIcon>
          <DeleteIcon />
          Delete
        </ListItemIcon>
      </MenuItem>
    </div>
  );
};

export default DeleteAction;
