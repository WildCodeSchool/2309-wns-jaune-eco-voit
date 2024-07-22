import proj4 from "proj4";

// Définir les systèmes de coordonnées
proj4.defs(
  "EPSG:2154",
  "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
);
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");

const lambert93 = "EPSG:2154";
const wgs84 = "EPSG:4326";

// Fonction de conversion des coordonnées
// const convertCoordinates = (x, y) => {
//   const [longitude, latitude] = proj4(lambert93, wgs84, [x, y]);
//   return { latitude, longitude };
// };

export function convertCoordinates(x: number, y: number) {
  x = (x * 180) / 20037508.34;
  y = (y * 180) / 20037508.34;
  y = (Math.atan(Math.pow(Math.E, y * (Math.PI / 180))) * 360) / Math.PI - 90;
  return { longitude: x.toFixed(6), latitude: y.toFixed(6) };
}
