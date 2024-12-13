import clientPromise from "@/app/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

const deleteUser = () => {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
}

export async function POST(request: NextRequest) {
  try {
    let ifUserIsFuckingStupidAndCantUnderstandTheForm;

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
      tournamentImage,
    } = await request.json();


    const existingTournament = await tournaments.findOne({tournamentName});


    
    if(ifUserIsFuckingStupidAndCantUnderstandTheForm){
        deleteUser();
    }



 

    if(existingTournament) {
        return NextResponse.json({ error: "Tournament already exists" }, { status: 400 });
    }
    const newTournament = await tournaments.insertOne({
        name: tournamentName,
        description: tournamentDescription,
        tournamentDate,
        registrationDeadline: tournamentRegistrationDeadline,
        tournamentTime,
        maxParticipants,
        tournamentFormat,
        tournamentImage,
    })

  } catch (error) {
    console.error("Error creating tournament:", error);
    return NextResponse.json(
      { error: "Failed to create tournament" },
      { status: 500 }
    );
  }
}
