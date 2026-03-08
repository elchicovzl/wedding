import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import InvitationPage from "@/components/invitation/InvitationPage";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const family = await prisma.family.findUnique({
    where: { inviteCode: code },
    include: { members: { orderBy: { createdAt: "asc" } } },
  });

  if (!family) {
    notFound();
  }

  const alreadyResponded = family.respondedAt !== null;

  const membersData = family.members.map((m) => ({
    id: m.id,
    name: m.name,
    isChild: m.isChild,
    attending: m.attending,
  }));

  return (
    <InvitationPage
      familyName={family.name}
      familyCode={family.inviteCode}
      members={membersData}
      alreadyResponded={alreadyResponded}
      previousResponse={
        alreadyResponded
          ? {
              groupAttending: family.groupAttending,
              drinkChoice: family.drinkChoice,
              stayOvernight: family.stayOvernight,
              members: membersData,
            }
          : undefined
      }
    />
  );
}
