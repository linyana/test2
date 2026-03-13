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
| GET | `/products` | 获取产品列表 |
| GET | `/products/:id` | 获取单个产品 |
| POST | `/products` | 新增产品 |
| PUT | `/products/:id` | 更新产品 |
| DELETE | `/products/:id` | 删除产品 |

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

## 数据库

- 使用 Prisma + SQLite，数据文件：`prisma/dev.db`
- 可视化：`bun run db:studio`
