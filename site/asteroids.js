
const g = {
	"assets": {},
	"scale": { "aspect": 4 / 3, "x": 1.0, "y": 1.0 }
};

// Convert color from hex string to array of RGB values
g.getRGB = function getRgb( color ) {
	color = parseInt( color.replace( /^#/, "" ), 16 );
	const r = ( color >> 16 ) & 0xFF;
	const g = ( color >> 8 ) & 0xFF;
	const b = color & 0xFF;
	return [ r, g, b ];
};

// Convert color from array of RGB values to hex string
g.getHexColor = function getHex( color ) {
	color = color.map( ( c ) => c.toString( 16 ).padStart( 2, "0" ) );
	return "#" + color.join( "" );
};

( function () {

	window.addEventListener( "DOMContentLoaded", init );

	function init() {

		// Create the application helper and add its render target to the page
		g.app = new PIXI.Application( {
			"backgroundColor": 0x000000,
			"resizeTo": window,
			"antialias": true
		} );

		// Load the assets
		( async () => {
			const audioSrcs = [
				"assets/sounds/sfx_laser1.ogg",
				"assets/sounds/sfx_laser2.ogg",
				"assets/sounds/sfx_laser1.ogg",
				"assets/sounds/sfx_laser2.ogg",
				"assets/sounds/sfx_laser1.ogg",
				"assets/sounds/sfx_laser2.ogg",
				"assets/sounds/sfx_lose.ogg",
				"assets/sounds/sfx_shieldDown.ogg",
				"assets/sounds/sfx_shieldUp.ogg",
				"assets/sounds/sfx_twoTone.ogg",
				"assets/sounds/sfx_zap.ogg",
				"assets/sounds/win.mp3",
				"assets/sounds/hit.wav",
				"assets/sounds/explosion_1.wav",
				"assets/sounds/explosion_2.wav",
			];

			// Load the assets
			const audioPromises = audioSrcs.map( src => loadAudio( src ) );
			const spriteSheetPromise = PIXI.Assets.load( "assets/spritesheet.json" );

			// Wait for audio assets to load
			g.soundLoaded = false;
			Promise.all( audioPromises ).then( ( audios ) => {
				g.assets.audio = {
					"laser1": audios[ 0 ],
					"laser2": audios[ 1 ],
					"laser3": audios[ 2 ],
					"laser4": audios[ 3 ],
					"laser5": audios[ 4 ],
					"laser6": audios[ 5 ],
					"lose": audios[ 6 ],
					"shieldDown": audios[ 7 ],
					"shieldUp": audios[ 8 ],
					"twoTone": audios[ 9 ],
					"zap": audios[ 10 ],
					"win": audios[ 11 ],
					"hit": audios[ 12 ],
					"explosion1": audios[ 13 ],
					"explosion2": audios[ 14 ],
				};
				for( let i = 0; i < 6; i++ ) {
					g.assets.audio[ "laser" + ( i + 1 ) ].volume = 0.5;
					g.assets.audio[ "laser" + ( i + 1 ) ].playbackRate = 1.5;
				}
				g.soundLoaded = true;
			} );

			// Wait for the sprite sheet to load
			g.spritesheet = await spriteSheetPromise;

			// Create the world and show the intro
			g.createWorld();
			g.showIntro();
		} )();

		// Load the background
		g.assets.background = PIXI.TilingSprite.from(
			"assets/images/Backgrounds/darkPurple.png" ,
			{ "width": g.app.screen.width, "height": g.app.screen.height }
		);

		// Add the background
		g.app.stage.addChild( g.assets.background );

		// Add the application to the page
		document.body.appendChild( g.app.view );
		resize();

		// Show the loading screen
		g.showLoading();

		// Resize the background when the window is resized
		window.addEventListener( "resize", resize );
	}

	function loadAudio( src ) {
		return new Promise( ( resolve, reject ) => {
			const audio = new Audio( src );
			audio.addEventListener( "canplaythrough", () => resolve( audio ) );
			audio.addEventListener( "error", reject );
		} );
	}

	function resize() {
		// Calculate the scale based on the aspect ratio
		if ( window.innerWidth / window.innerHeight >= g.scale.aspect ) {
			g.scale.x = window.innerHeight * g.scale.aspect / 800.0;
			g.scale.y = window.innerHeight / 600.0;
		} else {
			g.scale.x = window.innerWidth / 800.0;
			g.scale.y = window.innerWidth / g.scale.aspect / 600.0;
		}
		g.app.stage.scale.x = g.scale.x;
		g.app.stage.scale.y = g.scale.y;
		g.assets.background.width = g.app.screen.width / g.scale.x;
		g.assets.background.height = g.app.screen.height / g.scale.y;
	}

} )();