import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

const CustomMap = forwardRef((props, ref) => {
  const { isMapFull } = props;
  const mapRef = useRef(null);
  const fromMarkerRef = useRef('');
  const markersRef = useRef([]);

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

  const customCustomerMarker = (customerIndex) => {
    const customMarker = document.createElement("div");
    customMarker.className = "customer-marker";
    customMarker.style.width = "30px";
    customMarker.style.height = "30px";
    customMarker.style.backgroundColor = "#007bff"; // Blue color
    customMarker.style.borderRadius = "50% 50% 50% 0";
    customMarker.style.transform = "rotate(-45deg)";
    customMarker.style.display = "flex";
    customMarker.style.justifyContent = "center";
    customMarker.style.alignItems = "center";
    customMarker.style.color = "#fff"; // White text color
    customMarker.style.fontSize = "18px"; // Adjust the font size
    customMarker.style.fontWeight = "bold";
    customMarker.style.lineHeight = "40px"; // Center text vertically
    customMarker.textContent = customerIndex; // Set the number inside the marker
    customMarker.style.borderRadius = "50%"; // Circular shape
    customMarker.style.border = "1px solid white";
    customMarker.style.boxShadow = "0 0 5px rgba(0,0,0,0.5)";

    return customMarker;
  };

  const customPopup = (customerInfo) => {
    const startPopupContent = document.createElement("div");
    startPopupContent.innerHTML = `
      <div class=" flex flex-col gap-1">
        <h3><span class='text-red-main'>${customerInfo?.code}</span> - <span class='font-medium'>${customerInfo?.fullName}</span></h3>
      <p class="flex items-center gap-1 text-[#455468]"><img src='https://res.cloudinary.com/dvrqupkgg/image/upload/v1720587657/phoneIcon_q0kwgi.svg' /> ${customerInfo?.phone}</p>
      <p class="flex items-center gap-1 text-[#455468]"><img src="https://res.cloudinary.com/dvrqupkgg/image/upload/v1720587358/markPng_bv3kg1.png" /> ${customerInfo?.address?.split(",")[0] || ''}</p>
      </div>
    `;
    return startPopupContent;
  };

  useImperativeHandle(ref, () => ({
    addMarker(coordinates, customerInfo, customerIndex) {
      if (customerInfo) {
        createMarker(coordinates, customPopup(customerInfo), customerIndex);
      }
      else {
        const marker = new vietmapgl.Marker(customMarker())
          .setLngLat(coordinates)
          .addTo(mapRef.current);
        // clear old marker if exists
        if (fromMarkerRef.current) {
          fromMarkerRef.current.remove();
        }
        fromMarkerRef.current = marker;

        // Scroll to the new marker
        mapRef.current.flyTo({
          center: coordinates,
          zoom: 14,
          speed: 1.2,
        });
      }
    },
    deleteMarker(coordinates) {
      const markerIndex = markersRef.current.findIndex(({ coordinates: markerCoordinates }) => {
        return markerCoordinates[0] === coordinates[0] && markerCoordinates[1] === coordinates[1];
      });

      if (markerIndex !== -1) {
        markersRef.current[markerIndex].marker.remove();
        markersRef.current.splice(markerIndex, 1);
        updateCustomerIndices();
      }
    },
  }));

  const createMarker = (coordinates, popupHTML, customerIndex) => {
    const popup = new vietmapgl.Popup({ offset: 25 }).setDOMContent(popupHTML);
    const marker = new vietmapgl.Marker(customCustomerMarker(customerIndex))
      .setLngLat(coordinates)
      .setPopup(popup)
      .addTo(mapRef.current);
    // check if customerIndex already exists then update it, otherwise add new marker
    const existingMarkerIndex = markersRef.current.findIndex(({ index }) => index === customerIndex);
    if (existingMarkerIndex !== -1) {
      markersRef.current[existingMarkerIndex].marker.remove();
      markersRef.current[existingMarkerIndex] = { marker, coordinates, index: customerIndex };
    }
    else {
      markersRef.current.push({ marker, coordinates, index: customerIndex });
    }
    updateCustomerIndices();
    // Scroll to the new marker
    mapRef.current.flyTo({
      center: coordinates,
      zoom: 14,
      speed: 1.2,
    });
  };

  const updateCustomerIndices = () => {
    markersRef.current.forEach(({ marker }, index) => {
      const element = marker.getElement();
      element.textContent = index + 1;
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

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.resize();
    }
  }, [isMapFull]);

  return <div id="map" className="w-full h-full"></div>;
});

export default CustomMap;
