import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;

  const family = await prisma.family.findUnique({
    where: { id },
    include: { members: { orderBy: { createdAt: "asc" } } },
  });

  if (!family) {
    return NextResponse.json(
      { error: "Familia no encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(family);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();
  const { name, members } = body;

  const existing = await prisma.family.findUnique({
    where: { id },
    include: { members: true },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Familia no encontrada" },
      { status: 404 }
    );
  }

  // Delete existing members and recreate
  await prisma.member.deleteMany({ where: { familyId: id } });

  const childrenCount = members
    ? members.filter((m: { isChild?: boolean }) => m.isChild).length
    : existing.childrenCount;

  const family = await prisma.family.update({
    where: { id },
    data: {
      name: name || existing.name,
      totalSlots: members ? members.length : existing.totalSlots,
      childrenCount,
      members: members
        ? {
            create: members.map(
              (m: { name: string; isChild?: boolean }) => ({
                name: m.name,
                isChild: m.isChild || false,
              })
            ),
          }
        : undefined,
    },
    include: { members: true },
  });

  return NextResponse.json(family);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;

  await prisma.family.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
