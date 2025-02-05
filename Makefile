# Makefile for running Expo with Bun

# Default target
all: install start

# Start Expo with Bun
start:
	bun run android

# Install dependencies
install:
	bunx expo install

upgrade:
	bunx expo install --fix

# Clean project
clean:
	rm -rf node_modules

.PHONY: all start install clean upgrade

# expo prebuild --clean
# expo start --clear