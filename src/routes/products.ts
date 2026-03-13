import { Elysia, t } from "elysia";
import {
  NotFoundError,
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from "../services/products";

const idParam = t.Object({ id: t.Numeric() });

const productBody = t.Object({
  name: t.String({ minLength: 1 }),
  description: t.Optional(t.String()),
  price: t.Number({ minimum: 0 }),
  stock: t.Optional(t.Number({ minimum: 0 })),
});

const productUpdateBody = t.Object({
  name: t.Optional(t.String({ minLength: 1 })),
  description: t.Optional(t.String()),
  price: t.Optional(t.Number({ minimum: 0 })),
  stock: t.Optional(t.Number({ minimum: 0 })),
});

const paginationQuery = t.Object({
  page: t.Optional(t.Numeric({ minimum: 1 })),
  pageSize: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
});

export const productsRoute = new Elysia({ prefix: "/products" })
  // 查 - 列表
  .get(
    "/",
    async ({ query }) => {
      const { page, pageSize } = query;
      const result = await listProducts({
        page: page,
        pageSize: pageSize,
      });
      return result;
    },
    { query: paginationQuery }
  )
  // 查 - 单条
  .get(
    "/:id",
    async ({ params, set }) => {
      const id = Number(params.id);
      try {
        const product = await getProductById(id);
        return product;
      } catch (error) {
        if (error instanceof NotFoundError) {
          set.status = 404;
          return { error: error.message };
        }
        throw error;
      }
    },
    { params: idParam }
  )
  // 增
  .post(
    "/",
    async ({ body, set }) => {
      const product = await createProduct({
        name: body.name,
        description: body.description,
        price: body.price,
        stock: body.stock,
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
      try {
        const product = await updateProduct(id, {
          name: body.name,
          description: body.description,
          price: body.price,
          stock: body.stock,
        });
        return product;
      } catch (error) {
        if (error instanceof NotFoundError) {
          set.status = 404;
          return { error: error.message };
        }
        throw error;
      }
    },
    { params: idParam, body: productUpdateBody }
  )
  // 删
  .delete(
    "/:id",
    async ({ params, set }) => {
      const id = Number(params.id);
      try {
        const result = await deleteProduct(id);
        return result;
      } catch (error) {
        if (error instanceof NotFoundError) {
          set.status = 404;
          return { error: error.message };
        }
        throw error;
      }
    },
    { params: idParam }
  );
