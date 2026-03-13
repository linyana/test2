import { Elysia } from "elysia";
import { productsRoute } from "./routes/products";

/**
 * 初始化并启动产品 API 服务。
 *
 * - 根路径 `/`：返回服务健康状态与简单说明
 * - `/products`：挂载产品模块的增删改查接口
 */
const app = new Elysia()
  .get("/", () => ({
    message: "Product API",
    docs: "GET/POST /products, GET/PUT/DELETE /products/:id",
  }))
  .use(productsRoute)
  .listen(3000);

console.log(`🦊 Server at http://localhost:${app.server?.port}`);
