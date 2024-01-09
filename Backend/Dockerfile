# Installing Dependencies
FROM node:20.10.0-alpine AS BUILD
WORKDIR /home/node/app
# package.json and package-lock.json copied to start the installation
COPY package*.json ./
# to copy prisma files
COPY prisma ./prisma/
# Do not install DevDependencies
RUN npm install --omit=dev --omit=optional
# Remove test and other non+ production files/dependencies in the node_modules
RUN npm prune --production
# Remove unused files/dependencies across the image
RUN wget -q https://gobinaries.com/tj/node-prune | sh

# Building the Actual Image
FROM node:20.10.0-alpine AS deps
WORKDIR /home/node/app
COPY . .
COPY --from=BUILD /home/node/app/node_modules node_modules
CMD [ "npm","run", "start:prod" ]
EXPOSE 4000
