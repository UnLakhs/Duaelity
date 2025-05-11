// app/api/Authentication/SignOut/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  );
  
  // Clear the token cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  
  return response;
}