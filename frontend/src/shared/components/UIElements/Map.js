import { useRef, useEffect, useState } from "react";
import "./Map.css";

const Map = (props) => {
  const mapRef = useRef();
  const mapInstance = useRef();
  const markerInstance = useRef();
  const [isMounted, setIsMounted] = useState(true);
  const { center, zoom, title } = props;

  useEffect(() => {
    setIsMounted(true);

    // Wait for Google Maps to be available
    const initializeMap = () => {
      if (
        !window.google ||
        !window.google.maps ||
        !mapRef.current ||
        !isMounted
      ) {
        return;
      }

      try {
        // Clean up previous instances
        if (mapInstance.current) {
          window.google.maps.event.clearInstanceListeners(mapInstance.current);
        }
        if (markerInstance.current) {
          markerInstance.current.setMap(null);
        }

        // Create new map
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: center,
          zoom: zoom || 8,
        });

        markerInstance.current = new window.google.maps.Marker({
          position: center,
          map: mapInstance.current,
          title: title,
        });
      } catch (error) {
        console.error("Map initialization error:", error);
      }
    };

    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      // Wait for Google Maps to load
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMaps);
          initializeMap();
        }
      }, 100);

      return () => clearInterval(checkGoogleMaps);
    }

    return () => {
      setIsMounted(false);
      if (mapInstance.current) {
        try {
          window.google.maps.event.clearInstanceListeners(mapInstance.current);
        } catch (error) {
          console.error("Error clearing map listeners:", error);
        }
      }
      if (markerInstance.current) {
        try {
          markerInstance.current.setMap(null);
        } catch (error) {
          console.error("Error removing marker:", error);
        }
      }
    };
  }, [center, zoom, title, isMounted]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    />
  );
};

export default Map;
