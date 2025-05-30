
// docker-compose.yml.ts
// Contains the docker-compose.yml content as a string constant.
// To use: copy the content of 'dockerComposeYamlContent',
// paste it into a new file named 'docker-compose.yml' in your project root.

export const dockerComposeYamlContent = \`
version: '3.8'

services:
  projekt_ckryptbit:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: projekt_ckryptbit_app
    restart: unless-stopped
    ports:
      - "\\\${APP_PORT:-3001}:\\\${PORT:-3001}" # Maps host port to container port (backend server)
    volumes:
      - ./backend/data:/app/backend/data # Persist backend data
      # For development, you might want to mount source code:
      # - ./backend:/app/backend 
      # - ./frontend:/app/frontend # If frontend is also served or built by a dev server in container
      # Ensure node_modules are not overwritten by host mount if you do this:
      # - /app/backend/node_modules 
    environment:
      # These will be picked up from the .env file in the same directory as this docker-compose.yml
      - NODE_ENV=\\\${NODE_ENV:-production}
      - PORT=\\\${PORT:-3001}
      - API_KEY_GEMINI=\\\${API_KEY_GEMINI}
    # If your app needs to wait for a database or other service, add depends_on here
    # depends_on:
    #   - some_database_service

# Optional: Define networks if needed
# networks:
#   app_network:
#     driver: bridge
\`;
