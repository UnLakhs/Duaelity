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

      // Construct startDate using date and startTime
      const startDate = new Date(`${tournament.startDate}T${tournament.startTime}:00`);
      
      // Construct endDate as the end of the day (23:59:59.999)
      const endDate = new Date(tournament.endDate);
      endDate.setHours(23, 59, 59, 999);

      console.log("Original Start Date (from DB):", tournament.startDate);
      console.log("Original Start Time (from DB):", tournament.startTime);
      console.log("Constructed Start Date:", startDate);
      console.log("Constructed End Date:", endDate);

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