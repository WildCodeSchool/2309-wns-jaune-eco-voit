import { CircularProgress } from "@mui/material";

const CircularLoading = ({ size = 50 }: { size?: number }) => (
  <div className="flex items-center justify-center h-screen">
    <CircularProgress size={size} />
  </div>
);

export default CircularLoading;
