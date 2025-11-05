# frontend/Dockerfile
FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install --save-dev @types/node
RUN npm install react-icons

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
