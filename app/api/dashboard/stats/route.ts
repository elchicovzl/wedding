import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const families = await prisma.family.findMany({
    include: { members: true },
  });

  const totalFamilies = families.length;
  const totalMembers = families.reduce((acc, f) => acc + f.members.length, 0);
  const totalChildren = families.reduce((acc, f) => acc + f.childrenCount, 0);
  const totalAdults = totalMembers - totalChildren;

  const responded = families.filter((f) => f.respondedAt !== null);
  const confirmed = families.filter((f) => f.groupAttending === true);
  const declined = families.filter((f) => f.groupAttending === false);
  const pending = families.filter((f) => f.respondedAt === null);

  const confirmedMembers = confirmed.reduce(
    (acc, f) => acc + f.members.filter((m) => m.attending === true).length,
    0
  );

  const stayingOvernight = confirmed.filter(
    (f) => f.stayOvernight === true
  ).length;
  const notStaying = confirmed.filter(
    (f) => f.stayOvernight === false
  ).length;

  // Drink distribution
  const drinkCounts: Record<string, number> = {};
  confirmed.forEach((f) => {
    if (f.drinkChoice) {
      drinkCounts[f.drinkChoice] = (drinkCounts[f.drinkChoice] || 0) + 1;
    }
  });

  // Recent responses
  const recentResponses = families
    .filter((f) => f.respondedAt)
    .sort(
      (a, b) =>
        new Date(b.respondedAt!).getTime() -
        new Date(a.respondedAt!).getTime()
    )
    .slice(0, 10)
    .map((f) => ({
      name: f.name,
      groupAttending: f.groupAttending,
      drinkChoice: f.drinkChoice,
      stayOvernight: f.stayOvernight,
      respondedAt: f.respondedAt,
      confirmedCount: f.members.filter((m) => m.attending === true).length,
      totalMembers: f.members.length,
    }));

  return NextResponse.json({
    totalFamilies,
    totalMembers,
    totalAdults,
    totalChildren,
    respondedCount: responded.length,
    confirmedFamilies: confirmed.length,
    confirmedMembers,
    declinedFamilies: declined.length,
    pendingFamilies: pending.length,
    stayingOvernight,
    notStaying,
    drinkCounts,
    recentResponses,
  });
}
