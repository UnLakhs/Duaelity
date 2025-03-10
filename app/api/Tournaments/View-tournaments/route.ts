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

  // Add status filter (only if statuses are selected)
  if (status) {
    const statuses = status.split(",").map((s) => s.toLowerCase()); // Split statuses into an array (e.g., ["Upcoming", "Ongoing"]) and then convert to lowercase
    if (statuses.length > 0) {
      query.status = { $in: statuses }; // Match tournaments with any of the selected statuses
    }
  }

  try {
    const client = await clientPromise;
    const db = client.db("Duaelity");
    const tournaments = db.collection("tournaments");

    // Get total count of tournaments matching the query
    const totalCount = await tournaments.countDocuments(query);

    // Fetch tournaments with pagination
    const allTournaments = await tournaments
      .find<Tournament>(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({ data: allTournaments, totalCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tournaments" },
      { status: 500 }
    );
  }
}