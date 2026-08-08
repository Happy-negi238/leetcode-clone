import { prisma } from "@/lib/db";
import { getCurrentUserData } from "@/modules/auth/actions";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserData();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const playlists = await prisma.playlist.findMany({
      where: { userId: user?.id },
      include: {
        problems: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                difficulty: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
        { success: true, playlists}
    )
  } catch (error) {
    console.error("Error fetching playlist: ", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch playlist" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserData();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 },
      );
    }

    // Create new playlist
    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        userId: user?.id,
      },
    });

    return NextResponse.json({ success: true, data: playlist });
  } catch (error) {
    console.error("Error creating playlist: ", error);
    return NextResponse.json(
      { success: false, error: "Error creating playlist" },
      { status: 500 },
    );
  }
}
