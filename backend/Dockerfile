# 1. Use official Node image
FROM node:20

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy package files first and install deps
COPY package*.json ./
RUN npm install

# 4. Copy the rest of the source code
COPY . .

# 5. Expose port (must match your .env)
EXPOSE 3000

# 6. Start the app
CMD ["npm", "start"]
