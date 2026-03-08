import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const family = await prisma.family.findUnique({
    where: { inviteCode: code },
    include: { members: { orderBy: { createdAt: "asc" } } },
  });

  if (!family) {
    return NextResponse.json({ error: "Familia no encontrada" }, { status: 404 });
  }

  return NextResponse.json({
    name: family.name,
    totalSlots: family.totalSlots,
    childrenCount: family.childrenCount,
    groupAttending: family.groupAttending,
    drinkChoice: family.drinkChoice,
    stayOvernight: family.stayOvernight,
    respondedAt: family.respondedAt,
    members: family.members.map((m) => ({
      id: m.id,
      name: m.name,
      isChild: m.isChild,
      attending: m.attending,
    })),
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const family = await prisma.family.findUnique({
    where: { inviteCode: code },
    include: { members: true },
  });

  if (!family) {
    return NextResponse.json({ error: "Familia no encontrada" }, { status: 404 });
  }

  const body = await request.json();
  const { groupAttending, memberAttendance, drinkChoice, stayOvernight } = body;

  // Update family
  await prisma.family.update({
    where: { id: family.id },
    data: {
      groupAttending,
      drinkChoice: groupAttending ? drinkChoice : null,
      stayOvernight: groupAttending ? stayOvernight : null,
      respondedAt: new Date(),
    },
  });

  // Update individual member attendance
  if (memberAttendance && typeof memberAttendance === "object") {
    for (const member of family.members) {
      const attending = memberAttendance[member.id];
      if (typeof attending === "boolean") {
        await prisma.member.update({
          where: { id: member.id },
          data: { attending },
        });
      }
    }
  }

  return NextResponse.json({ success: true });
}
