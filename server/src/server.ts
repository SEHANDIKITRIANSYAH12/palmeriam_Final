import app from "./app";
import prisma from "./config/db";

const PORT = Number(process.env.PORT || 5000);

async function start() {
  await prisma.$connect();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
