import * as React from "react";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function CountComp({ itemPrice, onTotalChange }) {
  const [count, setCount] = React.useState(1);

  React.useEffect(() => {
    const total = itemPrice * count;
    onTotalChange(total, count); // ✅ report total + count back to parent
  }, [count, itemPrice]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        fontSize: "1rem",
        fontWeight: "bold",
      }}
    >
      <ButtonGroup size="small">
        <Button onClick={() => setCount(Math.max(count - 1, 0))}>
          <RemoveIcon fontSize="small" />
        </Button>
        <Button onClick={() => setCount(count + 1)}>
          <AddIcon fontSize="small" />
        </Button>
      </ButtonGroup>
      {count}
    </Box>
  );
}
