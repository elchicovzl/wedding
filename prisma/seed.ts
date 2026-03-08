import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

const families = [
  { name: "Familia Jaramillo - Quiroga", totalSlots: 4, childrenCount: 1, members: ["Sr. Alberto Jaramillo", "Sra. Maria Marleny Quiroga", "Sra. Barbara Peña", { name: "Valentina Jaramillo", isChild: true }] },
  { name: "Familia Jaramillo - Escudero", totalSlots: 2, childrenCount: 0, members: ["Sr. Fabian Jaramillo", "Sra. Vanessa Escudero"] },
  { name: "Familia Mojica - Jaramillo", totalSlots: 3, childrenCount: 1, members: ["Sr. Pedro Mojica", "Sra. Catalina Jaramillo", { name: "Elizabeth Mojica", isChild: true }] },
  { name: "Familia Asbury", totalSlots: 3, childrenCount: 1, members: ["Sr. Michael Asbury", "Sra. Jennifer Asbury", { name: "Luca Asbury", isChild: true }] },
  { name: "Familia Gomez - Tuttle", totalSlots: 4, childrenCount: 2, members: ["Sr. Yered Tuttle", "Sra. Maira Tuttle", { name: "Aliana Tuttle", isChild: true }, { name: "Julian Tuttle", isChild: true }] },
  { name: "Familia Huasco - Rua", totalSlots: 3, childrenCount: 1, members: ["Sr. Julio Huasco", "Sra. Adriana Rua", { name: "Salome Agudelo", isChild: true }] },
  { name: "Familia Garcia", totalSlots: 2, childrenCount: 0, members: ["Sr. Alfredo Garcia", "Sra. Josefina Garcia"] },
  { name: "Familia Gomez - Jaramillo", totalSlots: 2, childrenCount: 0, members: ["Sr. Alberto Gomez", "Sra. Alicia Jaramillo"] },
  { name: "Familia Tío Alberto", totalSlots: 2, childrenCount: 1, members: ["Sr. Rosmiro Gomez", { name: "Sobrina", isChild: true }] },
  { name: "Zuleny Pernalete", totalSlots: 1, childrenCount: 0, members: ["Sra. Zuleny Pernalete"] },
  { name: "Familia Mejia - Gutierrez", totalSlots: 3, childrenCount: 1, members: ["Sr. Fawer Mejia", "Sra. Jackeline Gutierrez", { name: "Gabriela Mejia", isChild: true }] },
  { name: "Tatiana Gomez", totalSlots: 1, childrenCount: 0, members: ["Srta. Tatiana Gomez"] },
  { name: "Familia Rendon - Gutierrez", totalSlots: 2, childrenCount: 0, members: ["Sr. Hernan Gutierrez", "Sra. Ivon Rendon"] },
  { name: "Familia Gutierrez", totalSlots: 2, childrenCount: 0, members: ["Sr. Javier Gutierrez", "Sra. Nancy Gutierrez"] },
  { name: "Familia Gutierrez - Muñoz", totalSlots: 2, childrenCount: 0, members: ["Sr. James Gutierrez", "Sra. Luisa Muñoz"] },
  { name: "Familia Orrego - Londoño", totalSlots: 2, childrenCount: 0, members: ["Sr. Carlos Orrego", "Sra. Leidy Londoño"] },
  { name: "Laura Villegas", totalSlots: 1, childrenCount: 0, members: ["Sra. Laura Villegas"] },
  { name: "Familia Acosta - David", totalSlots: 3, childrenCount: 1, members: ["Sr. Andrey Acosta", "Sra. Vanessa David", { name: "Alejandro Gallo", isChild: true }] },
  { name: "Familia Ostos", totalSlots: 2, childrenCount: 0, members: ["Sra. Hilda Ostos", "Sra. Yovelis Ostos"] },
  { name: "Familia Ostos - Garcia", totalSlots: 3, childrenCount: 1, members: ["Sr. Francisco Garcia", "Sra. Mariugenia Ostos", { name: "Mia Garcia", isChild: true }] },
  { name: "Ana Maria Guerra", totalSlots: 1, childrenCount: 0, members: ["Sra. Ana Maria Guerra"] },
  { name: "Daniela Arango", totalSlots: 1, childrenCount: 0, members: ["Sra. Daniela Arango"] },
  { name: "Familia Rivera - Aguirre", totalSlots: 2, childrenCount: 0, members: ["Sr. Camilo Aguirre", "Sra. Yenny Rivera"] },
  { name: "Lorena Alvarez", totalSlots: 1, childrenCount: 0, members: ["Sra. Lorena Alvarez"] },
  { name: "Familia Loaiza - Maso", totalSlots: 3, childrenCount: 1, members: ["Sr. Hernan Loaiza", "Sra. Gabriela Maso", { name: "Luisa Maso", isChild: true }] },
  { name: "Hector Ortega", totalSlots: 1, childrenCount: 0, members: ["Sr. Hector Ortega"] },
  { name: "Familia De Ossa - Benjumea", totalSlots: 2, childrenCount: 0, members: ["Sr. Gustavo Benjumea", "Sra. Milena De Ossa"] },
  { name: "Jhon Ferney Legarda", totalSlots: 1, childrenCount: 0, members: ["Sr. Jhon Ferney Legarda"] },
  { name: "Familia Cano", totalSlots: 2, childrenCount: 0, members: ["Sra. Gloria Cano", "Esposo"] },
  { name: "Familia Quiroga - Valencia", totalSlots: 3, childrenCount: 1, members: ["Sr. Camilo Quiroga", "Sra. Karen Valencia", { name: "Luciana Quiroga", isChild: true }] },
  { name: "Familia Alvarez - Hincapie", totalSlots: 2, childrenCount: 0, members: ["Sr. Cesar Hincapie", "Sra. Martha Alvarez"] },
  { name: "Familia Jaramillo (Alvaro)", totalSlots: 2, childrenCount: 0, members: ["Sr. Alvaro Jaramillo", "Sra. Martha Arango"] },
  { name: "Familia Granada - Jaramillo", totalSlots: 4, childrenCount: 1, members: ["Sr. David Granada", "Sra. Lina Jaramillo", { name: "Elena Granada", isChild: true }, "Sra. Carmen Sepulveda"] },
  { name: "Familia Escudero", totalSlots: 2, childrenCount: 0, members: ["Sra. Nancy Escudero", "Yadira Escudero"] },
  { name: "Ricardo Caceres", totalSlots: 1, childrenCount: 0, members: ["Sr. Ricardo Caceres"] },
  { name: "Familia Quiroga - Zapata", totalSlots: 2, childrenCount: 1, members: ["Sra. Diana Quiroga", { name: "Susana Zapata", isChild: true }] },
  { name: "Familia Ramirez - Escobar", totalSlots: 3, childrenCount: 1, members: ["Sr. Abel Escobar", "Sra. Linsay Ramirez", { name: "Susana Escobar", isChild: true }] },
  { name: "Familia Giraldo - Hernandez", totalSlots: 2, childrenCount: 0, members: ["Sr. Edwin Giraldo", "Sra. Paola Hernandez"] },
  { name: "Familia Quiroga (Wilson)", totalSlots: 2, childrenCount: 0, members: ["Sr. Wilson Quiroga", "Sra. Martha"] },
  { name: "Jose Hover Quiroga", totalSlots: 1, childrenCount: 0, members: ["Sr. Jose Hover Quiroga"] },
  { name: "Familia Vargas", totalSlots: 2, childrenCount: 0, members: ["Sra. Jasmin Vargas", "Esposo"] },
  { name: "Freddy Pinto", totalSlots: 1, childrenCount: 0, members: ["Sr. Freddy Pinto"] },
  { name: "Familia Cardenas", totalSlots: 2, childrenCount: 0, members: ["Sra. Claudia Cardenas", "Uber"] },
  { name: "Familia Gomez (Gilberto)", totalSlots: 2, childrenCount: 0, members: ["Sr. Gilberto Gomez", "Sra. Jackeline"] },
  { name: "Laura Pupo", totalSlots: 1, childrenCount: 0, members: ["Sra. Laura Pupo"] },
  { name: "Familia Caceres", totalSlots: 4, childrenCount: 1, members: ["Sra. Karen Caceres", "Sr. Yerson", { name: "Samanta", isChild: true }, "Sra. Patricia Caceres"] },
  { name: "Familia Moreno - Pinto", totalSlots: 2, childrenCount: 1, members: ["Sr. Anner Sinisterra", "Sra. Yorledy Martines", { name: "Jacob Sinisterra", isChild: true }] },
  { name: "Familia Quiroga - Tovar", totalSlots: 3, childrenCount: 1, members: ["Juan Felipe Quiroga", "Yenny Andrea Tovar", { name: "Isabella Quiroga", isChild: true }] },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.member.deleteMany();
  await prisma.family.deleteMany();
  await prisma.adminUser.deleteMany();

  // Create admin user
  const email = process.env.ADMIN_EMAIL || "admin@boda.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await hash(password, 12);

  await prisma.adminUser.create({
    data: { email, passwordHash },
  });
  console.log(`✅ Admin user created: ${email}`);

  // Create families with members
  for (const family of families) {
    const inviteCode = nanoid(8);

    await prisma.family.create({
      data: {
        name: family.name,
        inviteCode,
        totalSlots: family.totalSlots,
        childrenCount: family.childrenCount,
        members: {
          create: family.members.map((member) => {
            if (typeof member === "string") {
              return { name: member, isChild: false };
            }
            return { name: member.name, isChild: member.isChild };
          }),
        },
      },
    });
  }

  console.log(`✅ ${families.length} families created with invite codes`);

  // Print invite codes for reference
  const allFamilies = await prisma.family.findMany({
    select: { name: true, inviteCode: true, totalSlots: true },
    orderBy: { createdAt: "asc" },
  });

  console.log("\n📋 Invite codes:");
  allFamilies.forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.name} → /invite/${f.inviteCode} (${f.totalSlots} cupos)`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
