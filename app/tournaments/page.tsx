import Image from "next/image";
import { Tournament } from "../Cosntants/constants";

const fetchTournaments = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/Tournaments/View-tournaments`
    );
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Error in fetching tournamets", error);
  }
};
const allTournaments = async () => {
  const tournamentData = await fetchTournaments();
  return (
    <div className="flex flex-wrap justify-center gap-6 p-6 bg-gray-100 min-h-screen">
      {tournamentData.map((tournament: Tournament) => (
        <div
          key={tournament.id}
          className="bg-white rounded-lg shadow-md p-4 w-80"
        >
          <Image
            src="/images/tournament-placeholder.png"
            alt={tournament.name}
            width={320}
            height={180}
            className="rounded-t-lg object-cover"
          />
          <h2 className="text-xl font-bold text-gray-800 mt-4">
            {tournament.name}
          </h2>
          <p className="text-sm text-gray-500">{tournament.date}</p>
          <p className="mt-2 text-gray-600">{tournament.description}</p>
          <p className="mt-2 font-medium text-gray-700">
            Max Participants: {tournament.maxParticipants}
          </p>
          <div className="mt-4 space-y-1">
            {tournament.prizes.map((prize: any) => (
              <div key={prize.position} className="text-sm text-gray-700">
                <span className="font-semibold">
                  Position {prize.position}:
                </span>{" "}
                {prize.reward}
              </div>
            ))}
          </div>
          <button className="mt-4 bg-slate-600 text-white px-4 py-2 rounded transition duration-200 hover:bg-slate-700">
            View Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default allTournaments;
