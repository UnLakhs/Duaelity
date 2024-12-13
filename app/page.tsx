import Header from "./components/Header";
import TournamentCards from "./components/TournamentCards";
import QuickLinks from "./components/QuickLinks";

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-8 bg-[url('/images/brawlhalla-bg-1.jpg')]">
        <Header />
        <div className="flex sm:flex-row flex-col sm:gap-4 items-center mt-8 justify-center">
          <QuickLinks link="/tournaments" title="View Tournaments" />
          <QuickLinks link="/tournaments/create-tournament" title="Create an event" />
          <QuickLinks link="/tournaments" title="Join a tournament" />
        </div>
      </div>
      <div className="">
        <div className=" text-center flex flex-col gap-8">
          <h3 className="text-black text-3xl font-roboto font-semibold">
            Featured tournaments
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:w-2/3 mx-auto sm:mb-8">
            <TournamentCards title="Trial of Skibidi" description="Winner gets a skibidi toilet coupon." image="/images/brawlhalla-bg-1.jpg" link="/tournaments/1" />
            <TournamentCards title="Trial of Sigma" description="Are you a TRUE sigma?? Prove it on this tournament of sigma participants." image="/images/brawlhalla-bg-1.jpg" link="/tournaments/1" />
            <TournamentCards title="Trial of Zazahriah" description="Nerf shang tbh." image="/images/brawlhalla-bg-1.jpg" link="/tournaments/1" />
          </div>
        </div>
      </div>
    </>
  );
}
