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
    // cards
    <div className="flex flex-col gap-2 font-roboto p-4 h-80 w-72 rounded-md bg-white text-black shadow-md">
      {/* image container */}
      <div className="flex-1 h-full">
        <Link href={`${link}`}>
          <img
            src={`${image}`}
            alt={`${title}`}
            className="w-full h-full object-cover sm:object-contain"
          />
        </Link>
      </div>
      {/* Text container */}
      <div className="flex flex-1 flex-col gap-2 h-full">
        <h3 className="font-bold text-xl">{title}</h3>
        <span>{description}</span>
      </div>
    </div>
  );
};

export default TournamentCards;
