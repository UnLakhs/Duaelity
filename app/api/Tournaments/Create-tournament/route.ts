import clientPromise from "@/app/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("Duaelity");
    const tournaments = db.collection("tournaments");
    const {
      tournamentName,
      tournamentDescription,
      tournamentDate,
      tournamentRegistrationDeadline,
      tournamentTime,
      maxParticipants,
      tournamentFormat,
      entryFee,
      prizes,
      tournamentImage,
    } = await request.json();

    const existingTournament = await tournaments.findOne({
      name: tournamentName,
    });

    if (existingTournament) {
      return NextResponse.json(
        { error: "Tournament already exists" },
        { status: 400 }
      );
    }
    const newTournament = {
      name: tournamentName,
      description: tournamentDescription,
      date: tournamentDate,
      registrationDeadline: tournamentRegistrationDeadline,
      time: tournamentTime,
      maxParticipants: Number(maxParticipants),
      participants: [],
      format: tournamentFormat,
      entryFee,
      prizes,
      image: tournamentImage,
      status: "upcoming",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await tournaments.insertOne(newTournament);

    return NextResponse.json({message: "Tournament created successfully"}, { status: 201 });  
  } catch (error) {
    console.error("Error creating tournament:", error);
    return NextResponse.json(
      { error: "Failed to create tournament" },
      { status: 500 }
    );
  }
}
