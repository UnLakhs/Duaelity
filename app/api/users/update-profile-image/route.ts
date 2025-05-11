// This route handles the update of a user's profile image in the database.
// It expects a PATCH request with a JSON body containing the userId and imageUrl.
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongoDB";
import { ObjectId } from "mongodb";

export async function PATCH(req: NextRequest) {
  try {
    const { userId, imageUrl } = await req.json();

    if (!userId || !imageUrl) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("Duaelity");
    const users = db.collection("users");

    await users.updateOne(
      { _id: new ObjectId(userId as string) },
      { $set: { profileImage: imageUrl } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update profile image:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
