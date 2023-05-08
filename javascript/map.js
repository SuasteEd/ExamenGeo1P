import "../styles/map.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, transformExtent } from "ol/proj.js";
import Geolocation from "ol/Geolocation.js";
import VectorLayer from "ol/layer/Vector";
import { Icon, Style } from "ol/style";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { containsCoordinate } from "ol/extent";

//Consumir datos
const urlParams = new URLSearchParams(window.location.search);
const dato = urlParams.get("name");
const latitud = urlParams.get("latitud");
const longitud = urlParams.get("longitud");

// var leonCoords = [-101.765528, 21.086406, -101.645382, 21.209231];

var coordenadas = [parseFloat(latitud), parseFloat(longitud)];

const datoElement = document.getElementById("dato");
datoElement.textContent = dato;

//Obtener la ubicación actual del usuario

const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: fromLonLat([-101.6874, 21.1232]),
    zoom: 13,
    minZoom: 13,
    maxZoom: 13,
  }),
});

const marker = new Feature({
  geometry: new Point(fromLonLat(coordenadas)),
});

const markerSource = new VectorSource({ features: [marker] });

const markerLayer = new VectorLayer({
  source: markerSource,
  style: new Style({
    image: new Icon({
      src: "https://img.icons8.com/ios-filled/512/marker.png",
      scale: 0.1,
    }),
  }),
});

map.addLayer(markerLayer);

// Agregar el marcador
const markerPosition = new Feature({
  geometry: new Point(fromLonLat([-101.6842, 21.1256])),
  name: "Mi Ubicación",
});

markerPosition.setStyle(
  new Style({
    image: new Icon({
      anchor: [0.5, 46],
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      src: "https://img.icons8.com/office/512/marker.png",
      scale: 0.1,
    }),
  })
);

const vectorSource = new VectorSource({
  features: [markerPosition],
});

const vectorLayer = new VectorLayer({
  source: vectorSource,
});

map.addLayer(vectorLayer);

const geolocation = new Geolocation({
  trackingOptions: {
    enableHighAccuracy: true,
  },
  projection: map.getView().getProjection(),
});

geolocation.once("change:position", () => {
  const coords = geolocation.getPosition();
  // Actualizar la posición del marcador
  markerPosition.setGeometry(new Point(coords));
});

geolocation.setTracking(true);

// Define el área límite de la ciudad de León en coordenadas WGS84
const leonCoords = [-101.765528, 21.086406, -101.645382, 21.209231];

// Transforma el área límite de la ciudad de León a la proyección web Mercator
const leonExtent = transformExtent(leonCoords, "EPSG:4326", "EPSG:3857");

const inLeon = containsCoordinate(leonExtent, fromLonLat(coordenadas));

if (!inLeon) {
  alert(dato + 'Las coordenadas están fuera de los límites de la ciudad de León, Guanajuato.');
  window.history.back();
} //else {
//   alert('Las coordenadas están fuera de los límites de la ciudad de León, Guanajuato.');
// }
