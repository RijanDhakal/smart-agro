// export const API_BASE_URL = "https://l2vl5st5-3000.inc1.devtunnels.ms/api/v1";
// export const API_BASE_URL = "https://5d133c495126.ngrok-free.app/api/v1";
export const API_BASE_URL = "http://localhost:3000/api/v1";

export interface UserApiResponse {
  statusCode: number;
  data: {
    userId?: string;
    farmerID?: string;
    username: string;
    contact: number;
    address?: string;
    gmail: string;
    verified: boolean;
    citizenShip_front: string | null;
    citizenShip_back: string | null;
  };
  message: string;
}

export interface VoiceApiResponse {
  statusCode: number;
  data: {
    description: string;
    name: {
      english: string;
      nepali: string;
    };
    expectedLifeSpan: string;
    price: {
      value: string;
      unit: string;
    };
    quantity: {
      value: string;
      unit: string;
    };
  };
  message: string;
}
