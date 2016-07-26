all: \
	$(patsubst %.pug, %.html, \
	$(shell find src -not -path "*base*" -name "*.pug"))
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
	src/rut/CenterImage.ts \
	src/rut/Loop.ts \
	src/rut/ZoomText.ts
