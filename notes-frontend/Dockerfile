FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the app
RUN npm run build

# Use Vite's preview server for production serving
EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host"]
