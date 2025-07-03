import { ReactNode, useEffect, useState } from "react";
import { getLocation } from "../utils/getLocation";
import { LocationContext, LocationContextType } from "./LocationContext";

type LocationProviderProps = {
  children: ReactNode;
};

const LocationProvider = ({ children }: LocationProviderProps) => {
  const [location, setLocation] =
    useState<LocationContextType["location"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);
      try {
        const locationData = await getLocation();
        setLocation(locationData);
      } catch (error) {
        console.error("Failed to fetch location:", error);
        setLocation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, loading }}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationProvider;
