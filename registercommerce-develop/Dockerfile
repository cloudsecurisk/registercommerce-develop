# Usa una versión moderna y estable de Node.js
FROM node:20-slim

# Create app src/ directory
WORKDIR /usr/src/register-commerce-service

RUN npm install -g pm2

# Copy package.json and install prod dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN apt-get update && apt-get -yq install bzip2 libfontconfig1 fontconfig libfontconfig1-dev \
# gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
# libexpat1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
# libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
# libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
# ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

# ENV OPENSSL_CONF=/opt/openssl.cnf

# install chrome
# RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
# RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libu2f-udev \
    libgbm1 \
    chromium \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

ENV CHROMIUM_PATH=/usr/bin/chromium

# RUN sudo apt-get install libgbm1

# Install only production dependencies
# Prevent installation of dev dependencies
RUN npm ci --only=production

# Copy app files, ignoring files contained into .dockerignore file
COPY . .

# App default port
EXPOSE 3000

RUN echo "Chromium path: $(which chromium)"

CMD ["pm2-runtime", "config/production.pm2.json"]