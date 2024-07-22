import { ResponseGetItinerary } from "../api/itinerary/route";

export const getItinerary = async (
  start: string,
  end: string,
  onError: (error: boolean) => void
): Promise<ResponseGetItinerary | undefined> => {
  const url = `/api/itinerary?start=${encodeURIComponent(
    start
  )}&end=${encodeURIComponent(end)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      onError(true);
      return undefined;
    }

    return await response.json();
  } catch (error: any) {
    onError(true);
    return undefined;
  }
};
