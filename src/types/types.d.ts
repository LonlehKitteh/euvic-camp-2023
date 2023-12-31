interface EventfulEvent {
  count: number;
  results: resultsEvent[];
  location_id: string;
}

interface resultsEvent {
  id: string;
  title: string;
  description: string;
  entities: Entity[];
  place_hierarchies: string[][];
  timezone: string;
  location: [number, number]; // [longitude, latitude]
  start: string; // ISO 8601 date and time format
  end: string; // ISO 8601 date and time format
  duration: number; // Duration in seconds
  category: string;
  labels: string[];
  phq_attendance: number;
  rank: number;
  local_rank: number;
  geo: GeoInfo;
  state: "active" | "canceled" | "ended";
  predicted_event_spend: number;
  predicted_event_spend_industries: { [key: string]: number };
}

interface Entity {
  formatted_address: string;
  type: string;
  name: string;
  labels: string[];
}

interface GeoInfo {
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  placekey: string;
}

type GeoJsonFeature = {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
};

type Place = {
  place_id: number;
  type: string;
  name: string;
  county: string;
  region: string;
  country: string;
  geojson: GeoJsonFeature;
};

type DateRange = {
  type: string;
  start_dt: string;
  end_dt: string;
};

type SummaryInsight = {
  date_range: DateRange;
  phq_attendance_sum: number;
  attended_event_count: number;
  non_attended_event_count: number;
  unscheduled_event_count: number;
};

type CountsType = {
  count: number;
  top_rank: number;
  top_local_rank: number;
  top_aviation_rank: number;
  rank_levels: Record<string, number>;
  local_rank_levels: Record<string, number>;
  aviation_rank_levels: Record<string, number>;
  categories: Record<string, number>;
  labels: Record<string, number>;
};

type SavedLocations = {
  location_id: string;
  create_dt: string;
  update_dt: string;
  enrich_dt: string;
  insights_dt: string;
  user_id: string;
  name: string;
  place_ids: number[];
  formatted_address: string;
  places: Place[];
  summary_insights: SummaryInsight[];
  subscription_valid_types: string[];
  status: string;
};

interface Route {
  component: React.FC;
  url: string;
}

type FetchRequest = {
  category: string;
  limit: number;
  location: string;
  q: string;
  state: "active" | "predicted" | "canceled" | "";
  label: string;
  phq_attendance: {
    gte: number;
    lte: number;
  };
};
