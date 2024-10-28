//display tile layer
var map = new vietmapgl.Map({
  container: "map",
  style:
    "https://maps.vietmap.vn/mt/tm/style.json?apikey=53e31413d7968153044cd0a760cb2a6550590d1fa5213645", // stylesheet location
  center: [106.68189581514225, 10.764994908339784], // starting position [lng, lat]
  zoom: 13,
  pitch: 90, // starting zoom
});
//add geojson-line to map
map.on("load", function () {
  map.addSource("route", {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [106.7061597962484, 10.770688562901288],
          [106.69057544335796, 10.768747133937572],
          [106.68189581514225, 10.764994908339784],
          [106.67440708752872, 10.757690582434833],
          [106.65985878585263, 10.7548236124389],
        ],
      },
    },
  });
});