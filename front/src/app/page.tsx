import { Button } from "@mui/material";

export default function Home() {
  return (
    <div className="home_page flex-1 flex flex-col gap-6 h-full items-center justify-center bg-primary10 py-10">
      <h1>Il faut rouler cool!</h1>
      <h3 className="font-medium uppercase tracking-widest">Ecovoit</h3>
      <div className="flex gap-3">
        <Button variant="outlined">outlined</Button>
        <Button variant="outlined" color="secondary">
          outlined
        </Button>
        <Button>text</Button>
        <Button color="secondary">text</Button>
        <Button variant={"contained"}>Contained</Button>
        <Button variant={"contained"} color="secondary">
          Contained
        </Button>
      </div>
    </div>
  );
}
