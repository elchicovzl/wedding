import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const families = await prisma.family.findMany({
    include: {
      members: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(families);
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const body = await request.json();
  const { name, members } = body;

  if (!name || !members || !Array.isArray(members) || members.length === 0) {
    return NextResponse.json(
      { error: "Nombre y miembros son requeridos" },
      { status: 400 }
    );
  }

  const childrenCount = members.filter(
    (m: { isChild?: boolean }) => m.isChild
  ).length;

  const family = await prisma.family.create({
    data: {
      name,
      inviteCode: nanoid(8),
      totalSlots: members.length,
      childrenCount,
      members: {
        create: members.map((m: { name: string; isChild?: boolean }) => ({
          name: m.name,
          isChild: m.isChild || false,
        })),
      },
    },
    include: { members: true },
  });

  return NextResponse.json(family, { status: 201 });
}
