// app/api/Authentication/VerifyEmail/route.ts
import clientPromise from "@/app/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("Duaelity");
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const user = await db.collection("users").findOne({ email });

    if (!user?.emailVerification) {
      return NextResponse.json(
        { error: "Email not found or OTP not generated" },
        { status: 404 }
      );
    }

    const { otp: storedOtp, expiresAt } = user.emailVerification;

    if (otp !== storedOtp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (new Date() > new Date(expiresAt)) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    await db.collection("users").updateOne(
      { email },
      {
        $set: { emailVerified: true },
        $unset: { emailVerification: "" },
      }
    );

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}