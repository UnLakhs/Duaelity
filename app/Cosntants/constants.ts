import { ObjectId } from "mongodb";

export const inputStyles = `text-black shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`;
export const createTournamentInputStyles = `w-full p-3 text-black shadow appearance-none border rounded leading-tight focus:outline-none focus:shadow-outline`;

export const currencyList = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AUD", symbol: "$", name: "Australian Dollar" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar" },
  {code : "CNY", symbol: "¥", name: "Chinese Yuan"},
  {code : "INR", symbol: "₹", name: "Indian Rupee"},
  {code: "CHF", symbol: "₣", name: "Swiss Franc"},
];

export type User = {
  id: ObjectId;
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
  teamName?: string;
};

export interface Tournament {
  _id: ObjectId;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  registrationDeadline: string;
  maxParticipants: number;
  participants: User[];
  format: TournamentFormat;
  entryFee: number;
  currency: string;
  prizes: TournamentPrizes[]; 
  totalPrizePool: number;
  rules: string;
  createdBy: User;
  status: "upcoming" | "ongoing" | "finished";
  chat: Chat[];
  notifications: Notification[];
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  game: string;
}

export interface TournamentFormat {
  tournamentType: "string"; //single elimination, double elimination, round robin, etc.
  rounds: number;
}

export interface TournamentPrizes {
  position: number;
  reward: number | string;
}

export interface Chat {
  user: User;
  message: string;
  timestamp: Date;
}

export interface Notification {
  referenceId: string;
  user: User;
  type:
    | "tournament_update"
    | "tournament_start"
    | "tournament_end"
    | "tournament_canceled"
    | "tournament_created"
    | "new_message"
    | "prize_awarded";
  message: string;
  timestamp: Date;
}
