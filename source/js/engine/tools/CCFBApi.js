/*-----------------------------------------------------------
 * 2c - Cross Platform 3D Application Framework
 *-----------------------------------------------------------
 * Copyright © 2011 - 2011 France Telecom
 * This software is distributed under the Apache 2.0 license.
 * http://www.apache.org/licenses/LICENSE-2.0.html
 *-----------------------------------------------------------
 * File Name   : CCFBApi.js
 * Description : Contains point respresentative structures.
 *
 * Created     : 30/10/11
 * Author(s)   : Ashraf Samy Hegab
 *-----------------------------------------------------------
 */

function CCFBApi()
{
	this.APPLICATION_ID = "138263572915502";
	this.API_PERMISSIONS = "user_photos,";
	this.API_PERMISSIONS += "friends_photos,";
//"user_photo_video_tags," \
//"friends_photo_video_tags,";// \
//"user_videos," \
//"user_activities," \
//"user_groups," \
//"user_interests," \
//"user_likes," \
//"user_notes," \
//"user_online_presence," \
//"user_status," \
//"read_friendlists," \
//"read_requests," \
//"offline_access," \
//"friends_activities," \
//"friends_events," \
//"friends_groups," \
//"friends_likes," \
//"friends_notes," \
//"friends_online_presence," \
//"publish_stream," \
//"read_mailbox," \
//"read_stream" \
;
	this.API_URL = "https://graph.facebook.com/";
    this.m_userAccessToken = false;
};


function CCFBCallback(callback)
{
	this.callback = callback;
}
CCFBCallback.prototype.run = function(status, responseText, httpObject)
{
	function Reply() {}
	var reply = new Reply();
    reply.httpObject = httpObject;
	reply.data = responseText;
	reply.state = status;
	if( responseText.indexOf( "OAuthException" ) > -1 )
	{
		reply.state = CCURLRequest_data_error;
	}
	else if( responseText == "false" )
	{
		reply.state = CCURLRequest_data_error;
	}
	this.callback.reply = reply;
	this.callback.run();
}


function SetCacheFilePath(apiCall)
{
    apiCall.replace( ".", "/" )
    return apiCall;
}


CCFBApi.prototype.Request = function(inCallback, 
									 apiCall, 
									 priority, 
									 refresh,
									 timeout,
									 limit, 
									 offset)
{
	if( !this.m_userAccessToken )
	{
		//return;
	}
	
	if( !refresh )
	{
		refresh = false; 
	}
	
	if( !timeout )
	{
		timeout = 0;
	}
	
	if( !limit )
	{
		limit = -1;
	}
	
	if( !offset )
	{
		offset = -1;
	}
		

    var url = this.API_URL;
    url += apiCall;

    var cacheFilePath = SetCacheFilePath( apiCall );
    
    url += "?access_token=" + this.m_userAccessToken;

    if( limit != -1 )
    {
        url += "&limit=";
        url += limit;
    }

    if( offset != -1 )
    {
        url += "&offset=";
        url += offset;
    }

	gURLManager.requestURL( url, 
							null, 
							new CCFBCallback( inCallback ),
                            cacheFilePath,
                            refresh );
}


CCFBApi.prototype.RequestPhotoID = function(fbInterface, photoID, priority)
{
    var apiCall = photoID;
    apiCall += "/picture";
    
    var cacheFilePath = SetCacheFilePath( apiCall );
    
    var url = "./server/server.php?request=fbprofilephoto";
    url += "&id=" + photoID;
    url += "&token=" + this.m_userAccessToken;
    
    gURLManager.requestURL( url, 
                            null, 
                            new CCFBCallback( fbInterface ),
                            cacheFilePath,
                            false );
    
//    gEngine->urlManager->requestURL( url.buffer,
//                                     new CCFBPhotoCallback( fbInterface,
//                                                          "photoHeader", 
//                                                          photoID, 
//                                                          photoFilePath.buffer ),
//                                     priority );
//    }
}


CCFBApi.prototype.GetAuthorizationURL = function()
{
	var authorizationURL = "https://www.facebook.com/dialog/oauth";
    authorizationURL += "?client_id=";
    authorizationURL += this.APPLICATION_ID;
    authorizationURL += "&redirect_uri=http://" + window.location.hostname + "/connect/login_success.html&";
    authorizationURL += "type=user_agent&";
    authorizationURL += "display=popup&";
    authorizationURL += "scope=";
    authorizationURL += this.API_PERMISSIONS;
    return authorizationURL;
}


CCFBApi.prototype.ProcessLogin = function(url)
{
	var splitURL = url.split( "/connect/login_success.html" );
    if( splitURL.length > 1 )
    {
		splitURL = url.split( "login_success.html#access_token" );
        if( splitURL.length > 1 )
        {
			var token = gTools.stringSplitBetween( url, "#access_token=", "&" );
            this.SetUserAccessToken( token );
        }
        return true;
    }

    return false;
}

CCFBApi.prototype.SetUserAccessToken = function(token)
{
	this.m_userAccessToken = token;
}


function CCFBApiCheckLogin()
{
	var fbApi = gEngine.fbApi;
	var loginWindow = fbApi.loginWindow;
	if( loginWindow )
	{
		if( loginWindow.closed )
		{
			fbApi.onBrowserClosed();
		}
		else
		{
			var location = false;
			try
			{
				location = loginWindow.location.href;
			}
			catch(e)
			{
				location = false;
			}
			
			if( location && fbApi.ProcessLogin( loginWindow.location.href ) )
			{
				loginWindow.close();
				fbApi.onBrowserClosed();
			}
			else
			{
				setTimeout( CCFBApiCheckLogin, 33 );
			}
		}
	}
}


CCFBApi.prototype.LaunchBrowser = function(callback)
{
	if( !this.m_onSuccess )
	{		
		var loginWindow = this.loginWindow = window.open( this.GetAuthorizationURL(), '2c', 'width=320, height=480' );
		if( loginWindow )
		{
			this.m_onSuccess = callback;
			setTimeout( CCFBApiCheckLogin, 33 );
		}
		else
		{
			alert( "A popup window is required to log into Facebook.\nPlease enable popups and try again." );
		}
	}
}


CCFBApi.prototype.onBrowserClosed = function()
{
	this.loginWindow = false;
	
	if( this.m_onSuccess != false )
    {
        if( this.m_userAccessToken == false )
        {
            // See if we have any offline data
            var data = gTools.loadData( "me" );
            if( data != false )
            {
                var r = confirm( "Unable to login\nUse offline data?" );
                if( r == true )
                {
                    this.m_userAccessToken = true;
                }
            }
        }
        
        if( this.m_userAccessToken != false )
        {
			gURLManager.setDomainTimeOut( "facebook.com", 1.0 );
			this.m_onSuccess.run();
			this.m_onSuccess = false;
        }
        else
        {
            this.m_onSuccess = false;
        }
    }
}