// app/api/Authentication/ResendOTP/route.ts
import clientPromise from "@/app/lib/mongoDB";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("Duaelity");
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Generate new OTP
    const newOtp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update user in database
    const result = await db.collection("users").updateOne(
      { email },
      {
        $set: {
          "emailVerification.otp": newOtp,
          "emailVerification.expiresAt": otpExpiry,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Email not found" },
        { status: 404 }
      );
    }

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your New Verification Code - Duaelity",
      html: `
        <h1 style="color: #2563eb;">New Verification Code</h1>
        <p>Your new OTP is: <strong style="font-size: 1.2rem;">${newOtp}</strong></p>
        <p>This code will expire in 15 minutes.</p>
        <p style="margin-top: 2rem; color: #6b7280;">
          If you didn't request this, please ignore this email.
        </p>
      `,
    });

    return NextResponse.json({ message: "New OTP sent successfully" });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}