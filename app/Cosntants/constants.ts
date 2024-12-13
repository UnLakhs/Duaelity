export const inputStyles = `text-black shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`;
export const createTournamentInputStyles = `w-full p-3 text-black shadow appearance-none border rounded leading-tight focus:outline-none focus:shadow-outline`;

export type User = {
    username: string;
    password: string;
    email: string;
    isAdmin: boolean;
}