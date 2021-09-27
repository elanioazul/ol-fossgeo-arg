import GeoTIFF from 'ol/source/GeoTIFF.js';
import Map from 'ol/Map.js';
import Projection from 'ol/proj/Projection.js';
import TileLayer from 'ol/layer/WebGLTile.js';
import View from 'ol/View.js';
import colormap from 'colormap';
import {getCenter} from 'ol/extent.js';

const projection = new Projection({
  code: 'EPSG:32721',
  units: 'm',
});

// metadata from https://s3.us-west-2.amazonaws.com/sentinel-cogs/sentinel-s2-l2a-cogs/21/H/UB/2021/9/S2B_21HUB_20210915_0_L2A/S2B_21HUB_20210915_0_L2A.json
const sourceExtent = [300000, 6090260, 409760, 6200020];

const source = new GeoTIFF({
  sources: [
    {
      // red reflectance
      url: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/21/H/UB/2021/9/S2B_21HUB_20210915_0_L2A/B04.tif',
      max: 10000,
    },
    {
      // near-infrared reflectance
      url: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/21/H/UB/2021/9/S2B_21HUB_20210915_0_L2A/B08.tif',
      max: 10000,
    },
  ],
});

// near-infrared is the second band from above
const nir = ['band', 2];

// near-infrared is the first band from above
const red = ['band', 1];

const difference = ['-', nir, red];
const sum = ['+', nir, red];

const ndvi = ['/', difference, sum];

const layer = new TileLayer({
  source: source,
  style: {
    color: [
      'interpolate',
      ['linear'],
      ndvi,
      // color ramp for NDVI values
      ...getColorStops('earth', -0.5, 1, 10, true),
    ],
  },
});

function getColorStops(name, min, max, steps, reverse) {
  const delta = (max - min) / (steps - 1);
  const stops = new Array(steps * 2);
  const colors = colormap({colormap: name, nshades: steps, format: 'rgba'});
  if (reverse) {
    colors.reverse();
  }
  for (let i = 0; i < steps; i++) {
    stops[i * 2] = min + i * delta;
    stops[i * 2 + 1] = colors[i];
  }
  return stops;
}

new Map({
  target: 'map-container',
  layers: [layer],
  view: new View({
    projection: projection,
    center: getCenter(sourceExtent),
    extent: sourceExtent,
    zoom: 10,
  }),
});
