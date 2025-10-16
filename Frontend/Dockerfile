# Stage 1: Build React app
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve static build with nginx
FROM nginx:1.27-alpine

# Copy built frontend to nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 
EXPOSE 5173

CMD ["npm","run","dev"]
