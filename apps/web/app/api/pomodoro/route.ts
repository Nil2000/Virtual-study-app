import { auth } from "@lib/auth";
import { db } from "@lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return new Response(null, { status: 401 });
    }

    const { createdTime, endTime } = await req.json();

    await db.pomodoroSession.create({
      data: {
        userId: session.user.id!,
        createdAt: new Date(createdTime),
        duration: endTime - createdTime,
      },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
