import clientPromise from "@/app/lib/mongoDB";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

//Deletes tournament
export async function DELETE(req: NextRequest) {
  const { tournamentId } = await req.json();
  try {
    const client = await clientPromise;
    const db = client.db("Duaelity");
    const tournaments = db.collection("tournaments");

    const tournament = await tournaments.findOne({
      _id: new ObjectId(tournamentId as string),
    });
    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 }
      );
    }

    await tournaments.deleteOne({ _id: new ObjectId(tournamentId as string) });
    return NextResponse.json({ message: "Tournament deleted successfully" });
  } catch (error) {
    console.error("Error deleting tournament:", error);
    return NextResponse.json(
      { error: "Failed to Delete tournament" },
      { status: 500 }
    );
  }
}
