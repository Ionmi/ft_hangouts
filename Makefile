# Makefile for running Expo with Bun

# Default target
all: install start

re: clean_andorid install start
# Start Expo with Bun
start:
	bun run android

# Install dependencies
install:
	bunx expo install

export:
	export ANDROID_HOME=/Users/ionmi/Library/Android/sdk

upgrade:
	bunx expo install --fix

clean_andorid:
	rm -rf android

# Clean project
clean:
	rm -rf node_modules

.PHONY: all start install clean upgrade clean_andorid re export

# expo prebuild --clean
# expo start --clear