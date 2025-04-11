import { Tournament } from "@/app/Cosntants/constants";
import clientPromise from "@/app/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

// Define the query type
interface TournamentQuery {
  name?: { $regex: string; $options: string };
  status?: { $in: string[] };
  totalPrizePool?: { $gte: number; $lte: number }; // Add prize pool range filter
}

export async function GET(req: NextRequest) {
  console.log("Backend: Fetching tournaments...");

  // Extract query parameters
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || ""; // Search term
  const status = searchParams.get("status") || ""; // Status filter (e.g., "Upcoming,Ongoing")
  const minPrizePoolParam = searchParams.get("minPrizePool");
  const maxPrizePoolParam = searchParams.get("maxPrizePool");

  const minPrizePool = minPrizePoolParam ? parseFloat(minPrizePoolParam) : 0;
  const maxPrizePool = maxPrizePoolParam
    ? parseFloat(maxPrizePoolParam)
    : Infinity;

  const page = parseInt(searchParams.get("page") || "1"); // Pagination: page number
  const limit = parseInt(searchParams.get("limit") || "20"); // Pagination: items per page
  const skip = (page - 1) * limit; // Calculate skip value for pagination

  console.log(
    `Backend: Search query = "${search}", Status filter = "${status}", ` +
      `Prize Pool Range = ${minPrizePool}-${maxPrizePool}, Page = ${page}, Limit = ${limit}`
  );

  // Build the query object
  const query: TournamentQuery = {};

  // Add search filter
  if (search) {
    query.name = { $regex: search, $options: "i" }; // Case-insensitive search
  }

  // Add status filter
  if (status) {
    query.status = { $in: status.toLowerCase().split(",") }; // Convert to lowercase and split
  }

  // Add prize pool range filter
  const prizePoolFilter: {
    $gte?: number;
    $lte?: number;
  } = {};
  if (minPrizePool > 0) {
    prizePoolFilter.$gte = minPrizePool;
  }
  if (maxPrizePool !== Infinity) {
    prizePoolFilter.$lte = maxPrizePool;
  }

  if (Object.keys(prizePoolFilter).length > 0) {
    query.totalPrizePool = prizePoolFilter as { $gte: number; $lte: number };
  }
  try {
    const client = await clientPromise;
    const db = client.db("Duaelity");
    const tournaments = db.collection("tournaments");

    // Fetch all tournaments matching the search query
    const allTournaments = await tournaments
      .find<Tournament>(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    console.log(`Backend: Fetched ${allTournaments.length} tournaments`);

    // Calculate status for each tournament and update the database if necessary
    const now = new Date(); // Current time in UTC
    console.log("Current Time (UTC):", now.toISOString());

    const updatedTournaments = await Promise.all(
      allTournaments.map(async (tournament) => {
        const startDateTimeLocal = new Date(
          `${tournament.startDate}T${tournament.startTime}:00`
        );
        const startDateTimeUTC = new Date(startDateTimeLocal.toISOString()); // Convert to UTC

        const endDateTimeLocal = new Date(`${tournament.endDate}T23:59:59`);
        const endDateTimeUTC = new Date(endDateTimeLocal.toISOString()); // Convert to UTC

        console.log("Start Date Time (UTC):", startDateTimeUTC.toISOString());
        console.log("End Date Time (UTC):", endDateTimeUTC.toISOString());

        let calculatedStatus: "upcoming" | "ongoing" | "finished";
        if (now < startDateTimeUTC) {
          calculatedStatus = "upcoming";
        } else if (now >= startDateTimeUTC && now <= endDateTimeUTC) {
          calculatedStatus = "ongoing";
        } else {
          calculatedStatus = "finished";
        }

        console.log("Calculated Status:", calculatedStatus);

        // If the calculated status differs from the stored status, update the database
        if (tournament.status !== calculatedStatus) {
          console.log(
            `Backend: Updating status for tournament ${tournament._id} from "${tournament.status}" to "${calculatedStatus}"`
          );
          await tournaments.updateOne(
            { _id: tournament._id },
            { $set: { status: calculatedStatus } }
          );
        }

        return { ...tournament, status: calculatedStatus };
      })
    );

    console.log("Backend: Calculated and updated statuses for tournaments");

    // Filter by status if provided
    const filteredTournaments = status
      ? updatedTournaments.filter(
          (tournament) =>
            status
              .toLowerCase() // Convert filter to lowercase
              .split(",")
              .includes(tournament.status.toLowerCase()) // Convert tournament status to lowercase
        )
      : updatedTournaments;

    console.log(
      `Backend: Filtered to ${filteredTournaments.length} tournaments`
    );

    // Get total count of filtered tournaments
    const totalCount = await tournaments.countDocuments(query);

    return NextResponse.json({ data: filteredTournaments, totalCount });
  } catch (error) {
    console.error("Backend: Error fetching tournaments:", error);
    return NextResponse.json(
      { error: "Failed to fetch tournaments" },
      { status: 500 }
    );
  }
}
