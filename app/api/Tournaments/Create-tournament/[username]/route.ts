import clientPromise from "@/app/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const username = (await params).username;
    const client = await clientPromise;
    const db = client.db("Duaelity");
    const tournaments = db.collection("tournaments");
    const users = db.collection("users");

    const {
      tournamentName,
      tournamentDescription,
      tournamentDate,
      tournamentRegistrationDeadline,
      tournamentTime,
      maxParticipants,
      tournamentFormat,
      currency,
      entryFee,
      totalPrizePool,
      prizes,
      tournamentImage,
    } = await request.json();

    // Validate required fields
    if (
      !tournamentName ||
      !tournamentDescription ||
      !tournamentDate ||
      !tournamentRegistrationDeadline ||
      !tournamentTime ||
      !maxParticipants ||
      !tournamentFormat ||
      !currency ||
      !entryFee ||
      !totalPrizePool ||
      !prizes
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the tournament already exists
    const existingTournament = await tournaments.findOne({
      name: tournamentName,
    });

    if (existingTournament) {
      return NextResponse.json(
        { error: "Tournament already exists" },
        { status: 400 }
      );
    }

    // Fetch the user object
    const user = await users.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create the new tournament
    const newTournament = {
      name: tournamentName,
      description: tournamentDescription,
      date: tournamentDate,
      startDate: tournamentDate, // Use tournamentDate as startDate
      endDate: tournamentDate, // Use tournamentDate as endDate
      startTime: tournamentTime, // Use `startTime` instead of `time`
      registrationDeadline: tournamentRegistrationDeadline,
      maxParticipants: Number(maxParticipants),
      participants: [],
      format: tournamentFormat,
      entryFee: Number(entryFee), 
      totalPrizePool: Number(totalPrizePool),
      currency,
      prizes,
      image: tournamentImage,
      status: "upcoming",
      createdBy: user, // Store the full user object
      createdAt: new Date(),
      updatedAt: new Date(),
      game: "Brawlhalla",
      rules: "", // Default to empty string
      chat: [], // Default to empty array
      notifications: [], // Default to empty array
    };

    // Insert the new tournament into the database
    await tournaments.insertOne(newTournament);

    return NextResponse.json({ message: "Tournament created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating tournament:", error);
    return NextResponse.json(
      { error: "Failed to create tournament" },
      { status: 500 }
    );
  }
}