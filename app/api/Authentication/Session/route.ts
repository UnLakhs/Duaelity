// app/api/Authentication/Session/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token || !process.env.JWT_SECRET) {
      return NextResponse.json({ user: null }, { status: 200 }); // Changed to 200
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    return NextResponse.json({ user: decodedToken }, { status: 200 });
  } catch (error) {
    // Clear invalid token
    console.error("Invalid token:", error);
    const response = NextResponse.json({ user: null }, { status: 200 });
    response.cookies.delete("token");
    return response;
  }
}
