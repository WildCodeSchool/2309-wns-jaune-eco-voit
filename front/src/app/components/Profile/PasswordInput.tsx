import { IconButton, InputAdornment, TextField } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { ChangeEvent, useState } from "react";

type PasswordInputProps = {
  onChangeFn?: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  value?: string;
  error?: string;
  name: string;
  label: string;
};

const PasswordInput = ({
  onChangeFn,
  value,
  name,
  label,
  error,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      name={name}
      label={label}
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={(e) => onChangeFn?.(e)}
      error={!!error}
      helperText={error}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword((show) => !show)}
              edge="end"
            >
              {showPassword ? (
                <VisibilityOutlinedIcon color="primary" />
              ) : (
                <VisibilityOffOutlinedIcon color="primary" />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
    // </>
  );
};

export default PasswordInput;
