# 产品模块 API

基于 **Bun + Elysia + Prisma + SQLite** 的产品增删改查接口。

## 环境要求

- [Bun](https://bun.sh/) 已安装

## 安装与初始化

```bash
bun install
bun run db:generate   # 生成 Prisma Client
bun run db:push       # 同步 schema 到 SQLite（创建 dev.db）
```

## 运行

```bash
bun run dev    # 开发模式（热重载）
bun run start  # 生产运行
```

服务默认：`http://localhost:3000`

## 产品 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/products` | 获取产品列表（支持分页） |
| GET | `/products/:id` | 获取单个产品 |
| POST | `/products` | 新增产品 |
| PUT | `/products/:id` | 更新产品 |
| DELETE | `/products/:id` | 删除产品 |

### 列表查询参数（GET /products）

- `limit`：可选，单页数量，默认 `20`，最小 `1`，最大 `100`
- `offset`：可选，偏移量，用于分页，默认 `0`

示例：

```bash
curl "http://localhost:3000/products?limit=20&offset=0"
```

### 请求示例

**新增产品 POST /products**

```json
{
  "name": "商品名称",
  "description": "可选描述",
  "price": 99.9,
  "stock": 10
}
```

**更新产品 PUT /products/:id**

```json
{
  "name": "新名称",
  "price": 88.8,
  "stock": 5
}
```

（字段均可选，只传需要更新的字段。）

### 响应与错误码

- **成功**
  - `GET /products`：返回产品数组
  - `GET /products/:id`：返回单个产品对象
  - `POST /products`：`201 Created`，返回新建产品
  - `PUT /products/:id`：返回更新后的产品
  - `DELETE /products/:id`：返回 `{ "success": true }`
- **失败**
  - 当目标产品不存在时，`GET /products/:id`、`PUT /products/:id`、`DELETE /products/:id` 均返回 `404` 与 `{ "error": "Product not found" }`
  - 当请求体验证不通过（如价格为负数）时，Elysia 会返回 4xx 错误及验证信息

## 数据库

- 使用 Prisma + SQLite，数据文件：`prisma/dev.db`
- 可视化：`bun run db:studio`

## 部署说明

### 1. 生产环境准备

- 安装 [Bun](https://bun.sh/)（与开发环境版本保持一致）
- 确认服务器已安装 Node.js（仅用于部分工具，不是必需）
- 准备持久化存储目录，用于保存 SQLite 数据库文件 `prisma/dev.db`

### 2. 首次部署步骤

```bash
# 拉取代码
git clone <your-repo-url>
cd test2

# 安装依赖
bun install

# 生成 Prisma Client 并初始化数据库
bun run db:generate
bun run db:push
```

执行完成后，会在 `prisma/dev.db` 中创建 `Product` 表。

### 3. 启动服务（生产模式）

```bash
export NODE_ENV=production   # Windows PowerShell 可使用 $env:NODE_ENV="production"
bun run start
```

服务默认监听 `http://localhost:3000`。

可以结合进程守护工具（例如 `pm2`、systemd）将 `bun run start` 作为长期运行服务：

- **示例（systemd）**
  - `ExecStart=/usr/local/bin/bun run start`
  - `WorkingDirectory=/path/to/test2`
  - `Environment=NODE_ENV=production`

### 4. 数据迁移与升级

当修改 `prisma/schema.prisma` 后，在部署环境中执行：

```bash
bun run db:generate
bun run db:push
```

然后重启服务：

```bash
# 视所用进程管理工具而定
bun run start
```
