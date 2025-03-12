import clientPromise from "@/app/lib/mongoDB";
import { NextResponse } from "next/server";

// Helper function to calculate the state of a tournament
const calculateTournamentState = (startDate: Date, endDate: Date) => {
  const currentDate = new Date();
  console.log("Current Date:", currentDate);
  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);

  if (currentDate < startDate) {
    console.log("Status: Upcoming");
    return "upcoming";
  } else if (currentDate >= startDate && currentDate <= endDate) {
    console.log("Status: Ongoing");
    return "ongoing";
  } else {
    console.log("Status: Finished");
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
    console.log(`Found ${allTournaments.length} tournaments to update.`);

    for (const tournament of allTournaments) {
      console.log("\nProcessing Tournament:", tournament.name);
      console.log("Tournament ID:", tournament._id);

      // Convert startDate and endDate to Date objects (if they are stored as strings)
      const startDate = new Date(tournament.startDate);
      const endDate = new Date(tournament.endDate);
      console.log("Original Start Date (from DB):", tournament.startDate);
      console.log("Original End Date (from DB):", tournament.endDate);
      console.log("Parsed Start Date:", startDate);
      console.log("Parsed End Date:", endDate);

      // Calculate the state of the tournament
      const newStatus = calculateTournamentState(startDate, endDate);
      console.log("Calculated Status:", newStatus);

      // Update the tournament status in the database
      await tournaments.updateOne(
        { _id: tournament._id },
        { $set: { status: newStatus } }
      );
      console.log("Updated Tournament Status in DB.");
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