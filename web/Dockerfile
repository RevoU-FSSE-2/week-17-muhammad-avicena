# Use a lightweight web server image, such as Nginx or Apache
FROM nginx:alpine

# Remove the default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy your static files (HTML, CSS, JavaScript) to the container
COPY . /usr/share/nginx/html/
