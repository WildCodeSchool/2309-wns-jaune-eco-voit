import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  CircularProgress,
  Autocomplete,
  AutocompleteChangeReason,
  Stack,
  SxProps,
  Theme,
} from "@mui/material";

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
  geometry?: Geometry["coordonates"];
  label: string;
};

type Geometry = {
  coordonates: string[];
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
  sx?: SxProps<Theme>; // Corrected type definition for sx prop
};

const AddressAutoComplete: React.FC<AddressAutoCompleteProps> = ({
  label,
  handleSelectedAddress,
  clearAddress,
  defaultValue,
  sx,
}) => {
  const [options, setOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<Feature[]>([]);
  const [geometry, setGeometry] = useState<string[]>([]);

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
          console.log(data);
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
    const formattedAddress = data?.properties;

    if (formattedAddress) {
      const updatedAddress = {
        ...formattedAddress,
        geometry: data?.geometry.coordonates,
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
          <TextField
            {...params}
            label={label}
            variant="outlined"
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
        )}
      />
    </Stack>
  );
};
export default AddressAutoComplete;
