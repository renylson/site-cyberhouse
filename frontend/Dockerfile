FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN npm run build

# Expose port
EXPOSE 3071

ENV PORT 3071
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["npm", "start"]
