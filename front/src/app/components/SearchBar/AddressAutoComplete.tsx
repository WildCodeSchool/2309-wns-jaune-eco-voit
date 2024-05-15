import React, { useState, useEffect, useCallback, SetStateAction } from 'react';
import { TextField, CircularProgress, Autocomplete, AutocompleteChangeReason, Stack, Button, Typography } from '@mui/material';

type Feature = {
  properties: {
    label: string;
  };
};

type ApiResponse = {
  features: Feature[];
};

function debounce<Func extends (...args: any[]) => void>(func: Func, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<Func>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

type AddressAutoCompleteProps = {
  label: string;
  handleSelectedAdress: (address: string) => void;
};

const AddressAutoComplete: React.FC<AddressAutoCompleteProps> = ({label, handleSelectedAdress}) => {
  const [options, setOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);


  const fetchSuggestions = useCallback(
    debounce(async (value: string) => {
      if (value.trim() === '') {
        setOptions([]);
        return;
      }
      
      setLoading(true);
      const encoded = encodeURI(value)
      fetch(`/api/autocomplete?address=${encoded}`)
        .then((res) => res.json())
        .then((data: ApiResponse) => {
          setOptions(data.features.map((feature) => feature.properties.label));
          setApiResponse(data.features.map((feature) => feature.properties));
          setLoading(false);
        });
    }, 300),
    []
  );


  useEffect(() => {
    if(inputValue.length > 3){
      console.log('inputValue', encodeURI(inputValue))
      fetchSuggestions(inputValue);
      
    }
  }, [inputValue, fetchSuggestions]);


    const handleOptionChange = (
    event: React.ChangeEvent<{}>,
    value: string | null,
    reason: AutocompleteChangeReason
  ) => {
    handleSelectedAdress(apiResponse.find((feature: any) => feature.label === value));
  };

  return (
    <Stack gap={2}>
    <Typography variant="h6" className="text-primary100">{label}</Typography>
    <Autocomplete
      sx={{ width: 300 }}
      freeSolo
      options={options}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      onChange={handleOptionChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Chercher une adresse"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
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