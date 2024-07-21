import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  CircularProgress,
  Autocomplete,
  AutocompleteChangeReason,
  Stack,
  SxProps,
  Theme,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    border: "none",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiInputBase-input": {
    borderRadius: 0,
    border: "0",
  },
});

function debounce<Func extends (...args: any[]) => void>(
  func: Func,
  wait: number
) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<Func>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export type AddressResponse = {
  city: string;
  postCode: string;
  context: string;
  geometry?: Geometry["coordinates"];
  label: string;
  x: string;
  y: string;
};

type Geometry = {
  coordinates: string[];
};

type Feature = {
  properties: AddressResponse;
  geometry: Geometry;
};

type ApiResponse = {
  features: Feature[];
};

type AddressAutoCompleteProps = {
  label: string;
  handleSelectedAddress: (addressResponse: AddressResponse) => void;
  clearAddress: () => void;
  defaultValue?: string;
  sx?: SxProps<Theme>;
  gotAdornment?: boolean; // Corrected type definition for sx prop
  handleOnChange?: () => void;
};

const AddressAutoComplete: React.FC<AddressAutoCompleteProps> = ({
  label,
  handleSelectedAddress,
  clearAddress,
  defaultValue,
  sx,
  gotAdornment,
  handleOnChange,
}) => {
  const [options, setOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<Feature[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSuggestions = useCallback(
    debounce(async (value: string) => {
      if (value.trim() === "") {
        setOptions([]);
        return;
      }
      setLoading(true);
      const encoded = encodeURI(value);
      fetch(`/api/autocomplete?city=${encoded}`)
        .then((res) => res.json())
        .then((data: ApiResponse) => {
          setOptions(data.features.map((feature) => feature.properties.label));
          setApiResponse(data.features);
          setLoading(false);
        });
    }, 300),
    []
  );
  useEffect(() => {
    if (inputValue.length > 3) {
      fetchSuggestions(inputValue);
    }
  }, [inputValue, fetchSuggestions]);

  const handleOptionChange = (
    _: React.ChangeEvent<{}>,
    value: string | null,
    reason: AutocompleteChangeReason
  ) => {
    handleOnChange?.();

    if (reason === "clear") {
      clearAddress();
      return;
    }

    const data = apiResponse.find(
      (feature: any) => feature.properties.label === value
    );
    const formattedAddress = data?.properties;

    if (formattedAddress) {
      const updatedAddress = {
        ...formattedAddress,
        geometry: data?.geometry.coordinates,
      };

      handleSelectedAddress(updatedAddress);
    }
  };
  return (
    <Stack>
      <Autocomplete
        value={defaultValue ?? ""}
        sx={{ width: 300 }}
        freeSolo
        options={options}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        onChange={handleOptionChange}
        renderInput={(params) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {gotAdornment && (
              <CircleOutlinedIcon
                color="primary"
                className="ml-4 color-primary"
              />
            )}
            <StyledTextField
              {...params}
              label={label}
              InputProps={{
                ...params.InputProps,
                sx: {
                  ...sx,
                },
                endAdornment: (
                  <>
                    {loading && <CircularProgress color="inherit" size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          </Box>
        )}
      />
    </Stack>
  );
};
export default AddressAutoComplete;
