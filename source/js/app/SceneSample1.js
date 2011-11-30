/*-----------------------------------------------------------
 * 2c - Cross Platform 3D Application Framework
 *-----------------------------------------------------------
 * Copyright © 2010 - 2011 France Telecom
 * This software is distributed under the Apache 2.0 license.
 * http://www.apache.org/licenses/LICENSE-2.0.html
 *-----------------------------------------------------------
 * File Name   : SceneSample1.js
 * Description : Sample demonstrating a scene with one tile.
 *
 * Created     : 30/11/11
 *-----------------------------------------------------------
 */
 
function SceneSample1()
{
    this.construct();
    
    // Create a new camera
    var camera = this.camera = new CCCameraAppUI();
    gEngine.addCamera( camera );
    
    // Set it up to take up the entire screen
    camera.setupViewport( 0.0, 0.0, 1.0, 1.0 );
}

// Inherit from CCSceneAppUI class
CopyPrototype( SceneSample1, CCSceneAppUI, "CCSceneAppUI" );


SceneSample1.prototype.setup = function()
{
    // Set our virtual camera width to be 320
    // This means that the width of the view will be 320
    var camera = this.camera;
	camera.setCameraWidth( 320.0 );
    
    // Create a tile
    {
        var tile = new CCTile3DButton( this );  // Pass in this scene
        tile.setupText( "Hello World",          // Tell it to say 'Hello World'
                        64.0,                   // Specify the height of the text
                        true );                 // Request the text to be centered
        
        // Set the colour of the text model to be white
        tile.textModel.setColour( gColour.white() );
        
        // Add the tile to our list of touchable tiles, to allow for user interaction
        this.addTile( tile );
    }
    
    // Refresh: create tile
    if( false )
    {
        var tile = new CCTile3DButton( this ).setup( this.camera.cameraWidth, 64.0, "Hello World" );
        tile.textModel.setColour( gColour.white() );
        this.addTile( tile );
    }
}


SceneSample1.prototype.updateScene = function(delta)
{
    // Called once a frame and internally updates all objects managed by this scene
	this.CCSceneAppUI_updateScene( delta );
}


SceneSample1.prototype.render = function(renderer, camera, pass, alpha)
{
    // Handles drawing objects only in view
    this.CCSceneAppUI_render( renderer, camera, pass, alpha );
}


SceneSample1.prototype.touchMoving = function(touch)
{
    // Callback for when a touch is moving
    return this.CCSceneAppUI_touchMoving( touch );
}


SceneSample1.prototype.touchReleased = function(touch)
{
    // Callback for when a touch is moving
    return this.CCSceneAppUI_touchReleased( touch );
}