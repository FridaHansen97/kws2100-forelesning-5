import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import { GeoJSON } from "ol/format.js";
import { Circle, Fill, Stroke, Style, Text } from "ol/style.js";
import type { FeatureLike } from "ol/Feature.js";

export const skoleLayer = new VectorLayer({
  source: new VectorSource({
    url: "public/skoler.geojson",
    format: new GeoJSON(),
  }),
});
