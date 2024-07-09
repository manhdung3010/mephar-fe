import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import NowIcon from '../../assets/nowIcon.png';

const CustomMap = forwardRef((props, ref) => {
  const mapRef = useRef(null);

  const loadMap = () => {
    mapRef.current = new vietmapgl.Map({
      container: "map",
      style:
        "https://maps.vietmap.vn/mt/tm/style.json?apikey=53e31413d7968153044cd0a760cb2a6550590d1fa5213645",
      center: [105.8542, 21.0285],
      zoom: 14,
      pitch: 100,
    });
  };

  const customMarker = () => {
    const customMarker = document.createElement("div");
    customMarker.style.width = "30px";
    customMarker.style.height = "30px";
    customMarker.style.backgroundImage = `url("https://res.cloudinary.com/dvrqupkgg/image/upload/v1720519213/nowIcon_vk8zqy.png")`;
    customMarker.style.backgroundSize = "cover";
    return customMarker;
  };

  const customPopup = (customerInfo) => {
    console.log('customerInfo', customerInfo)
    const startPopupContent = document.createElement("div");
    startPopupContent.innerHTML = `
      <h3>Điểm bắt đầu</h3>
      <p>Đây là điểm bắt đầu của chuyến đi.</p>
    `;
    return startPopupContent;
  };

  useImperativeHandle(ref, () => ({
    addMarker(coordinates, customerInfo, customerPoint) {
      if (customerInfo && customerPoint) {
        createMarker(customerPoint, customPopup(customerInfo));
      }
      else {
        new vietmapgl.Marker(customMarker())
          .setLngLat(coordinates)
          .addTo(mapRef.current);

        // Scroll to the new marker
        mapRef.current.flyTo({
          center: coordinates,
          zoom: 14,
          speed: 1.2,
        });
      }
    },
  }));

  const createMarker = (coordinates, popupHTML) => {
    const popup = new vietmapgl.Popup({ offset: 25 }).setDOMContent(
      popupHTML
    );
    new vietmapgl.Marker()
      .setLngLat(coordinates)
      .setPopup(popup)
      .addTo(mapRef.current);
    // Scroll to the new marker
    mapRef.current.flyTo({
      center: coordinates,
      zoom: 14,
      speed: 1.2,
    });
  };

  const addGeojsonLine = () => {
    mapRef.current.on("load", () => {
      mapRef.current.addSource("route", {
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
      // mapRef.current.addLayer({
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
  };

  useEffect(() => {
    loadMap();
    addGeojsonLine();
  }, []);

  return <div id="map" className="w-full h-full"></div>;
});

export default CustomMap;
