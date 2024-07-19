// const apiKey = 'votre_clé_API';
// const origin = '48.8566,2.3522';  // Latitude et longitude de Paris
// const destination = '45.7640,4.8357';  // Latitude et longitude de Lyon

// const getRoute = async (origin: string, destination: string) => {
//     const url = `https://data.geopf.fr/navigation/itineraire`;
//     const params = new URLSearchParams({
//         origin: origin,
//         destination: destination,
//         method: 'fastest',
//         vehicle: 'car'
//     });

//     try {
//         const response = await fetch(`${url}?${params.toString()}`);
//         if (!response.ok) {
//             throw new Error(`Error fetching route: ${response.statusText}`);
//         }
//         const data = await response.json();
//         console.log(data);
//     } catch (error) {
//         console.error('Error fetching route:', error);
//     }
// };

// getRoute(origin, destination);
