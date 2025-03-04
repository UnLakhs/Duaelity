import { Tournament } from "@/app/Cosntants/constants";
import clientPromise from "@/app/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  //Search
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || ""; // search term

  //pagination
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const query = search ? { name: { $regex: search, $options: "i" } } : {};

  try {
    const client = await clientPromise;
    const db = client.db("Duaelity");
    const tournaments = db.collection("tournaments");
    const allTournaments = await tournaments
      .find<Tournament>(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json(allTournaments);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tournaments" },
      { status: 500 }
    );
  }
}
