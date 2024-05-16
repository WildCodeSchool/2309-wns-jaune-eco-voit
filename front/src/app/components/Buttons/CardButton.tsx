import React, { ReactNode } from "react";
import { Button } from "@mui/material";

type CardButtonProps = {
  children: ReactNode;
};

const CardButton = ({ children }: CardButtonProps) => {
  return (
    <Button
      fullWidth
      size="large"
      type="submit"
      variant="contained"
      color="primary"
    >
      {children}
    </Button>
  );
};

export default CardButton;
