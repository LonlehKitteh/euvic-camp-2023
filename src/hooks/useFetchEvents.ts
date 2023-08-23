import { useEffect, useState, useCallback } from "react";
import { useSavedLocations } from "./useSavedLocations";

export const useFetchEvents = ({ category, limit, location, name }: FetchRequest) => {
  const { savedLocations } = useSavedLocations();
  const [events, setEvents] = useState<EventfulEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  const changeEventsDisplay = useCallback((newEventsDisplay: EventfulEvent[]) => {
    setEvents(newEventsDisplay);
  }, []);

  useEffect(() => {
    setLoading(true);

    const categoryString = category ? `category=${category?.toLocaleLowerCase()}` : "";
    const limitString = limit ? `&limit=${limit}` : "";
    const nameString = name ? `&q=${name}` : "";

    const fetchLocation = async (location: string) => {
      const request = name
        ? `https://api.predicthq.com/v1/events?${categoryString}${nameString}`
        : `https://api.predicthq.com/v1/saved-locations/${location}/insights/events?${categoryString}${limitString}`;

      try {
        const response = await fetch(request, {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();
        return { ...data, location_id: location };
      } catch (err) {
        setErr("An error occurred while fetching data.");
        return null; // Return null to indicate an error
      }
    };

    if (!savedLocations) {
      setErr("An error occurred while fetching saved locations.");
      setLoading(false);
      return;
    }

    if (location !== "all") {
      fetchLocation(location)
        .then((data) => setEvents([data]))
        .catch(() => setErr("An error occurred while fetching data"))
        .finally(() => setLoading(false));
      return;
    }

    // Fetch data for all locations
    Promise.all(savedLocations.map((location) => fetchLocation(location.location_id)))
      .then((results) => {
        const filteredResults = results.filter((result) => result !== null);
        setEvents(filteredResults); // Update events array with fetched data
      })
      .catch(() => {
        setErr("An error occurred while fetching data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [savedLocations, category, limit, location]);

  return { events, err, loading, savedLocations, changeEventsDisplay };
};
