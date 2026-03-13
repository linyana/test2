import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export class NotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

interface ListProductsParams {
  page?: number;
  pageSize?: number;
}

interface CreateProductParams {
  name: string;
  description?: string | null;
  price: number;
  stock?: number;
}

interface UpdateProductParams {
  name?: string;
  description?: string | null;
  price?: number;
  stock?: number;
}

export async function listProducts(params: ListProductsParams = {}) {
  const page = params.page && params.page > 0 ? params.page : 1;
  const pageSizeRaw = params.pageSize && params.pageSize > 0 ? params.pageSize : 20;
  const pageSize = Math.min(pageSizeRaw, 100);
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: pageSize,
      orderBy: { id: "asc" },
    }),
    prisma.product.count(),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
  };
}

export async function getProductById(id: number) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new NotFoundError("Product not found");
  }
  return product;
}

export async function createProduct(data: CreateProductParams) {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      stock: data.stock ?? 0,
    },
  });
  return product;
}

export async function updateProduct(id: number, data: UpdateProductParams) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.stock !== undefined && { stock: data.stock }),
      },
    });
    return product;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw new NotFoundError("Product not found");
    }
    throw error;
  }
}

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw new NotFoundError("Product not found");
    }
    throw error;
  }
}

