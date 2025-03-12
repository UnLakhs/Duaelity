import clientPromise from "@/app/lib/mongoDB";
import { NextResponse } from "next/server";

//Helper function to calculate the state of a tournament
const calculateTournamentSate = (startDate: Date, endDate: Date) => {
  const currentDate = new Date();
  if (currentDate < startDate) {
    return "upcoming";
  } else if (currentDate >= startDate && currentDate <= endDate) {
    return "ongoing";
  } else {
    return "finished";
  }
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Duaelity");
    const tournaments = db.collection("tournaments");

    // Fetch all tournaments from the database
    const allTournaments = await tournaments.find({}).toArray();

    for (const tournament of allTournaments) {
        // Convert to date because the dates are stored as strings
      const startDate = new Date(tournament.startDate);
      const endDate = new Date(tournament.endDate);

      // Calculate the state of the tournament
      const newStatus = calculateTournamentSate(startDate, endDate);

      await tournaments.updateOne(
        {
          _id: tournament._id,
        },
        { $set: { status: newStatus } }
      );
    }

    return NextResponse.json({ message: "Cron job executed successfully" });
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    return NextResponse.json(
      { error: "Failed to execute cron job" },
      { status: 500 }
    );
  }
}
