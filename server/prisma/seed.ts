import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../src/config/db";

async function main() {
  const username = process.env.DEFAULT_ADMIN_USERNAME || "admin";
  const password = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";
  const name = process.env.DEFAULT_ADMIN_NAME || "Administrator";

  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) {
    // eslint-disable-next-line no-console
    console.log(`Seed: admin '${username}' already exists`);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      username,
      password: hashed,
      name,
      role: "admin",
    },
  });

  // eslint-disable-next-line no-console
  console.log(`Seed: admin created. username='${username}' password='${password}'`);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
