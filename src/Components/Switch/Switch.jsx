import React, { useState, useEffect } from "react";
import Switch from "@mui/material/Switch";
import axios from "axios";

const label = { inputProps: { "aria-label": "Color switch demo" } };

export default function SwitchComp({ id, isActive, getFood }) {
  let user = JSON.parse(sessionStorage.getItem("userInfo"));
  const [checked, setChecked] = useState(isActive === "A");

  useEffect(() => {
    setChecked(isActive === "A"); // keep in sync if parent changes
  }, [isActive]);

  const handleChange = async (e) => {
    const newChecked = e.target.checked;
    setChecked(newChecked); // ✅ update UI immediately (optimistic)

    try {
      await axios.post(
        `http://localhost:3000/api/recepie/deleteFood/${user.orgid}/${user.wallid}`,
        {
          recid: id,
          status: newChecked ? "A" : "IA",
        },
        { headers: { "Cache-Control": "no-cache" } }
      );
      getFood()
    } catch (error) {
      console.error("Error updating status:", error);
      setChecked(!newChecked); // rollback if API fails
    }
  };

  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      {...label}
      color="warning"
    />
  );
}
