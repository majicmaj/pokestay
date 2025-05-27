type LocationData = {
  city?: string;
  state?: string;
  country?: string;
};

export const getLocation = async (): Promise<LocationData> => {
  try {
    // Get user's coordinates
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    );

    const { latitude, longitude } = position.coords;

    // Use Nominatim API to get location details
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          "User-Agent": "PokeStay Game (Educational Project)",
        },
      }
    );

    const data = await response.json();

    return {
      city: data.address.city || data.address.town || data.address.village,
      state: data.address.state,
      country: data.address.country,
    };
  } catch (error) {
    console.error("Error getting location:", error);
    return {};
  }
};
