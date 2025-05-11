// app/api/Authentication/ChangePassword/route.ts
import clientPromise from "@/app/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

export async function PUT(request: NextRequest) {
  try {
    const { userId, currentPassword, newPassword } = await request.json();

    // Validate input
    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("Duaelity");
    const userCollection = db.collection("users");

    // Find user
    const user = await userCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,  
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await userCollection.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
