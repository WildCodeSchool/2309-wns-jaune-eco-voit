export async function GET(request: Request) {

  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURI(address!)}`, {
    headers: {
      'Content-Type': 'application/json',
      // 'API-Key': process.env.DATA_API_KEY!,
    },
  })
  const adressList = await res.json()
  console.log('adressList', Response.json(adressList))
  return Response.json(adressList)
}