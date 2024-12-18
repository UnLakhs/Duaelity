import clientPromise from "@/app/lib/mongoDB";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Duaelity");
    const tournaments = db.collection("tournaments");
    const allTournaments = await tournaments.find().toArray();

    return NextResponse.json(allTournaments);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tournaments" },
      { status: 500 }
    );
  }
}
