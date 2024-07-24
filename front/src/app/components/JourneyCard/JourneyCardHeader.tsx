import logo from "@/assets/logo_journey.svg";
import dayjs from "dayjs";
import Image from "next/image";

type JourneyHeaderType = {
  departureTime: Date;
  origin: string;
  destination: string;
};

const JourneyCardHeader = ({
  departureTime,
  origin,
  destination,
}: JourneyHeaderType) => {
  dayjs.locale("fr");
  const formattedTime = dayjs(departureTime).format("HH[h]mm");
  const formattedDate = dayjs(departureTime).locale("fr").format("dddd D MMMM");

  return (
    <div className="flex flex-row justify-between text-base">
      <div className="flex flex-col gap-2 leading-5">
        <Image src={logo} alt="logo_journey" width={85} height={40} />
        <p className="pt-3 font-semibold">
          {origin} - {destination}
        </p>
        <p className="font-medium">Départ {formattedTime} </p>
      </div>
      <div>
        <p className="rounded-full bg-dark100 text-white p-1 px-3">
          {formattedDate[0].toUpperCase()}
          {formattedDate.slice(1)}
        </p>
      </div>
    </div>
  );
};

export default JourneyCardHeader;
