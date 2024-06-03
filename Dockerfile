# Stage 1: Build Angular App
FROM node:14 AS build

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Angular app
RUN npm run build --prod

# Stage 2: Setup Nginx to serve the Angular app
FROM nginx:latest

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d

# Copy the built Angular app from the previous stage
COPY --from=build /usr/src/app/dist/proiect /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
