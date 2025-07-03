import { ReactNode, createContext, useEffect, useState } from "react";
import { LocationData } from "../types";
import { getLocation } from "../utils/getLocation";

type LocationContextType = {
  location: LocationData | null;
  loading: boolean;
};

export const LocationContext = createContext<LocationContextType>({
  location: null,
  loading: true,
});

type LocationProviderProps = {
  children: ReactNode;
};

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [location, setLocation] = useState<LocationData | null>(null);
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
