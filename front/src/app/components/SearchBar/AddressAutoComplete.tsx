import { useState, useEffect, useCallback, FC, ChangeEvent } from "react";
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
  nom: string;
  codesPostaux: string[];
  centre: { coordinates: [number, number] };
  population: number;
};

type Feature = AddressResponse;

type ApiResponse = Feature[];

type AddressAutoCompleteProps = {
  label: string;
  handleSelectedAddress: (addressResponse: AddressResponse) => void;
  clearAddress: () => void;
  defaultValue?: string;
  sx?: SxProps<Theme>;
  gotAdornment?: boolean;
  handleOnChange?: () => void;
  isFirstElement?: boolean; // Corrected type definition for sx prop
};

const AddressAutoComplete: FC<AddressAutoCompleteProps> = ({
  label,
  handleSelectedAddress,
  clearAddress,
  defaultValue,
  sx,
  gotAdornment,
  handleOnChange,
  isFirstElement,
}) => {
  const [options, setOptions] = useState<Feature[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<Feature[]>([]);

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
          setOptions(data);
          setApiResponse(data);
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
    _: ChangeEvent<{}>,
    value: string | null,
    reason: AutocompleteChangeReason
  ) => {
    handleOnChange?.();

    if (reason === "clear") {
      clearAddress();
      return;
    }

    // Extraire le nom de la ville à partir de la chaîne d'option sélectionnée
    const cityName = value ? value.split(" (")[0] : "";

    const data = apiResponse.find((feature) => feature.nom === cityName);
    if (data) {
      handleSelectedAddress(data);
    }
  };

  return (
    <Stack>
      <Autocomplete
        value={defaultValue ?? ""}
        sx={{
          maxWidth: { sm: "100%", lg: 300 },
          minWidth: 200,
          backgroundColor: "white",
          borderRadius: isFirstElement ? "32px 0 0 32px" : "0",
        }}
        freeSolo
        options={options.map(
          (option) => `${option.nom} (${option.codesPostaux.join(", ")})`
        )}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        onChange={handleOptionChange}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option + self.crypto.randomUUID()}>
              {option}
            </li>
          );
        }}
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
