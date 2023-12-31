import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { useFetchEvents } from "../hooks/useFetchEvents";
import { defaultFetchOptions } from "../constants";

interface EventsContextType {
  events: EventfulEvent[];
  loading: boolean;
  savedLocations: SavedLocations[] | null;
  changeEventsDisplay: (newEventsDisplay: EventfulEvent[]) => void;
  reFetchEvents: (newOptions: FetchRequest) => void;
  options: FetchRequest;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

interface EventsProviderProps {
  children: ReactNode;
}

export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const [options, setOptions] = useState<FetchRequest>(defaultFetchOptions);

  const { events, loading, savedLocations, changeEventsDisplay } = useFetchEvents(options);

  useEffect(() => {
    changeEventsDisplay(events);
  }, [events, changeEventsDisplay]);

  const reFetchEvents = useCallback((newOptions: FetchRequest) => {
    setOptions(newOptions);
  }, []);

  const contextValue = {
    events,
    loading,
    savedLocations,
    changeEventsDisplay,
    reFetchEvents,
    options,
  };

  return <EventsContext.Provider value={contextValue}>{children}</EventsContext.Provider>;
};

export const useEventsContext = (): EventsContextType => {
  const context = useContext(EventsContext);
  if (!context) throw new Error("useEventsContext must be used within an EventsProvider");

  return context;
};
