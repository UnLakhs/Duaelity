import Image from "next/image";
import { currencyList, Tournament } from "../Cosntants/constants";

const fetchTournaments = async (): Promise<Tournament[]> => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://duaelity-rho.vercel.app";
  try {
    const response = await fetch(
      `${baseUrl}/api/Tournaments/View-tournaments`,
      {
        next: { revalidate: 60 },
      }
    );
    const data: Tournament[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetching tournamets", error);
    return [];
  }
};
const allTournaments = async () => {
  const tournamentData = await fetchTournaments();

  if (tournamentData.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">No tournaments available at this time.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="lg:ml-32 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 min-[1830px]:grid-cols-5 gap-4 lg:gap-x-24 xl:gap-x-4 p-6">
        {tournamentData.map((tournament: Tournament, index: number) => {
          const currency = currencyList.find(
            (c) => c.code === tournament.currency
          );
          const currencySymbol = currency
            ? currency.symbol
            : tournament.currency; // Default to code if not found

          return (
            <div
              key={tournament.id?.toString() || `tournament-${index}`}
              className="bg-white rounded-lg shadow-md p-3 flex flex-col gap-3 w-[300px] h-full"
            >
              <div className="w-full h-40">
                <Image
                  src={
                    tournament.image
                      ? tournament.image
                      : "/images/tournament-placeholder.png"
                  }
                  alt={tournament.name}
                  width={300}
                  height={300}
                  className="rounded-t-lg w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="flex-1 px-2 py-1">
                <h2
                  title={tournament.name}
                  className="text-lg font-bold text-gray-800 truncate"
                >
                  {tournament.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(tournament.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <div className="mt-1">
                  <p className="text-xs font-semibold text-gray-500">
                    Total Prize Pool
                  </p>
                  <span className="text-2xl font-extrabold text-yellow-500 flex items-center">
                    🏆 {tournament.totalPrizePool}
                    {currencySymbol}
                  </span>
                </div>
              </div>
              <button className="bg-slate-600 text-white px-3 py-2 rounded text-sm hover:bg-slate-700">
                View Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default allTournaments;
