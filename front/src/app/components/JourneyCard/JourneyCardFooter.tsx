import PersonIcon from "@mui/icons-material/Person";

type JourneyCardFooterProps = {
  price: number;
  availableSeats: number;
};

const JourneyCardFooter = ({
  price,
  availableSeats,
}: JourneyCardFooterProps) => {
  return (
    <div className="flex justify-between ">
      <div className="flex gap-3 items-center ">
        <PersonIcon sx={{ width: 40, height: 40, color: "#9695A3" }} />
        <p className="m-0 font-bold text-dark60">
          {availableSeats} places disponibles
        </p>
      </div>
      <div className="flex font-bold text-xl items-center">
        {" "}
        <p className="font-medium text-lg pr-2">Prix total: </p>
        <p> {price} €</p>
      </div>
    </div>
  );
};

export default JourneyCardFooter;
