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
  geometry: string[];
  label: string;
};

type Feature = {
  properties: AddressResponse;
};

type ApiResponse = {
  features: Feature[];
};

type AddressAutoCompleteProps = {
  label: string;
  handleSelectedAddress: (addressResponse: AddressResponse) => void;
  clearAddress: () => void;
  sx?: SxProps<Theme>; // Corrected type definition for sx prop
};

const AddressAutoComplete: React.FC<AddressAutoCompleteProps> = ({
  label,
  handleSelectedAddress,
  clearAddress,
  sx,
}) => {
  const [options, setOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<any>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSuggestions = useCallback(
    debounce(async (value: string) => {
      if (value.trim() === "") {
        setOptions([]);
        return;
      }
      setLoading(true);
      const encoded = encodeURI(value);
      fetch(`/api/autocomplete?address=${encoded}`)
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
    if (reason === "clear") {
      clearAddress();
      return;
    }
    const data = apiResponse.find(
      (feature: any) => feature.properties.label === value
    );
    const formatedAddress = data.properties;

    handleSelectedAddress(
      Object.assign(formatedAddress, {
        geometry: data.geometry.coordinates,
      })
    );
  };

  return (
    <Stack>
      <Autocomplete
        sx={{ width: 300 }}
        freeSolo
        options={options}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        onChange={handleOptionChange}
        renderInput={(params) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CircleOutlinedIcon
              color="primary"
              className="ml-4 color-primary"
            />
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
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
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
