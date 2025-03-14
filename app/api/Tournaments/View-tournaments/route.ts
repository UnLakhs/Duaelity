import { Tournament } from "@/app/Cosntants/constants";
import clientPromise from "@/app/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

// Define the query type
interface TournamentQuery {
  name?: { $regex: string; $options: string };
  status?: { $in: string[] };
}

export async function GET(req: NextRequest) {

  // Extract query parameters
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || ""; // Search term
  const status = searchParams.get("status") || ""; // Status filter (e.g., "Upcoming,Ongoing")
  const page = parseInt(searchParams.get("page") || "1"); // Pagination: page number
  const limit = parseInt(searchParams.get("limit") || "20"); // Pagination: items per page
  const skip = (page - 1) * limit; // Calculate skip value for pagination

  // Build the query object
  const query: TournamentQuery = {};

  // Add search filter
  if (search) {
    query.name = { $regex: search, $options: "i" }; // Case-insensitive search
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

    // Calculate status for each tournament and update the database if necessary
    const now = new Date();
    const updatedTournaments = await Promise.all(
      allTournaments.map(async (tournament) => {
        const startDateTime = new Date(`${tournament.startDate}T${tournament.startTime}:00`);
        const endDateTime = new Date(`${tournament.endDate}T23:59:59`); // End of the day

        let calculatedStatus: "upcoming" | "ongoing" | "finished";
        if (now < startDateTime) {
          calculatedStatus = "upcoming";
        } else if (now >= startDateTime && now <= endDateTime) {
          calculatedStatus = "ongoing";
        } else {
          calculatedStatus = "finished";
        }

        // If the calculated status differs from the stored status, update the database
        if (tournament.status !== calculatedStatus) {
          await tournaments.updateOne(
            { _id: tournament._id },
            { $set: { status: calculatedStatus } }
          );
        }

        return { ...tournament, status: calculatedStatus };
      })
    );

    // Filter by status if provided
    const filteredTournaments = status
      ? updatedTournaments.filter((tournament) =>
          status
            .toLowerCase() // Convert filter to lowercase
            .split(",")
            .includes(tournament.status.toLowerCase()) // Convert tournament status to lowercase
        )
      : updatedTournaments;

    // Get total count of filtered tournaments
    const totalCount = filteredTournaments.length;

    return NextResponse.json({ data: filteredTournaments, totalCount });
  } catch (error) {
    console.error("Backend: Error fetching tournaments:", error);
    return NextResponse.json(
      { error: "Failed to fetch tournaments" },
      { status: 500 }
    );
  }
}