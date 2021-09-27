// import OSM from 'ol/source/OSM';
// import TileLayer from 'ol/layer/Tile';
// import {Map, View} from 'ol';
// import {fromLonLat} from 'ol/proj';

// new Map({
//   target: 'map-container',
//   layers: [
//     new TileLayer({
//       source: new OSM(),
//     }),
//   ],
//   view: new View({
//     center: fromLonLat([0, 0]),
//     zoom: 2,
//   }),
// });
import DragAndDrop from 'ol/interaction/DragAndDrop';
import Draw from 'ol/interaction/Draw';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import Modify from 'ol/interaction/Modify';
import Snap from 'ol/interaction/Snap';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {Fill, Stroke, Style} from 'ol/style';

import sync from 'ol-hashed';

const source = new VectorSource();
// const layer = new VectorLayer({
//   source: source,
// });
const layer = new VectorLayer({
  source: source,
  style: new Style({
    fill: new Fill({
      color: 'red',
    }),
    stroke: new Stroke({
      color: 'white',
    }),
  }),
});

const map = new Map({
  target: 'map-container',
  layers: [],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});
map.addLayer(layer);
//https://openlayers.org/workshop/en/vector/drag-n-drop.html
map.addInteraction(
  new DragAndDrop({
    source: source,
    formatConstructors: [GeoJSON],
  })
);
//https://openlayers.org/workshop/en/vector/modify.html
map.addInteraction(
  new Modify({
    source: source,
  })
);
//https://openlayers.org/workshop/en/vector/draw.html
map.addInteraction(
  new Draw({
    type: 'Polygon',
    source: source,
  })
);
//https://openlayers.org/workshop/en/vector/snap.html
map.addInteraction(
  new Snap({
    source: source,
  })
);
//https://openlayers.org/workshop/en/vector/download.html
const clear = document.getElementById('clear');
clear.addEventListener('click', function () {
  source.clear();
});
const format = new GeoJSON({featureProjection: 'EPSG:3857'});
const download = document.getElementById('download');
source.on('change', function () {
  const features = source.getFeatures();
  const json = format.writeFeatures(features);
  download.href =
    'data:application/json;charset=utf-8,' + encodeURIComponent(json);
});

sync(map);
