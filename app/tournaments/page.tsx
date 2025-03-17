"use client";
import Image from "next/image";
import { currencyList, Tournament, User } from "../Cosntants/constants";
import Search from "../components/Search";
import { useEffect, useState, useCallback } from "react";
import AdminDelete from "../components/AdminDelete";
import FiltersSidebar from "../components/FilterSidebar";
import { FaFilter } from "react-icons/fa";

const fetchTournaments = async (
  searchQuery = "",
  page = 1,
  limit = 20,
  filters: {
    statuses: string[];
    prizePoolRange: { min: number; max: number };
  } = { statuses: [], prizePoolRange: { min: 0, max: Infinity } }
): Promise<{ data: Tournament[]; totalCount: number }> => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://duaelity-rho.vercel.app";
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("search", searchQuery);
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    // Add status filters to the query
    if (filters.statuses.length > 0) {
      queryParams.append("status", filters.statuses.join(","));
    }

    // Add prize pool range filters to the query
    if (
      filters.prizePoolRange.min !== 0 ||
      filters.prizePoolRange.max !== Infinity
    ) {
      queryParams.append("minPrizePool", filters.prizePoolRange.min.toString());
      queryParams.append("maxPrizePool", filters.prizePoolRange.max.toString());
    }

    const response = await fetch(
      `${baseUrl}/api/Tournaments/View-tournaments?${queryParams.toString()}`,
      {
        next: { revalidate: 60 },
        cache: "no-store",
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Frontend: Error fetching tournaments:", error);
    return { data: [], totalCount: 0 };
  }
};

const AllTournaments = () => {
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    string | null
  >(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tournamentData, setTournamentData] = useState<Tournament[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(20);

  // State for filters
  const [filters, setFilters] = useState<{
    statuses: string[];
    prizePoolRange: { min: number; max: number };
  }>({
    statuses: [],
    prizePoolRange: { min: 0, max: Infinity },
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false); // State to manage filter sidebar visibility

  // Fetch data whenever the search query, page, or filter changes
  const fetchData = useCallback(async () => {
    const result = await fetchTournaments(
      searchQuery,
      currentPage,
      limit,
      filters
    );
    setTournamentData(result.data);
    setTotalCount(result.totalCount);
  }, [searchQuery, currentPage, limit, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle filter changes
  const handleFiltersChange = (newFilters: {
    statuses: string[];
    prizePoolRange: { min: number; max: number };
  }) => {
    setFilters(newFilters);
  };

  // Refetch data periodically (e.g., every 5 minutes)
  useEffect(() => {
    const interval = setInterval(fetchData, 5 * 60 * 1000); // 5 minutes
    return () => {
      clearInterval(interval);
    };
  }, [fetchData]);

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/Authentication/Session`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalCount / limit);

  // Range of pages to display in pagination
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

  return (
    <div className="min-h-screen pt-3">
      <div className="flex lg:flex-row flex-col items-center justify-between lg:ml-40 mx-auto mb-6">
        <Search onSearch={(query) => setSearchQuery(query)} />
        <span>ORDER BY WILL BE HERE</span>
      </div>

      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        className="fixed right-4 top-20 z-50 p-3 bg-slate-600 text-white rounded-full shadow-lg hover:bg-slate-700 transition-colors duration-200"
      >
        <FaFilter className="w-6 h-6" /> {/* Use a filter icon */}
      </button>

      {/* Filter Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isFiltersOpen ? "translate-x-0" : "translate-x-full"
        } z-40`}
      >
        <FiltersSidebar onFiltersChange={handleFiltersChange} />
      </div>

      {/* Tournament List */}
      <div className="lg:ml-32 grid sm:grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 min-[1830px]:grid-cols-5 gap-4 lg:gap-x-24 xl:gap-x-4 sm:p-6">
        {tournamentData.length === 0 ? (
          <div className="flex justify-center items-center min-h-screen">
            <p className="text-gray-600">
              No tournaments found. Try searching for another tournament.
            </p>
          </div>
        ) : (
          tournamentData.map((tournament: Tournament, index: number) => {
            const currency = currencyList.find(
              (c) => c.code === tournament.currency
            );
            const currencySymbol = currency
              ? currency.symbol
              : tournament.currency; // Default to code if not found

            return (
              <div
                key={tournament._id?.toString() || `tournament-${index}`}
                className="bg-white rounded-lg shadow-md p-3 flex flex-col gap-3 w-[300px] h-full relative"
              >
                {user?.isAdmin && (
                  <div
                    onClick={() => {
                      setSelectedTournamentId(tournament._id?.toString());
                      setIsDeleteModalOpen(true);
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 rounded-md p-2 cursor-pointer transition-colors duration-200"
                  >
                    <span>X</span>
                  </div>
                )}

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
                    {new Date(tournament.startDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
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
          })
        )}
      </div>

      {/* Pagination Controls */}
      {tournamentData.length > 0 && (
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
      )}

      <AdminDelete
        tournamentId={selectedTournamentId}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTournamentId(null);
        }}
        onSuccess={() => {
          fetchTournaments(searchQuery, currentPage, limit, filters).then(
            (result) => {
              setTournamentData(result.data);
              setTotalCount(result.totalCount);
            }
          );
        }}
      />
    </div>
  );
};

export default AllTournaments;
