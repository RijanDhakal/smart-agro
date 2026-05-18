export interface User {
  id: string;
  verified?: boolean;
  citizenShip_front?: string | null;
  citizenShip_back?: string | null;
  username: string;
  gmail: string;
  contact: string;
  identity: "user" | "farmer";
  latitude: number | null;
  longitude: number | null;
}
