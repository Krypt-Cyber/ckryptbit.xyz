
// Dockerfile.ts
// Contains the Dockerfile content as a string constant.
// To use: copy the content of 'dockerfileContent',
// paste it into a new file named 'Dockerfile' in your project root.

export const dockerfileContent = \`
# STAGE 1: Build Frontend
# This stage assumes the frontend build process outputs to a specific directory, e.g., 'dist' or 'build'.
# The 'npm run build' in package.json is:
# "esbuild src/index.tsx --bundle --outfile=../backend/public_html/bundle.js ..."
# This means the frontend build directly places its output into the backend's static serving path.
# So, for Docker, if we build frontend first, its output needs to be copied to the backend stage.

FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy only package files first to leverage Docker cache
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

# Copy the rest of the frontend source code
COPY frontend/ ./

# Run the build script. Output is expected to be in ../backend/public_html relative to /app/frontend
# which means /app/backend/public_html within this Docker multi-stage context if backend was sibling to frontend.
# However, the build output of this stage should be self-contained or copied to a known artifact location.
# Let's assume the build script creates a 'dist' folder within /app/frontend workdir for simplicity of COPY --from.
# This requires adjusting the frontend build script in package.json if using this Dockerfile for building from scratch.
# For THIS offline generator, we assume the script *outside* Docker has already run 'npm run build' in frontend.
# Thus, backend/public_html is ALREADY populated.
# So, this Dockerfile will be simpler, assuming a pre-built state.

# Final Runtime Stage (assuming pre-built by the script)
FROM node:20-alpine

WORKDIR /app

# Copy the pre-built backend (which includes the pre-built frontend in public_html)
COPY backend /app/backend

WORKDIR /app/backend

# Install only production backend dependencies
RUN npm install --omit=dev 

# Expose port (ensure this matches PORT in .env and server.js)
EXPOSE \\\${PORT:-3001}

# Environment variables will be injected by docker-compose from .env file
# or can be set with -e flags in docker run

CMD ["node", "server.js"]
\`;
