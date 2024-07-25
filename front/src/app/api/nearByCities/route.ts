// pages/api/nearByCities/routes.ts
import { NextRequest, NextResponse } from "next/server";
import haversine from "haversine-distance";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") || "");
  const lon = parseFloat(searchParams.get("lon") || "");
  const radius = parseFloat(searchParams.get("radius") || "");

  if (!lat || !lon || !radius) {
    return NextResponse.json(
      { error: "Missing latitude, longitude, or radius parameter" },
      { status: 400 }
    );
  }

  const url = `http://api.openweathermap.org/data/2.5/find`;
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    cnt: "50", // Obtenir plus de résultats pour filtrer par rayon
    appid: "aca72920b5d318919f6351fa32643d61", // Remplacez par votre clé API OpenWeatherMap
  });

  try {
    const response = await fetch(`${url}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    const cities = data.list
      .filter((city: any) => {
        const cityCoords = {
          latitude: city.coord.lat,
          longitude: city.coord.lon,
        };
        const userCoords = { latitude: lat, longitude: lon };
        const distance = haversine(cityCoords, userCoords) / 1000; // Convertir en km
        return distance <= radius;
      })
      .map((city: any) => city.name);

    return NextResponse.json({ cities }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}
