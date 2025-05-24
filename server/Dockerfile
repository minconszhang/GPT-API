# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app

# 安装依赖
COPY package.json package-lock.json ./
RUN npm install

# 拷贝源代码并构建 NestJS
COPY . .
RUN npm run build

# 生产运行阶段
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# 拷贝构建产物和依赖
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

# 暴露端口
EXPOSE 3888

# 启动命令（你有 "start:prod" 脚本）
CMD ["npm", "run", "start:prod"]
