all: \
	src/404.html \
	src/index.html \
	src/cbg/index.html \
	src/lgw/index.html \
	src/rut/index.html
src/cbg/index.js: \
	src/cbg/Board.ts \
	src/cbg/Canvas.ts \
	src/cbg/Data.ts \
	src/cbg/HexTile.ts \
	src/cbg/NumberLabel.ts \
	src/cbg/Sprite.ts
src/lgw/index.js: \
	src/lgw/Bullet.ts \
	src/lgw/Canvas.ts \
	src/lgw/Enemy.ts \
	src/lgw/Game.ts \
	src/lgw/Player.ts \
	src/lgw/Sprite.ts
src/rut/index.js: \
	src/rut/Canvas.ts \
	src/rut/RutImage.ts \
	src/rut/RutText.ts
