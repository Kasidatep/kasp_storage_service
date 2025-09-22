FROM node:24-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build
RUN mkdir -p uploads
EXPOSE 3000
CMD ["npm", "run", "start:prod"]