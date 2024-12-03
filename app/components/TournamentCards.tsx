import Link from "next/link";

interface TournamentCardsProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

const TournamentCards = ({
  title,
  description,
  image,
  link,
}: TournamentCardsProps) => {
  return (
    // Cards
    <div className="flex flex-col gap-2 font-roboto p-4 h-64 sm:h-80 w-2/3 mx-auto sm:w-72 rounded-md bg-white text-black shadow-md">
      {/* Image container */}
      <div className="flex-1 h-32 sm:h-40">
        <Link href={`${link}`}>
          <img
            src={`${image}`}
            alt={`${title}`}
            className="w-full h-full object-cover rounded-md"
          />
        </Link>
      </div>
      {/* Text container */}
      <div className="flex flex-1 flex-col gap-1 mt-2">
        <h3 className="font-bold text-lg sm:text-xl">{title}</h3>
        <p className="text-sm sm:text-base">{description}</p>
      </div>
    </div>
  );
};

export default TournamentCards;
