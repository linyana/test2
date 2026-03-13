import { Elysia, t } from "elysia";
import { prisma } from "./lib/prisma";

const idParam = t.Object({ id: t.Numeric() });

const app = new Elysia()
  .get("/", () => ({ message: "Product API", docs: "/products" }))
  .group("/products", (app) =>
    app
      .get("/", async () => {
        const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
        return products;
      })
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
        {
          body: t.Object({
            name: t.String({ minLength: 1 }),
            description: t.Optional(t.String()),
            price: t.Number({ minimum: 0 }),
            stock: t.Optional(t.Number({ minimum: 0 })),
          }),
        }
      )
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
        {
          params: idParam,
          body: t.Object({
            name: t.Optional(t.String({ minLength: 1 })),
            description: t.Optional(t.String()),
            price: t.Optional(t.Number({ minimum: 0 })),
            stock: t.Optional(t.Number({ minimum: 0 })),
          }),
        }
      )
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
      )
  )
  .listen(3000);

console.log(`🦊 Server at http://localhost:${app.server?.port}`);
