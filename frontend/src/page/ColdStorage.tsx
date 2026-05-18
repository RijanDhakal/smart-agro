import { Map, Marker } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Home, Warehouse } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUser } from "@/context/UserContext";
import { coldStorages } from "@/config/coldStorage";

const ColdStorage = () => {
  const { user } = useUser();

  const userLocation = {
    latitude: user.latitude || 27.6333,
    longitude: user.longitude || 83.45,
  };

  if (!userLocation)
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading map...
      </div>
    );

  return (
    <div className="w-[calc(100vw-1px)] h-[calc(100vh-1px)]">
      <Map
        initialViewState={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          zoom: 11,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
      >
        <Marker
          longitude={userLocation.longitude}
          latitude={userLocation.latitude}
        >
          <Home className="text-blue-600 w-6 h-6" />
        </Marker>

        {coldStorages.map((storage) => (
          <Marker
            key={storage.id}
            longitude={storage.location.longitude}
            latitude={storage.location.latitude}
          >
            <Popover>
              <PopoverTrigger asChild>
                <Warehouse className="text-green-600 w-5 h-5 cursor-pointer hover:scale-110 transition-transform" />
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="center"
                className="w-52 text-sm p-3 border rounded-lg bg-background shadow-md"
              >
                <p className="font-medium text-foreground">
                  {storage.cold_storage_name}
                </p>
                <p className="text-muted-foreground mt-1">
                  Capacity:{" "}
                  <span className="font-semibold text-foreground">
                    {storage.capacity.used_in_tons}/
                    {storage.capacity.total_in_tons} tons
                  </span>
                </p>
                <p className="text-muted-foreground mt-1">
                  Contact:{" "}
                  <span className="text-foreground">
                    {storage.owner.contact}
                  </span>
                </p>
              </PopoverContent>
            </Popover>
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default ColdStorage;
