import clientPromise from "@/app/lib/mongoDB";
import { NextResponse } from "next/server";

// Helper function to calculate the state of a tournament
const calculateTournamentState = (startDate: Date, endDate: Date) => {
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

      // Construct startDate using date and startTime
      const startDate = new Date(`${tournament.startDate}T${tournament.startTime}:00`);
      
      // Construct endDate as the end of the day (23:59:59.999)
      const endDate = new Date(tournament.endDate);
      endDate.setHours(23, 59, 59, 999);

      // Calculate the state of the tournament
      const newStatus = calculateTournamentState(startDate, endDate);

      // Update the tournament status in the database
      await tournaments.updateOne(
        { _id: tournament._id },
        { $set: { status: newStatus } }
      );
    }

    return NextResponse.json({ message: "Cron job executed successfully" });
  } catch (error) {
    console.error("Error executing cron job:", error);
    return NextResponse.json(
      { error: "Failed to execute cron job" },
      { status: 500 }
    );
  }
}