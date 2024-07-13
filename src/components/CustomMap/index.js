import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

const CustomMap = forwardRef((props, ref) => {
  const { isMapFull, tripCustomer, nowLocation, radiusCircle } = props;
  const mapRef = useRef(null);
  const fromMarkerRef = useRef('');
  const markersRef = useRef([]);

  useEffect(() => {
    loadMap();
    addGeojsonLine();
  }, [tripCustomer]);

  useEffect(() => {
    if (nowLocation?.length > 0) {
      addStartMarker(nowLocation);
    }
    if (tripCustomer?.length > 0) {
      tripCustomer.forEach((customer, index) => {
        const coordinates = [+customer?.lng, +customer?.lat];
        createMarker(coordinates, customPopup(customer), customer?.stt || index + 1, customer?.status);
      });
    }
  }, [tripCustomer, nowLocation]);

  const loadMap = () => {
    mapRef.current = new vietmapgl.Map({
      container: "map",
      style:
        "https://maps.vietmap.vn/mt/tm/style.json?apikey=53e31413d7968153044cd0a760cb2a6550590d1fa5213645",
      center: [105.8542, 21.0285],
      zoom: 14,
      pitch: 0, // Set pitch to 0 for flat display
      bearing: 0, // Set bearing to 0 for no rotation
    });

    // Add navigation control at the top-left position
    mapRef.current.addControl(new vietmapgl.NavigationControl(), 'bottom-right');

    mapRef.current.on('load', () => {
      // Map is fully loaded
      if (fromMarkerRef.current) {
        addCircle(fromMarkerRef.current.getLngLat(), radiusCircle);
      }
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

  const customCustomerMarker = (customerIndex, customerStatus) => {
    const customMarker = document.createElement("div");
    customMarker.className = "customer-marker";
    customMarker.style.width = "45px";
    customMarker.style.height = "56px";
    if (customerStatus === 'visited') {
      customMarker.style.backgroundImage = 'url("https://res.cloudinary.com/dvrqupkgg/image/upload/v1720695045/markBgSuccessIcon_kf8zj7.svg")'; // Green color
    }
    else {
      customMarker.style.backgroundImage = 'url("https://res.cloudinary.com/dvrqupkgg/image/upload/v1720693956/markBgIcon_ummkoy.svg")';
      customMarker.textContent = customerIndex; // Set the number inside the marker
    }
    customMarker.style.lineHeight = "56px";
    customMarker.style.backgroundSize = "cover"; // White border
    customMarker.style.display = "flex";
    customMarker.style.justifyContent = "center";
    customMarker.style.alignItems = "center";
    customMarker.style.color = "#fff"; // White text color
    customMarker.style.fontSize = "22px"; // Adjust the font size
    customMarker.style.fontWeight = "bold";

    return customMarker;
  };

  const customPopup = (customerInfo) => {
    const customerInfoNew = customerInfo?.customer || customerInfo;
    const startPopupContent = document.createElement("div");
    startPopupContent.innerHTML = `
      <div class="flex flex-col gap-1">
        <h3><span class='text-red-main'>${customerInfoNew?.code}</span> - <span class='font-medium'>${customerInfoNew?.fullName}</span></h3>
        <p class="flex items-center gap-1 text-[#455468]"><img src='https://res.cloudinary.com/dvrqupkgg/image/upload/v1720587657/phoneIcon_q0kwgi.svg' /> ${customerInfoNew?.phone}</p>
        <p class="flex items-center gap-1 text-[#455468]"><img src="https://res.cloudinary.com/dvrqupkgg/image/upload/v1720587358/markPng_bv3kg1.png" /> ${customerInfoNew?.address?.split(",")[0] || customerInfo?.address?.split(",")[0] || ''
      }</p>
      </div>
    `;
    return startPopupContent;
  };

  const addStartMarker = (coordinates) => {
    const marker = new vietmapgl.Marker(customMarker())
      .setLngLat(coordinates)
      .addTo(mapRef.current);
    // clear old marker if exists
    if (fromMarkerRef.current) {
      fromMarkerRef.current.remove();
    }
    fromMarkerRef.current = marker;

    // Add circle with a specific radius (e.g., 500 meters)
    if (mapRef.current.isStyleLoaded()) {
      addCircle(coordinates, radiusCircle);
    } else {
      mapRef.current.on('load', () => {
        addCircle(coordinates, radiusCircle);
      });
    }

    // Scroll to the new marker
    mapRef.current.flyTo({
      center: coordinates,
      zoom: 14,
      speed: 1.2,
    });
  };

  const addCircle = (center, radius) => {
    if (mapRef.current.getSource('circle')) {
      mapRef.current.removeLayer('circle-layer');
      mapRef.current.removeSource('circle');
    }
    mapRef.current.addSource('circle', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [createGeoJSONCircle(center, radius)]
        }
      }
    });

    mapRef.current.addLayer({
      id: 'circle-layer',
      type: 'fill',
      source: 'circle',
      paint: {
        'fill-color': '#EA352B',
        'fill-opacity': 0.1,
      }
    });
  };

  const createGeoJSONCircle = (center, radiusInMeters, points = 64) => {
    const coords = {
      latitude: center[1],
      longitude: center[0]
    };

    const km = radiusInMeters / 1000;

    const ret = [];
    const distanceX = km / (111.32 * Math.cos(coords.latitude * Math.PI / 180));
    const distanceY = km / 110.574;

    let theta, x, y;
    for (let i = 0; i < points; i++) {
      theta = (i / points) * (2 * Math.PI);
      x = distanceX * Math.cos(theta);
      y = distanceY * Math.sin(theta);

      ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);

    return ret;
  };

  useImperativeHandle(ref, () => ({
    addMarker(coordinates, customerInfo, customerIndex) {
      if (customerInfo) {
        createMarker(coordinates, customPopup(customerInfo), customerIndex);
      } else {
        addStartMarker(coordinates);
      }
    },
    updateMarker(coordinates, customerInfo, customerIndex) {
      const existingMarkerIndex = markersRef.current.findIndex(({ index }) => index === customerIndex);
      if (existingMarkerIndex !== -1) {
        markersRef.current[existingMarkerIndex].marker.remove();
        createMarker(coordinates, customPopup(customerInfo), customerIndex);
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

  const createMarker = (coordinates, popupHTML, customerIndex, customerStatus) => {
    const popup = new vietmapgl.Popup({ offset: 25 }).setDOMContent(popupHTML);
    const marker = new vietmapgl.Marker(customCustomerMarker(customerIndex, customerStatus))
      .setLngLat(coordinates)
      .setPopup(popup)
      .addTo(mapRef.current);
    // check if customerIndex already exists then update it, otherwise add new marker
    const existingMarkerIndex = markersRef.current.findIndex(({ index }) => index === customerIndex);
    if (existingMarkerIndex !== -1) {
      markersRef.current[existingMarkerIndex].marker.remove();
      markersRef.current[existingMarkerIndex] = { marker, coordinates, index: customerIndex };
    } else {
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
    });
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.resize();
    }
  }, [isMapFull]);

  return <div id="map" className="w-full h-full"></div>;
});

export default CustomMap;
