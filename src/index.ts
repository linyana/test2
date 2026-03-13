import { Elysia } from "elysia";
import { productsRoute } from "./routes/products";

const app = new Elysia()
  .get("/", () => ({
    message: "Product API",
    docs: "GET/POST /products, GET/PUT/DELETE /products/:id",
  }))
  .use(productsRoute)
  .listen(3000);

console.log(`🦊 Server at http://localhost:${app.server?.port}`);
