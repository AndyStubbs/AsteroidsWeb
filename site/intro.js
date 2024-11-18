"use strict";

( function () {

	const intro = {
		"action": () => {},
		"fadeItems": []
	};

	g.showLoading = function showLoading() {
		const styleProperties = {
			"fontFamily": "Arial",
			"fontSize": 36,
			"letterSpacing": 15,
			"fontWeight": "bold",
			"fill": [ "#333333", "#727272" ],
			"stroke": "#ececec",
			"strokeThickness": 5,
			"dropShadow": true,
			"dropShadowColor": "#000000",
			"dropShadowBlur": 4,
			"dropShadowAngle": Math.PI / 6,
			"dropShadowDistance": 6,
			"lineJoin": "round",
		};
		const styleLoading = new PIXI.TextStyle( styleProperties );
		intro.loading = new PIXI.Text( "Loading...", styleLoading );
		intro.loading.anchor.set( 0.5, 0.5 );
		const pos = g.app.stage.toLocal(
			new PIXI.Point( g.app.screen.width / 2, g.app.screen.height / 2 )
		);
		intro.loading.x = pos.x;
		intro.loading.y = pos.y;
		intro.loading.alpha = 0;
		g.app.stage.addChild( intro.loading );
		intro.action = () => {};
		intro.fadeItems.push( intro.loading );
		g.app.ticker.add( runFadeIn );
	};

	g.showIntro = function showIntro() {
		g.app.ticker.remove( runFadeIn );
		intro.fadeItems.push( intro.loading );
		intro.action = () => {
			createTextObjects();
			startAnimation();
			document.addEventListener( "keydown", anykey );
		};
		g.app.ticker.add( runFadeOut );
	};

	function createTextObjects() {
		const styleProperties = {
			"fontFamily": "Arial",
			"fontSize": 36,
			"letterSpacing": 15,
			"fontWeight": "bold",
			"fill": [ "#333333", "#727272" ],
			"stroke": "#ececec",
			"strokeThickness": 5,
			"dropShadow": true,
			"dropShadowColor": "#000000",
			"dropShadowBlur": 4,
			"dropShadowAngle": Math.PI / 6,
			"dropShadowDistance": 6,
			"lineJoin": "round",
		};
		const styleTitle = new PIXI.TextStyle( styleProperties );
		intro.title = new PIXI.Text( "asteroids", styleTitle );
		intro.title.anchor.set( 0.5, 0.5 );
		let pos = g.app.stage.toLocal(
			new PIXI.Point( g.app.screen.width / 2, g.app.screen.height )
		);
		intro.title.x = pos.x;
		intro.title.y = pos.y;
		g.app.stage.addChild( intro.title );

		const styleanykey = new PIXI.TextStyle( styleProperties );
		intro.anykey = new PIXI.Text( "Press any key to start", styleanykey );
		intro.anykey.anchor.set( 0.5, 0.5 );
		pos = g.app.stage.toLocal(
			new PIXI.Point( g.app.screen.width / 2, g.app.screen.height / 2 )
		);
		intro.anykey.x = pos.x;
		intro.anykey.y = pos.y;
		intro.anykey.alpha = 0;
		intro.anykey.style.letterSpacing = 2;
		g.app.stage.addChild( intro.anykey );
	}

	function startAnimation() {
		intro.anykeyAlphaMin = 0.05;
		intro.anykeyAlphaMax = 0.65;
		intro.anykeyAlphaDeltaBase = 0.01;
		intro.anykeyStartTime = 30;
		intro.elapsed = 0;
		intro.titleStrokeColor =  g.getRGB( intro.title.style.stroke );
		g.app.ticker.add( run );
	}

	function run( delta ) {

		// Update the elapsed time
		intro.elapsed += delta;

		// Fade the title stroke color to black
		intro.titleStrokeColor[ 0 ] = Math.max( 0, intro.titleStrokeColor[ 0 ] - ( delta * 3 ) );
		intro.titleStrokeColor[ 1 ] = Math.max( 0, intro.titleStrokeColor[ 1 ] - ( delta * 3 ) );
		intro.titleStrokeColor[ 2 ] = Math.max( 0, intro.titleStrokeColor[ 2 ] - ( delta * 3 ) );
		const color = [
			Math.round( intro.titleStrokeColor[ 0 ] ),
			Math.round( intro.titleStrokeColor[ 1 ] ),
			Math.round( intro.titleStrokeColor[ 2 ] ),
		];
		intro.title.style.stroke = g.getHexColor( color );
		intro.title.y = Math.max( 36, intro.title.y - ( delta * 15 ) );

		// Blink the "Press any key to start" text
		if( intro.elapsed > intro.anykeyStartTime ) {
			const anykeyAlphaDelta = delta * intro.anykeyAlphaDeltaBase;
			intro.anykey.alpha = Math.min( 1, intro.anykey.alpha += anykeyAlphaDelta );

			// Set alpha between min and max
			// allow for initial fade below min from 0 to max but after first 
			if(
				intro.anykey.alpha >= intro.anykeyAlphaMax ||
				( intro.anykeyAlphaDeltaBase < 0 && intro.anykey.alpha < intro.anykeyAlphaMin )
			) {
				intro.anykeyAlphaDeltaBase *= -1;
			}
		}
	}

	function runFadeOut( delta ) {
		let fadeOutComplete = true;
		intro.fadeItems.forEach( item => {
			item.alpha = Math.max( 0, item.alpha - ( delta * 0.02 ) );
			if( item.alpha > 0 ) {
				fadeOutComplete = false;
			}
		} );
		if( fadeOutComplete ) {
			g.app.ticker.remove( runFadeOut );
			const action = intro.action;
			intro.action = () => {};
			intro.fadeItems.forEach( item => g.app.stage.removeChild( item ) );
			intro.fadeItems = [];
			action();
		}
	}

	function runFadeIn( delta ) {
		let fadeInComplete = true;
		intro.fadeItems.forEach( item => {
			item.alpha = Math.min( 1, item.alpha + ( delta * 0.02 ) );
			if( item.alpha < 1 ) {
				fadeInComplete = false;
			}
		} );
		if( fadeInComplete ) {
			g.app.ticker.remove( runFadeIn );
			intro.action();
		}
	}

	function anykey() {
		g.app.ticker.remove( run );
		intro.fadeItems.push( intro.anykey );
		intro.fadeItems.push( intro.title );
		document.removeEventListener( "keydown", anykey );
		intro.action = g.startGame;
		g.app.ticker.add( runFadeOut );
	}
} )();
