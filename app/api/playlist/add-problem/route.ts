import { prisma } from "@/lib/db";
import { getCurrentUserData } from "@/modules/auth/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserData();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { problemId, playlistId } = await request.json();

    if (!problemId || !playlistId) {
      return NextResponse.json(
        { success: false, error: "ProblemId and playlistId is required" },
        { status: 400 },
      );
    }

    const playlist = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
        userId: user?.id,
      },
    });

    if (!playlist) {
      return NextResponse.json(
        { success: false, error: "Playlist not found or unauthorized" },
        { status: 404 },
      );
    }

    const problemInPlaylist = await prisma.problemInPlaylist.create({
      data: {
        problemId,
        playlistId,
      },
    });

    return NextResponse.json({
      success: true,
      data: problemInPlaylist,
    });
  } catch (error) {
    console.error("Error adding problem to palylist: ", error);
    return NextResponse.json(
      { success: false, error: "Failed to add problem to playlist" },
      { status: 500 },
    );
  }
}
