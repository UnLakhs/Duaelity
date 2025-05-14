// /api/Authentication/SignUp/route.ts

import clientPromise from "@/app/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("Duaelity");
    const users = db.collection("users");

    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await users.findOne({ username });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // Expires in 15 minutes

    // Save user with OTP
    await users.insertOne({
      username: username.trim(),
      email: email.trim(),
      password: hashedPassword,
      isAdmin: false,
      emailVerified: false,
      emailVerification: {
        otp,
        expiresAt: otpExpiry,
      },
    });

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // In your SignUp/route.ts email sending code
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify your email - Duaelity",
      html: `
    <h1>Email Verification</h1>
    <p>Your OTP is: <strong>${otp}</strong></p>
    <p>Or click this link to verify: <a href="${
      process.env.NEXTAUTH_URL
    }/Authentication/VerifyEmail?email=${encodeURIComponent(
        email
      )}">Verify Email</a></p>
    <p>This code will expire in 15 minutes.</p>
  `,
    });

    return NextResponse.json({
      message: "User created. Verification email sent.",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
