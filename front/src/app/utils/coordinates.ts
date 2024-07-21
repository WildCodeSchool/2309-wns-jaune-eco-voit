import proj4 from "proj4";

proj4.defs(
  "EPSG:2154",
  "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
);
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");

const lambert93 = "EPSG:2154";
const wgs84 = "EPSG:4326";

// Convertir les coordonnées
export const convertCoordinates = (x: number, y: number) => {
  const [longitude, latitude] = proj4(lambert93, wgs84, [x, y]);
  return { latitude, longitude };
};
