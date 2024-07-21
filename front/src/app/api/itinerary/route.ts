// app/api/itinerary/route.ts
import { NextRequest, NextResponse } from "next/server";

export type ResponseGetItinerary = {
  duration: number;
};

export type ResponseError = {
  error: string;
};

export async function GET(
  req: NextRequest
): Promise<NextResponse<ResponseGetItinerary | ResponseError>> {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json(
      { error: "Missing start or end parameter" },
      { status: 400 }
    );
  }

  console.log("Received request with start:", start, "end:", end);

  const url = `https://wxs.ign.fr/geoportail/itineraire/rest/1.0.0/route`;
  const params = new URLSearchParams({
    resource: "bdtopo-osrm",
    resourceVersion: "2024-07-19",
    start,
    end,
    profile: "car",
    optimization: "fastest",
  });

  console.log("Request URL:", `${url}?${params.toString()}`);

  try {
    const response = await fetch(`${url}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", errorText);
      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      );
    }

    const data: ResponseGetItinerary = await response.json();
    console.log("Response Data:", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.log("Catch Error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}
