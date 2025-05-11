// app/api/Authentication/SignIn/route.ts
import clientPromise from "@/app/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@/app/Cosntants/constants";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  try {
     const client = await clientPromise;
    const db = client.db("Duaelity");
    const userCollection = db.collection<User>("users"); // Specify User type

    const user = await userCollection.findOne({ username: username.trim() });
    
    // Handle missing fields safely
    const attempts = user?.failedLoginAttempts ?? 0;
    const lockUntil = user?.lockUntil ?? null;

    // Check if account is locked
    if (lockUntil && new Date(lockUntil) > new Date()) {
      const remainingTime = Math.ceil((new Date(lockUntil).getTime() - Date.now()) / 60000);
      return NextResponse.json(
        { error: `Account locked. Try again in ${remainingTime} minutes.` },
        { status: 423 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Safely increment attempts (handle NaN cases)
      const newAttempts = (isNaN(attempts) ? 0 : attempts) + 1;
      
      const updateData = {
        failedLoginAttempts: newAttempts,
        ...(newAttempts >= MAX_FAILED_ATTEMPTS ? { 
          lockUntil: new Date(Date.now() + LOCK_TIME) 
        } : {})
      };

      await userCollection.updateOne(
        { _id: user._id },
        { $set: updateData }
      );

      const remainingAttempts = MAX_FAILED_ATTEMPTS - newAttempts;
      return NextResponse.json(
        { error: `Invalid credentials. ${remainingAttempts > 0 ? `${remainingAttempts} attempts remaining` : 'Account locked'}` },
        { status: 401 }
      );
    }

    // Reset on successful login
    if (attempts > 0 || lockUntil) {
      await userCollection.updateOne(
        { _id: user._id },
        { $set: { failedLoginAttempts: 0, lockUntil: null } }
      );
    }

    // Generate token (your existing code)
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
        profileImage: user.profileImage,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "4h" }
    );

    const response = NextResponse.json({ success: true });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3600 * 4, // 4 hours
      path: "/",
    });
    return response;

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}