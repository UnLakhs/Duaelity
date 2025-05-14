import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongoDB";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Missing token or password" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let payload: any;
    
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      console.error("JWT verification error:", err);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = payload._id;
    const client = await clientPromise;
    const db = client.db("Duaelity");
    const users = db.collection("users");

    const user = await users.findOne({ _id: new ObjectId(userId as string) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await users.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { failedLoginAttempts: "", lockUntil: "" }, // Clear lock status if any
      }
    );

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
