import { Elysia, t } from "elysia";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from "../services/productService";

/**
 * URL 路径参数校验：`/products/:id` 中的 `id` 必须为数字。
 */
const idParam = t.Object({ id: t.Numeric() });

const listQuery = t.Object({
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
  offset: t.Optional(t.Numeric({ minimum: 0 })),
});

/**
 * 新增产品时的请求体验证规则。
 *
 * @property name        产品名称，必填，非空字符串
 * @property description 产品描述，可选
 * @property price       产品价格，非负数，必填
 * @property stock       库存数量，非负整数，可选（默认 0）
 */
const productBody = t.Object({
  name: t.String({ minLength: 1 }),
  description: t.Optional(t.String()),
  price: t.Number({ minimum: 0 }),
  stock: t.Optional(t.Number({ minimum: 0 })),
});

/**
 * 更新产品时的请求体验证规则，所有字段均为可选。
 */
const productUpdateBody = t.Object({
  name: t.Optional(t.String({ minLength: 1 })),
  description: t.Optional(t.String()),
  price: t.Optional(t.Number({ minimum: 0 })),
  stock: t.Optional(t.Number({ minimum: 0 })),
});

/**
 * 产品模块路由。
 *
 * 提供 `/products` 相关的 CRUD 接口：
 * - `GET /products`：获取产品列表
 * - `GET /products/:id`：获取单个产品
 * - `POST /products`：新增产品
 * - `PUT /products/:id`：更新产品
 * - `DELETE /products/:id`：删除产品
 */
export const productsRoute = new Elysia({ prefix: "/products" })
  // 查 - 列表
  .get(
    "/",
    async ({ query }) => {
      const limit = Math.min(query.limit ?? 20, 100);
      const offset = query.offset ?? 0;

      const products = await listProducts({ limit, offset });
    return products;
    },
    { query: listQuery }
  )
  // 查 - 单条
  .get(
    "/:id",
    async ({ params, set }) => {
      const id = Number(params.id);
      const product = await getProductById(id);
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
      const product = await createProduct(body);
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
      const product = await updateProduct(id, body);
      if (!product) {
        set.status = 404;
        return { error: "Product not found" };
      }
      return product;
    },
    { params: idParam, body: productUpdateBody }
  )
  // 删
  .delete(
    "/:id",
    async ({ params, set }) => {
      const id = Number(params.id);
      const success = await deleteProduct(id);
      if (!success) {
        set.status = 404;
        return { error: "Product not found" };
      }
      return { success: true };
    },
    { params: idParam }
  );
