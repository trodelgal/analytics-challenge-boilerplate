export interface Event {
  _id: string;
  session_id: string;
  name: eventName;
  url: string;
  distinct_user_id: string;
  user_name?: string;
  date: number;
  os: os;
  browser: browser;
  geolocation: GeoLocation;
}

export interface Filter {
  sorting?: sorting;
  type?: eventName;
  browser?: browser;
  search?: string;
  offset?: number;
}

export interface weeklyRetentionObject {
  registrationWeek:number;
  newUsers:number;
  weeklyRetention:number[];
  start:string;
  end:string
}

export type eventName = "login" | "signup" | "admin" | "/"| "";
export type os = "windows" | "mac" | "linux" | "ios" | "android" | "other"| "";
export type browser = "chrome" | "safari" | "edge" | "firefox" | "ie" | "other"| "";
export type sorting = "+date" | "-date" | "";
export type GeoLocation = {
  location: Location;
  accuracy: number;
};
export type Location = {
  lat: number;
  lng: number;
};

// export interface RetentionCohort {
//   sorting?: string;
//   type?: string;
//   browser?: string;
//   search?: string;
//   offset?: number;
// }

export interface DaysEvents {
  date: string;
  count: number
}
export interface HoursEvents {
  hour: string | number,
  count: number
  secondCount?:number
}
