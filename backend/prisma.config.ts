/// <reference types="node" />
import "dotenv/config";

/** @type {import('prisma/config').PrismaConfig} */
const config = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: String(process.env.DATABASE_URL || ""),
  },
};

export default config;