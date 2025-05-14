// app/api/Authentication/ForgotPassword/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongoDB";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("Duaelity");
    const users = db.collection("users");

    const user = await users.findOne({ email: email.trim() });

    if (!user) {
      return NextResponse.json(
        { message: "If this email is registered, a reset link will be sent." },
        { status: 200 }
      );
    }

    // Generate short-lived JWT (e.g., 15 mins)
    const resetToken = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/Authentication/ResetPassword?token=${resetToken}`;

    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Duaelity Password Reset",
      html: `
        <p>You requested a password reset.</p>
        <p><a href="${resetUrl}">Click here to reset your password</a></p>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    return NextResponse.json({
      message: "If this email is registered, a reset link will be sent.",
    });
  } catch (error) {
    console.error("ForgotPassword Error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
