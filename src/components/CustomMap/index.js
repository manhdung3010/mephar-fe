import React, { Component } from "react";
// import "../assets/style.css";

class CustomMap extends Component {
  map = null;
  loadMap() {
    this.map = new vietmapgl.Map({
      container: "map",
      style:
        "https://maps.vietmap.vn/mt/tm/style.json?apikey=53e31413d7968153044cd0a760cb2a6550590d1fa5213645", // stylesheet location
      center: [106.68189581514225, 10.764994908339784], // starting position [lng, lat]
      zoom: 14,
      pitch: 100, // starting zoom
    });
  }
  customMarker() {
    // Tạo một phần tử HTML để làm marker tùy chỉnh
    const customMarker = document.createElement('div');
    customMarker.style.width = '30px';
    customMarker.style.height = '30px';
    customMarker.style.backgroundColor = 'red';
    customMarker.style.backgroundSize = 'cover';
    customMarker.style.borderRadius = '50%';
    customMarker.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';

    return customMarker;
  }

  customPopup() {
    const startPopupContent = document.createElement('div');
    startPopupContent.innerHTML = `
      <h3>Điểm bắt đầu</h3>
      <p>Đây là điểm bắt đầu của chuyến đi.</p>
    `;
    return startPopupContent;
  }

  addMarker() {
    //add marker to map
    new vietmapgl.Marker(this.customMarker())
      .setLngLat([106.68189581514225, 10.764994908339784])
      .addTo(this.map);

    // Các điểm bắt đầu và kết thúc
    const start = [106.6297, 10.8231];
    const end = [106.7000, 10.7629];

    // Tạo marker với sự kiện click để hiển thị popup thông tin
    const createMarker = (coordinates, popupHTML) => {
      const popup = new vietmapgl.Popup({ offset: 25 }).setDOMContent(popupHTML);
      new vietmapgl.Marker()
        .setLngLat(coordinates)
        .setPopup(popup) // Gắn popup vào marker
        .addTo(this.map);
    };

    createMarker(start, this.customPopup());
    createMarker(end, this.customPopup());
  }
  addGeojsonLine() {
    var app = this;
    this.map.on("load", function () {
      app.map.addSource("route", {
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
      // app.map.addLayer({
      //   id: "route",
      //   type: "line",
      //   source: "route",
      //   layout: {
      //     "line-join": "round",
      //     "line-cap": "round",
      //   },
      //   paint: {
      //     "line-color": "red",
      //     "line-width": 8,
      //   },
      // });
    });
  }
  componentDidMount() {
    this.loadMap();
    this.addGeojsonLine();
    this.addMarker();
  }
  render() {
    return <div id="map" className='w-full h-full'></div>;
  }
}

export default CustomMap;
