import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Lol you are trying to access the API 🤔" }, { status: 200 });
}