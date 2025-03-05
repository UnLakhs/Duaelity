"use client";
import Image from "next/image";
import { currencyList, Tournament } from "../Cosntants/constants";
import Search from "../components/Search";
import { useEffect, useState } from "react";

const fetchTournaments = async (
  searchQuery = "",
  page = 1,
  limit = 20
): Promise<{ data: Tournament[]; totalCount: number }> => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://duaelity-rho.vercel.app";
  try {
    const response = await fetch(
      `${baseUrl}/api/Tournaments/View-tournaments?search=${searchQuery}&page=${page}&limit=${limit}`,
      {
        next: { revalidate: 60 },
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error in fetching tournaments", error);
    return { data: [], totalCount: 0 };
  }
};

const AllTournaments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tournamentData, setTournamentData] = useState<Tournament[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(20); // You can make this configurable if needed

  // Fetch data whenever the search query or page changes
  useEffect(() => {
    fetchTournaments(searchQuery, currentPage, limit).then((result) => {
      setTournamentData(result.data);
      setTotalCount(result.totalCount);
    });
  }, [searchQuery, currentPage, limit]);

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalCount / limit);

  //Calculate the range of pages to display in the pagination
  const getPageRange = () => {
    const range = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      end = Math.min(5, totalPages);
    } else if (currentPage >= totalPages - 2) { 
      start = Math.max(totalPages - 4, 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };


  if (tournamentData.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">No tournaments available at this time.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-3">
      <div className="flex lg:flex-row flex-col items-center justify-between lg:ml-40 mx-auto mb-6">
        <Search onSearch={(query) => setSearchQuery(query)} />
        <span>ORDER BY WILL BE HERE</span>
      </div>
      <div className="lg:ml-32 grid sm:grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 min-[1830px]:grid-cols-5 gap-4 lg:gap-x-24 xl:gap-x-4 sm:p-6">
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

     {/* Pagination Controls */}
      <div className="flex justify-center mt-8 space-x-2 mb-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-slate-500 text-white rounded-lg disabled:bg-slate-300 hover:bg-slate-700 transition-colors duration-200"
        >
          Previous
        </button>

        {/* Display Page Numbers */}
        {getPageRange().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => setCurrentPage(pageNumber)}
            className={`px-4 py-2 ${
              currentPage === pageNumber
                ? "bg-slate-700 text-white"
                : "bg-slate-500 text-white"
            } rounded-lg hover:bg-slate-700 transition-colors duration-200`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 bg-slate-500 text-white rounded-lg disabled:bg-slate-300 hover:bg-slate-700 transition-colors duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllTournaments;
