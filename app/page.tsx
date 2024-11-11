import Image from "next/image";
import NavBar from "./components/Navbar";
import Header from "./components/Header";
import TournamentCards from "./components/TournamentCards";

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col justify-center gap-8">
        <Header />
        <div className="bg-white text-black text-center mt-20">
          <h3 className="text-3xl font-roboto font-semibold">Featured tournaments</h3>
          <TournamentCards />
        </div>
      </div>
    </>
  );
}
