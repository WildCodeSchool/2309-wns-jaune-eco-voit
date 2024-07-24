export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("city");

  const res = await fetch(
    `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(
      address!
    )}&fields=nom,centre,codesPostaux`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const cityList = await res.json();
  return new Response(JSON.stringify(cityList));
}
