import Header from "./components/Header";
import TournamentCards from "./components/TournamentCards";
import QuickLinks from "./components/QuickLinks";

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center gap-8 bg-[url('/images/brawlhalla-bg-1.jpg')]">
        <Header />
        <div className="flex sm:gap-4 items-center mt-8 justify-center">
          <QuickLinks link="/tournaments" title="View Tournaments" />
          <QuickLinks link="/tournaments" title="Create an event" />
          <QuickLinks link="/tournaments" title="Join a tournament" />
        </div>
      </div>
      <div className="bg-[#cbcbcb] h-screen">
        <div className=" text-center flex flex-col gap-8">
          <h3 className="text-black text-3xl font-roboto font-semibold">
            Featured tournaments
          </h3>
          <div className="flex gap-4 justify-center items-center">
            <TournamentCards title="Trial of Skibidi" description="Winner gets a skibidi toilet coupon." image="/images/brawlhalla-bg-1.jpg" link="/tournaments/1" />
            <TournamentCards title="Trial of Sigma" description="Are you a TRUE sigma?? Prove it on this tournament of sigma participants." image="/images/brawlhalla-bg-1.jpg" link="/tournaments/1" />
            <TournamentCards title="Trial of Zazahriah" description="Nerf shang tbh." image="/images/brawlhalla-bg-1.jpg" link="/tournaments/1" />
          </div>
        </div>
      </div>
    </>
  );
}
