# Makefile for running Expo with Bun

# Default target
all: start

# Start Expo with Bun
start:
	bun run ios

# Install dependencies
install:
	bunx expo install

upgrade:
	bunx expo install --fix

# Clean project
clean:
	rm -rf node_modules

.PHONY: all start install clean upgrade