import Image from "next/image";

const fetchTournaments = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/Tournaments/View-tournaments`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetching tournamets", error);
  }
};
const allTournaments = async () => {
  const tournamentData = await fetchTournaments();
  return (
    <div className="flex items-center flex-col min-h-screen ">
        <div className="w-full h-72 relative">
        <Image src={`/images/elden-ring-bg-2.jpg`} className="grayscale" alt="Background" layout="fill" objectFit="cover" />
        </div>
      <h1>All Tournaments</h1>
    </div>
  );
};

export default allTournaments;
