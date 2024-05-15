import { Button, Stack } from "@mui/material"
import AddressAutoComplete from "./AddressAutoComplete"
import { useState, useEffect } from "react"

const SearchBar = () => {

  const [arrival, setArrival] = useState<Object | null >(null)
  const [departure, setDeparture] = useState<Object | null >(null)
  const [searchQuery, setSearchQuery] = useState<Object |null>(null)
  const [warning, setWarning] = useState<string>("")
    const handleDepartureChange = (value: Object | null) => {
    setDeparture(value);
  };

  const handleArrivalChange = (value: Object | null) => {
    setArrival(value);
  };

  useEffect(() => {
    if(departure && arrival){
      setSearchQuery({
        departure: departure,
        arrival: arrival
      })
    }
  }, [departure, arrival])

  const handleSearch = () => {
    if(departure && arrival){
      setWarning("")
      // Déclencher la recherche sur l'api avec searchQuery (objet contenant 2 objets, départure, arrival)
    }else{
      setWarning("Veuillez renseigner un point de départ et d'arrivée")
    }
  }

  return (
    <Stack gap={2} margin={2}>
      <Stack direction={{ sm: 'column', md: 'row' }} gap={2}>
        <AddressAutoComplete label={"Départ"} handleSelectedAdress={handleDepartureChange}/>
        <AddressAutoComplete label={"Arrivée"} handleSelectedAdress={handleArrivalChange}/>
        <Button className="h-14 self-baseline  md:self-end" onClick={handleSearch} variant={"contained"}>Rechercher</Button>
      </Stack>
      {warning && <p className="text-primary120 text-left">{warning}</p>}
    </Stack>
  )
}

export default SearchBar