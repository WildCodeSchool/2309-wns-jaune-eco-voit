"use client";

import { Typography } from "@mui/material";

const PaymentFail = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-8 px-8">
      <Typography variant="h4" component="h2" align="center">
        Votre réservation a échouée
      </Typography>
    </div>
  );
};

export default PaymentFail;
