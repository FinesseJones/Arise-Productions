#!/bin/bash
set -e

# ==============================================================================
# ARISE PRODUCTION - ICON GENERATOR FOR MACOS .ICNS, DMG & MOBILE INSTALLATIONS
# A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
# ==============================================================================

SRC_IMG="frontend/public/arise_productions_logo.jpg"
ICONSET_DIR="desktop/build/icon.iconset"
BUILD_DIR="desktop/build"

mkdir -p "$ICONSET_DIR"
mkdir -p "$BUILD_DIR"
mkdir -p "frontend/public"

echo "🎨 Generating full-width PNG icons for all platforms..."

# Generate square 1024x1024 master PNG
sips -s format png "$SRC_IMG" --out "$BUILD_DIR/icon.png" --resampleHeightWidth 1024 1024
cp "$BUILD_DIR/icon.png" "frontend/public/icon-512.png"
sips -s format png "$SRC_IMG" --out "frontend/public/icon-192.png" --resampleHeightWidth 192 192
sips -s format png "$SRC_IMG" --out "frontend/public/apple-touch-icon.png" --resampleHeightWidth 180 180
sips -s format png "$SRC_IMG" --out "frontend/public/favicon.png" --resampleHeightWidth 64 64

echo "🍎 Generating macOS .iconset for .icns compilation..."
sips -z 16 16     "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_16x16.png"
sips -z 32 32     "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_16x16@2x.png"
sips -z 32 32     "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_32x32.png"
sips -z 64 64     "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_32x32@2x.png"
sips -z 128 128   "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_128x128.png"
sips -z 256 256   "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_128x128@2x.png"
sips -z 256 256   "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_256x256.png"
sips -z 512 512   "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_256x256@2x.png"
sips -z 512 512   "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_512x512.png"
sips -z 1024 1024 "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_512x512@2x.png"

echo "✨ Compiling icon.icns with iconutil..."
iconutil -c icns "$ICONSET_DIR" -o "$BUILD_DIR/icon.icns"
rm -rf "$ICONSET_DIR"

echo "✅ Generated desktop/build/icon.icns and desktop/build/icon.png successfully!"
