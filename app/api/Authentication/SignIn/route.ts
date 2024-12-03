import clientPromise from "@/app/lib/mongoDB";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  try {
    const client = await clientPromise;
    const db = client.db("Duaelity");
    const users = db.collection("users");

    const existingUser = await users.findOne({ username });
    if(existingUser) {
        if(existingUser.password === password) {
            return new Response(JSON.stringify({ message: "User logged in successfully!" }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Invalid password" }), { status: 401 });
        }
    } else {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}