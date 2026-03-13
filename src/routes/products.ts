import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma";

const idParam = t.Object({
  id: t.Numeric({
    minimum: 1,
  }),
});

const productBody = t.Object({
  name: t.String({ minLength: 1, maxLength: 100 }),
  description: t.Optional(t.String({ maxLength: 1000 })),
  price: t.Number({ minimum: 0, maximum: 1_000_000 }),
  stock: t.Optional(t.Number({ minimum: 0, maximum: 1_000_000 })),
});

const productUpdateBody = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
  description: t.Optional(t.String({ maxLength: 1000 })),
  price: t.Optional(t.Number({ minimum: 0, maximum: 1_000_000 })),
  stock: t.Optional(t.Number({ minimum: 0, maximum: 1_000_000 })),
});

export const productsRoute = new Elysia({ prefix: "/products" })
  // 查 - 列表
  .get("/", async () => {
    const products = await prisma.product.findMany({
      orderBy: { id: "asc" },
    });
    return products;
  })
  // 查 - 单条
  .get(
    "/:id",
    async ({ params, set }) => {
      const id = Number(params.id);
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        set.status = 404;
        return { error: "Product not found" };
      }
      return product;
    },
    { params: idParam }
  )
  // 增
  .post(
    "/",
    async ({ body, set }) => {
      const product = await prisma.product.create({
        data: {
          name: body.name,
          description: body.description ?? null,
          price: body.price,
          stock: body.stock ?? 0,
        },
      });
      set.status = 201;
      return product;
    },
    { body: productBody }
  )
  // 改
  .put(
    "/:id",
    async ({ params, body, set }) => {
      const id = Number(params.id);
      const existing = await prisma.product.findUnique({ where: { id } });
      if (!existing) {
        set.status = 404;
        return { error: "Product not found" };
      }
      const product = await prisma.product.update({
        where: { id },
        data: {
          ...(body.name !== undefined && { name: body.name }),
          ...(body.description !== undefined && { description: body.description }),
          ...(body.price !== undefined && { price: body.price }),
          ...(body.stock !== undefined && { stock: body.stock }),
        },
      });
      return product;
    },
    { params: idParam, body: productUpdateBody }
  )
  // 删
  .delete(
    "/:id",
    async ({ params, set }) => {
      const id = Number(params.id);
      try {
        await prisma.product.delete({ where: { id } });
        return { success: true };
      } catch {
        set.status = 404;
        return { error: "Product not found" };
      }
    },
    { params: idParam }
  );
