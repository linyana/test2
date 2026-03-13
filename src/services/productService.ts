import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../lib/prisma";

/**
 * 创建产品时允许的入参。
 *
 * @property name        产品名称，必填
 * @property description 产品描述，可选，为空时将保存为 `null`
 * @property price       产品价格，必填
 * @property stock       库存数量，可选，未传时默认保存为 0
 */
type CreateProductInput = {
  name: string;
  description?: string | null;
  price: number;
  stock?: number;
};

/**
 * 更新产品时允许的入参，所有字段均为可选。
 *
 * 仅会更新传入的字段，其余字段保持不变。
 */
type UpdateProductInput = {
  name?: string;
  description?: string | null;
  price?: number;
  stock?: number;
};

/**
 * 查询产品列表时的分页配置。
 *
 * @property limit  每页数量
 * @property offset 偏移量（跳过的记录数）
 */
type ListProductsOptions = {
  limit: number;
  offset: number;
};

/**
 * 获取产品列表（分页）。
 *
 * @param options 分页参数，包括 `limit` 与 `offset`
 * @returns 按 id 升序排列的产品列表
 */
export async function listProducts(options: ListProductsOptions) {
  const { limit, offset } = options;
  return prisma.product.findMany({
    skip: offset,
    take: limit,
    orderBy: { id: "asc" },
  });
}

/**
 * 根据主键 id 查询单个产品。
 *
 * @param id 产品主键 id
 * @returns 若存在返回产品记录，不存在则返回 `null`
 */
export async function getProductById(id: number) {
  return prisma.product.findUnique({
    where: { id },
  });
}

/**
 * 创建产品。
 *
 * @param input 创建产品所需字段
 * @returns 新创建的产品记录
 */
export async function createProduct(input: CreateProductInput) {
  return prisma.product.create({
    data: {
      name: input.name,
      description: input.description ?? null,
      price: input.price,
      stock: input.stock ?? 0,
    },
  });
}

/**
 * 根据 id 更新产品。
 *
 * 仅会更新入参中存在的字段；当指定 id 不存在时返回 `null`。
 *
 * @param id    产品主键 id
 * @param input 需要更新的字段
 * @returns 更新后的产品记录；若记录不存在则返回 `null`
 */
export async function updateProduct(id: number, input: UpdateProductInput) {
  try {
    return await prisma.product.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.price !== undefined && { price: input.price }),
        ...(input.stock !== undefined && { stock: input.stock }),
      },
    });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return null;
    }
    throw error;
  }
}

/**
 * 根据 id 删除产品。
 *
 * 当指定 id 不存在时返回 `false`，其余异常将直接抛出。
 *
 * @param id 产品主键 id
 * @returns 删除成功返回 `true`，记录不存在返回 `false`
 */
export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return false;
    }
    throw error;
  }
}

