import { PrismaClient } from "@prisma/client";

/**
 * 全局复用的 PrismaClient 单例，避免在开发环境创建过多连接。
 *
 * In development, we reuse a single PrismaClient instance on `globalThis`
 * to prevent exhausting SQLite connections during hot-reload.
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

/**
 * Prisma 客户端实例。
 *
 * - Development：输出 query / error / warn 级别日志，便于调试
 * - Production：仅输出 error 日志，减少噪音
 */
export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
