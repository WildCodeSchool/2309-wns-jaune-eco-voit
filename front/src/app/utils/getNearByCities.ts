const getNearByCities = async ({
  longitude,
  latitude,
  radius,
  onError,
}: {
  longitude: string;
  latitude: string;
  radius: number;
  onError?: () => void;
}) => {
  try {
    const response = await fetch(
      `/api/nearByCities?lat=${latitude}&lon=${longitude}&radius=${radius}`
    );

    const data = await response.json();
    if (response.ok) {
      return data.cities;
    } else {
      onError?.();
    }
  } catch (err) {
    onError?.();
  }
};

export default getNearByCities;
