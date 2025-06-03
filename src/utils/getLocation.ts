type LocationData = {
  city?: string;
  state?: string;
  country?: string;
};

type CachedLocation = {
  latitude: number;
  longitude: number;
  data: LocationData;
  timestamp: number;
};

let cachedLocation: CachedLocation | null = null;
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // Cache for 1 hour
const SIGNIFICANT_DISTANCE_THRESHOLD = 0.02; // Approx 2.22 km

export const getLocation = async (): Promise<LocationData> => {
  try {
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0, // We need fresh coordinates to check against cache
        });
      }
    );

    const { latitude, longitude } = position.coords;
    const now = Date.now();

    if (cachedLocation) {
      const latDiff = Math.abs(latitude - cachedLocation.latitude);
      const lonDiff = Math.abs(longitude - cachedLocation.longitude);
      const isWithinTimeLimit =
        now - cachedLocation.timestamp < CACHE_EXPIRY_MS;

      if (
        latDiff < SIGNIFICANT_DISTANCE_THRESHOLD &&
        lonDiff < SIGNIFICANT_DISTANCE_THRESHOLD &&
        isWithinTimeLimit
      ) {
        console.log("Returning cached location data.");
        return cachedLocation.data;
      }
    }

    // Use Nominatim API to get location details
    console.log("Fetching new location data.");
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          "User-Agent": "PokeStay Game (Educational Project)",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Nominatim API request failed with status ${response.status}`
      );
    }

    const data = await response.json();

    const locationData: LocationData = {
      city: data.address.city || data.address.town || data.address.village,
      state: data.address.state,
      country: data.address.country,
    };

    // Update cache
    cachedLocation = {
      latitude,
      longitude,
      data: locationData,
      timestamp: now,
    };

    return locationData;
  } catch (error) {
    console.error("Error getting location:", error);
    // If fetching new data fails, but we have a (potentially stale) cached version,
    // we could return it as a fallback, or just return empty.
    // For now, returning empty on any error.
    return {};
  }
};
