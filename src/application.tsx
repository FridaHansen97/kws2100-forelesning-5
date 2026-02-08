import React, { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile.js";
import { OSM, WMTS } from "ol/source.js";
import { useGeographic } from "ol/proj.js";

// Styling of OpenLayers components like zoom and pan controls.
// By default, TypeScript doesn't know how to validate CSS files, so we
// add the next line to avoid compilation errors (for a better solution,
// see the reference code for lecture 3)
// @ts-ignore
import "ol/ol.css";
import { Layer } from "ol/layer.js";
import VectorLayer from "ol/layer/Vector.js";
import { GeoJSON, WMTSCapabilities } from "ol/format.js";
import { optionsFromCapabilities } from "ol/source/WMTS.js";
import VectorSource from "ol/source/Vector.js";

// By calling the "useGeographic" function in OpenLayers, we tell that we want coordinates to be in degrees
//  instead of meters, which is the default. Without this `center: [10.6, 59.9]` brings us to "null island"
useGeographic();

const view = new View({ center: [10.9, 59.9], zoom: 12 });
const map = new Map({ view });
const osmLayer = new TileLayer({ source: new OSM() });

const kartverketLayer = new TileLayer();
fetch("https://cache.kartverket.no/v1/wmts/1.0.0/WMTSCapabilities.xml").then(
  async (res) => {
    const parser = new WMTSCapabilities();
    const capabilities = parser.read(await res.text());
    kartverketLayer.setSource(
      new WMTS(
        optionsFromCapabilities(capabilities, {
          layer: "topo",
          matrixSet: "webmercator",
        })!,
      )!,
    );
  },
);

const bydelLayer = new VectorLayer({
  source: new VectorSource({
    url: "/public/bydeler.geojson",
    format: new GeoJSON(),
  }),
});
const skoleLayer = new VectorLayer();

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const [layers, setLayers] = useState<Layer[]>([
    osmLayer,
    kartverketLayer,
    bydelLayer,
    skoleLayer,
  ]);
  useEffect(() => map.setLayers(layers), [layers]);

  useEffect(() => {
    map.setTarget(mapRef.current!);
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      view.animate({ center: [longitude, latitude], zoom: 15 });
    });
  }, []);

  // This is the location (in React) where we want the map to be displayed
  return (
    <>
      <div ref={mapRef}></div>
    </>
  );
}
