import Image from "next/image";
import { Tournament, TournamentPrizes } from "../Cosntants/constants";

const fetchTournaments = async (): Promise<Tournament[]> => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://duaelity-rho.vercel.app";
  try {
    const response = await fetch(`${baseUrl}/api/Tournaments/View-tournaments`);
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
      <div className="lg:ml-32 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-6 place-items-center">
        {tournamentData.map((tournament: Tournament) => (
          <div
            key={tournament.id?.toString()}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full w-full max-w-xs lg:max-w-sm 2xl:max-w-xs"
          >
            <Image
              src="/images/tournament-placeholder.png"
              alt={tournament.name}
              width={280}
              height={120}
              className="rounded-t-lg object-cover"
              priority
            />
            <div className="flex flex-col h-1/2">
              <h2 className="text-xl font-bold text-gray-800 mt-4">
                {tournament.name}
              </h2>
              <p className="text-sm text-gray-500">
              {new Date(tournament.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              {/* <p className="mt-2 font-medium text-gray-700">
                Max Participants: {tournament.maxParticipants}
              </p> */}
              <div className="mt-4 space-y-1 flex-grow">
                {tournament.prizes.map((prize: TournamentPrizes) => (
                  <div key={prize.position} className="text-sm text-gray-700">
                    <span className="font-semibold">
                      Position {prize.position}:
                    </span>{" "}
                    {prize.reward}
                  </div>
                ))}
              </div>
            </div>
            <button className="mt-4 bg-slate-600 text-white px-4 py-2 rounded transition duration-200 hover:bg-slate-700">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default allTournaments;
