# 使用 node:18 构建镜像
FROM node:18 as BUILD_IMAGE

# 设置内存限制（可选）
ENV NODE_OPTIONS=--max_old_space_size=4096

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml 以便缓存依赖安装
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm 并配置官方 npm registry
RUN npm install -g pnpm && pnpm config set registry https://registry.npmjs.org/

# 安装项目依赖
RUN pnpm install

# 复制项目所有文件
COPY . .

# 构建项目
RUN pnpm build

# 使用 node:18 作为最终镜像
FROM node:18

# 设置工作目录
WORKDIR /usr/src/app

# 安装 pnpm 并配置官方 npm registry
RUN npm install -g pnpm && pnpm config set registry https://registry.npmjs.org/

# 从 BUILD_IMAGE 中复制依赖和构建文件
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /app/dist ./dist

# 如果需要其他文件，补充复制，比如静态文件、配置文件等
# COPY --from=BUILD_IMAGE /app/public ./public

# 暴露端口
EXPOSE 3000

# 启动 NestJS 应用
CMD ["node", "dist/main.js"]
