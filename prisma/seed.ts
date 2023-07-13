import { PrismaClient } from "@prisma/client";
import { perusahaan, barang } from "../src/libs/constant";

const prisma = new PrismaClient();

async function main() {
  await prisma.perusahaan.createMany({
    data: perusahaan,
  });

  await prisma.barang.createMany({
    data: barang,
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
