"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/shared/Button";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Map, Marker } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

interface LocationPickerProps {
  location: { latitude: number; longitude: number } | null;
  onChange: (latitude: number, longitude: number) => void;
  className?: string;
}

interface GeolocationState {
  loading: boolean;
  error: string | null;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  location,
  onChange,
  className = "",
}) => {
  const [viewState, setViewState] = useState({
    longitude: location?.longitude || 83.4724,
    latitude: location?.latitude || 27.62958,
    zoom: location ? 15 : 6,
  });

  const [geoState, setGeoState] = useState<GeolocationState>({
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (location) {
      setViewState((prev) => ({
        ...prev,
        longitude: location.longitude,
        latitude: location.latitude,
        zoom: Math.max(prev.zoom, 10),
      }));
    }
  }, [location]);

  const handleMapClick = (event: { lngLat: { lng: number; lat: number } }) => {
    const { lng, lat } = event.lngLat;
    onChange(lat, lng);
    toast.success("Location updated");
  };

  const handleMarkerDrag = (event: {
    lngLat: { lng: number; lat: number };
  }) => {
    const { lng, lat } = event.lngLat;
    onChange(lat, lng);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoState({ loading: false, error: "Geolocation not supported" });
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setGeoState({ loading: true, error: null });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onChange(latitude, longitude);
        setViewState((prev) => ({
          ...prev,
          latitude,
          longitude,
          zoom: Math.max(prev.zoom, 12),
        }));
        setGeoState({ loading: false, error: null });
        toast.success("Current location set");
      },
      (error) => {
        const errorMessage =
          error.code === error.PERMISSION_DENIED
            ? "Location permission denied"
            : error.code === error.POSITION_UNAVAILABLE
            ? "Location unavailable"
            : "Location request timeout";

        setGeoState({ loading: false, error: errorMessage });
        toast.error(errorMessage);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const clearLocation = () => {
    onChange(0, 0);
    setViewState({ longitude: 83.4724, latitude: 27.62958, zoom: 6 });
    toast.success("Location cleared");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="text-sm font-medium">Location</label>

      <div className="mt-3 border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
        <div className="h-64 relative">
          <Map
            initialViewState={viewState}
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            onClick={handleMapClick}
            style={{ width: "100%", height: "100%" }}
            mapStyle="https://tiles.openfreemap.org/styles/liberty"
            cursor="crosshair"
          >
            {location && (
              <Marker
                longitude={location.longitude}
                latitude={location.latitude}
                draggable={true}
                onDragEnd={handleMarkerDrag}
              >
                <MapPin className="w-6 h-6 text-primary" />
              </Marker>
            )}
          </Map>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={getCurrentLocation}
          disabled={geoState.loading}
          title={
            geoState.loading ? "Getting location..." : "Get Current Location"
          }
          leftIcon={
            geoState.loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )
          }
        />
        {location && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={clearLocation}
            title="Clear Location"
            leftIcon={<MapPin className="w-4 h-4" />}
          />
        )}
      </div>

      {geoState.error && (
        <p className="text-sm text-destructive">{geoState.error}</p>
      )}
    </div>
  );
};

export default LocationPicker;
