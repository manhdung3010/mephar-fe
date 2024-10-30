import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { getRouting } from "../../api/trip.service.ts"
import { useRecoilState } from "recoil";
import { vehicalState } from '@/recoil/state';

/**
 * CustomMap component that renders a map with various markers and routes.
 * 
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.isMapFull - Flag to determine if the map should be displayed in full screen.
 * @param {Array} props.tripCustomer - Array of customer trip data.
 * @param {Array} props.nowLocation - Array containing the current location coordinates.
 * @param {number} props.radiusCircle - Radius for the circle around the start marker.
 * @param {React.Ref} ref - Reference to the component.
 * 
 * @returns {JSX.Element} The rendered map component.
 * 
 * @example
 * <CustomMap
 *   isMapFull={true}
 *   tripCustomer={[{ lng: 105.8542, lat: 21.0285, status: 'pending', customer: { code: 'C001', fullName: 'John Doe', phone: '123456789', address: '123 Main St' } }]}
 *   nowLocation={[105.8542, 21.0285]}
 *   radiusCircle={500}
 *   ref={mapRef}
 * />
 * 
 * @function
 * @name CustomMap
 * 
 * @description
 * This component uses the Vietmap GL library to render a map with various markers and routes.
 * It supports adding, updating, and deleting markers, as well as drawing a route based on customer trip data.
 * The map is initialized with a specific style and controls, and it updates dynamically based on the provided props.
 * 
 * @see {@link https://vietmap.vn/} for more information on Vietmap GL.
 */
const CustomMap = forwardRef((props, ref) => {
  const { isMapFull, tripCustomer, nowLocation, radiusCircle, isCheck } = props;

  const [vehical, setVehical] = useRecoilState(vehicalState);

  const [coordinatesRouting, setCoordinatesRouting] = useState([]);
  const [currentPoint, setCurrentPoint] = useState();
  const mapRef = useRef(null);
  const fromMarkerRef = useRef('');
  const endMarkerRef = useRef('');
  const markersRef = useRef([]);

  useEffect(() => {
    loadMap();
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

  useEffect(() => {
    const callRouting = async () => {
      try {
        if (tripCustomer && fromMarkerRef.current && vehical) {
          const currentPoint1 = fromMarkerRef.current.getLngLat();
          const endPoint = endMarkerRef?.current?.getLngLat();
          const markers = markersRef.current.filter((d) => d.status !== "visited").map((item) => item.coordinates)
          const newMarkers = markers?.map((item) => {
            return {
              lat: item[1],
              lng: item[0]
            }
          })
          const listPoint = [currentPoint1, ...newMarkers, endPoint]
          const payload = {
            listPoint: listPoint,
            vehicle: vehical,
          }
          const res = await getRouting(payload);
          if (res?.code === 200) {
            setCoordinatesRouting(res?.data?.paths[0]?.points?.coordinates)
            // reset current point
            // setCurrentPoint(null)
          }
        }
      } catch (error) {
        console.log('error', error)
      }
    }
    callRouting();
  }, [vehical, tripCustomer, currentPoint, endMarkerRef.current, fromMarkerRef.current]);

  useEffect(() => {
    if (coordinatesRouting?.length > 0 && vehical) {
      // addGeojsonLine();
      setTimeout(() => {
        addGeojsonLine();
      }, 1000);
    }
  }, [coordinatesRouting, vehical]);

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

    mapRef.current.addControl(new vietmapgl.NavigationControl(), 'bottom-right');
    mapRef.current.addControl(new vietmapgl.FullscreenControl(), 'bottom-right');

    mapRef.current.on('load', () => {
      if (fromMarkerRef.current) {
        addCircle(fromMarkerRef.current.getLngLat(), radiusCircle);
      }
      // You might want to call addGeojsonLine here if coordinatesRouting is already populated
      if (coordinatesRouting.length > 0) {
        addGeojsonLine();
      }
    });
  };
  const customMarker = (isEnd) => {
    const customMarker = document.createElement("div");
    customMarker.style.width = isEnd ? "32px" : "30px";
    customMarker.style.height = isEnd ? "45px" : "30px";
    customMarker.style.backgroundImage = isEnd ? `url("https://res.cloudinary.com/dvrqupkgg/image/upload/v1721275457/endMarkIcon_ynhvxj.svg")` : `url("https://res.cloudinary.com/dvrqupkgg/image/upload/v1720519213/nowIcon_vk8zqy.png")`;
    customMarker.style.backgroundSize = "cover";
    return customMarker;
  };

  const customCustomerMarker = (customerIndex, customerStatus) => {
    const customMarker = document.createElement("div");
    customMarker.className = "customer-marker";
    customMarker.style.width = "45px";
    customMarker.style.height = "56px";
    if (isCheck) {
      customerStatus === 'active' ? customMarker.style.backgroundImage = 'url("https://res.cloudinary.com/dvrqupkgg/image/upload/v1720695045/markBgSuccessIcon_kf8zj7.svg")' : customerStatus === 'inactive' ? customMarker.style.backgroundImage = 'url("https://res.cloudinary.com/dvrqupkgg/image/upload/v1730108581/Pinlet_Marker_with_Number_mkszqv.svg")' : customMarker.style.backgroundImage = 'url("https://res.cloudinary.com/dvrqupkgg/image/upload/v1730108715/Pinlet_Marker_with_Number_eyk3yr.svg")';
    }
    else {
      if (customerStatus === 'visited') {
        customMarker.style.backgroundImage = 'url("https://res.cloudinary.com/dvrqupkgg/image/upload/v1720695045/markBgSuccessIcon_kf8zj7.svg")'; // Green color
      }
      else {
        customMarker.style.backgroundImage = 'url("https://res.cloudinary.com/dvrqupkgg/image/upload/v1720693956/markBgIcon_ummkoy.svg")';
        customMarker.textContent = customerIndex; // Set the number inside the marker
      }
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

    const marker = new vietmapgl.Marker(customMarker(false))
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
      setCurrentPoint({ lat: coordinates[1], lng: coordinates[0] });
    } else {
      mapRef.current.on('load', () => {
        addCircle(coordinates, radiusCircle);
        setCurrentPoint({ lat: coordinates[1], lng: coordinates[0] });
      });
    }

    // Scroll to the new marker
    mapRef.current.flyTo({
      center: coordinates,
      zoom: 14,
      speed: 1.2,
    });
  };
  const addEndMarker = (coordinates) => {
    const marker = new vietmapgl.Marker(customMarker(true))
      .setLngLat(coordinates)
      .addTo(mapRef.current);
    // clear old marker if exists
    if (endMarkerRef.current) {
      endMarkerRef.current.remove();
    }
    endMarkerRef.current = marker;

    // Scroll to the new marker
    // mapRef.current.flyTo({
    //   center: coordinates,
    //   zoom: 14,
    //   speed: 1.2,
    // });
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
    addMarker(coordinates, customerInfo, customerIndex, isEnd = false) {
      if (customerInfo) {
        createMarker(coordinates, customPopup(customerInfo), customerIndex);
      }
      else if (isEnd) {
        addEndMarker(coordinates);
      }
      else {
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
      markersRef.current[existingMarkerIndex] = { marker, coordinates, index: customerIndex, status: customerStatus };
    } else {
      markersRef.current.push({ marker, coordinates, index: customerIndex, status: customerStatus });
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
    if (!mapRef.current) {
      console.error("Map reference is not available.");
      return;
    }

    if (coordinatesRouting.length === 0) {
      console.error("coordinatesRouting is empty.");
      return;
    }

    if (mapRef.current.isStyleLoaded()) {
      if (mapRef.current.getSource("route")) {
        console.log("Updating existing route source.");
        mapRef.current.getSource("route").setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinatesRouting,
          },
        });
      } else {
        console.log("Adding new route source and layer.");
        mapRef.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coordinatesRouting,
            },
          },
        });

        mapRef.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#6600CC",
            "line-width": 8,
          },
        });
      }
    } else {
      mapRef.current.on("load", () => {
        console.log("Map loaded. Adding new route source and layer.");
        if (mapRef.current.getSource("route")) {
          mapRef.current.removeLayer("route");
          mapRef.current.removeSource("route");
        }
        mapRef.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coordinatesRouting,
            },
          },
        });
        mapRef.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#6600CC",
            "line-width": 8,
          },
        });
      });
      console.log('called')
      // if map is not loaded, then add the line when the map is loaded
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.resize();
      // Ensure the map is loaded before adding the line
      if (mapRef.current.isStyleLoaded() && coordinatesRouting?.length > 0) {
        addGeojsonLine();
      } else {
        mapRef.current.on('load', addGeojsonLine);
      }
    }
  }, [isMapFull, coordinatesRouting, tripCustomer, nowLocation]);

  return <div id="map" className="w-full h-full"></div>;
});

export default CustomMap;
