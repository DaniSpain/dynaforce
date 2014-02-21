//Global Configuration
var API_VERSION = 'v29.0'; //Currently hard-coded to Summer 2012 release
var CONSUMER_KEY = Ti.App.Properties.getString('force.consumer.key');
var CONSUMER_SECRET = Ti.App.Properties.getString('force.consumer.secret');
var MOD_URL = 'https://login.salesforce.com/';
var REDIRECT_URI = MOD_URL + 'services/oauth2/success';
var MOD = [
	'Production/Developer',
	'Sandbox'
];
var CUR_MOD = 0;
var LOGIN_URL = MOD_URL + 'services/oauth2/authorize?display=touch&response_type=token'
	+ '&client_id=' + Ti.Network.encodeURIComponent(CONSUMER_KEY)
	+ '&redirect_uri=' + REDIRECT_URI;

//Login Session State
var INSTANCE_URL = Ti.App.Properties.getString('force.instanceURL');
var ACCESS_TOKEN = Ti.App.Properties.getString('force.accessToken');
var REFRESH_TOKEN = Ti.App.Properties.getString('force.refreshToken');

//internal helpers
function info(str) {
	Ti.API.info('[Force.com] '+str);
}

function error(str) {
	Ti.API.error('[Force.com] '+str);
}

//Authorize a Salesforce.com User Account
exports.authorize = function(callbacks) {
	
	//Authorization Window UI Constructor
	function AuthorizationWindow() {
		var self = Ti.UI.createWindow({
			modal:true,
			backgroundColor: "#ffffff",
			title:'Force.com Login'
		});
		
		var view = Ti.UI.createView({
			height:Ti.UI.FILL,
			widht:Ti.UI.FILL,
			top: Alloy.Globals.top,
			layout: 'vertical'
		});
		
		var webView = Ti.UI.createWebView({
			height:"85%",
			widht:Ti.UI.FILL,
			url:LOGIN_URL
		});
		
		var btnTitle = "Change to ";
		if (CUR_MOD==0) btnTitle += MOD[1];
		else btnTitle += MOD[0];
		
		var modButton = Ti.UI.createButton({
			width: Ti.UI.FILL,
			bottom: 0,
			height: '80dp',
			title: btnTitle
		}); 
		
				
				
		modButton.addEventListener('click',function(e)
		{
		   if (CUR_MOD==0) {
		   	//change to sandbox
		   		CUR_MOD = 1;
		   		MOD_URL = 'https://test.salesforce.com/';
		   }
		   else {
		   	//change to prod/developer
		   		CUR_MOD = 0;
		   		MOD_URL = 'https://login.salesforce.com/';
		   }
		   REDIRECT_URI = MOD_URL + 'services/oauth2/success';
		   LOGIN_URL = LOGIN_URL = MOD_URL + 'services/oauth2/authorize?display=touch&response_type=token'
			+ '&client_id=' + Ti.Network.encodeURIComponent(CONSUMER_KEY)
			+ '&redirect_uri=' + REDIRECT_URI;
		   
		   var btnTitle = "Change to ";
			if (CUR_MOD==0) btnTitle += MOD[1];
			else btnTitle += MOD[0];
			
			modButton.setTitle(btnTitle);
			
		   
		   webView.setUrl(LOGIN_URL);
		   alert('Switched to ' + MOD_URL);
		   
		   //exports.authorize();
		   //self.close();
		});
		
		view.add(webView);
		view.add(modButton);
		self.add(view);
		
		//cancel login action
		function cancel() {
			self.close();
			callbacks.cancel && callbacks.cancel();
		}
		
		//instument cancel behavior
		var ind;
		if (Ti.Platform.osname !== 'android') {
			var b = Ti.UI.createButton({
				title:'Cancel',
				style:Ti.UI.iPhone.SystemButtonStyle.PLAIN
			});
			self.setRightNavButton(b);
			b.addEventListener('click', cancel);
		}
		else {
			self.addEventListener('android:back',cancel);
			self.addEventListener('open', function() {
				//Also, do a special activity indicator for android
				ind = Ti.UI.createActivityIndicator({
					location: Ti.UI.ActivityIndicator.STATUS_BAR,
					type: Ti.UI.ActivityIndicator.DETERMINANT,
			    		message:'Loading...',
				});
				ind.show();
			});
		}
		
		//consumer of this window will want to take action based on URL
		webView.addEventListener('load', function(e) {
			ind && ind.hide();
			self.fireEvent('urlChanged', e);
		});
		
		return self;
	}
	
	//if (ACCESS_TOKEN) {
	/*
	if (REFRESH_TOKEN) {
		//TODO: Check if token is still valid - if not, use refresh token if valid.  If not, reauthorize.
		info('[Force] REFRESH_TOKEN != null');
		
		var xhr=Titanium.Network.createHTTPClient();     
		
		xhr.onerror = function(e){ 
			Ti.API.error(JSON.stringify(e));
			Ti.API.error(JSON.stringify(this));
		 Ti.API.error('[Force] Bad Sever => ' + e.error);
		 Ti.API.error('[Force] Status => ' + this.status);
		 Ti.API.error('[Force] Response => ' + this.responseText);
		};
		
		//var fullUrl =  INSTANCE_URL + "/services/oauth2/token/";
		var fullUrl = "https://login.salesforce.com/services/oauth2/token";
		Ti.API.info('[force] Refresh Token Url: ' + fullUrl);
		xhr.open("POST",fullUrl);//ADD your  URL

		var param = 'grant_type=refresh_token&client_id=' + escape(CONSUMER_KEY) + 
			'&client_secret='+ escape(CONSUMER_SECRET) + '&refresh_token=' + escape(REFRESH_TOKEN);
		 
		//xhr.validatesSecureCertificate = true;
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.setRequestHeader('Authorization', 'Bearer  ' + ACCESS_TOKEN );
		//xhr.setRequestHeader('X-User-Agent', 'salesforce-toolkit-rest-javascript/' + API_VERSION);
		
		Ti.API.info('[Force] Params: '+ param);
		xhr.send(param);
		Ti.API.info('[Force] Request Sent');
		
		xhr.onload = function(){
			Ti.API.info("Received text: " + this.ResponseText);
			
		};
		
	}
	*/
	
	if (ACCESS_TOKEN) {
		//doing a dummy request to see if we are authenticated 
		Ti.API.info('[force] Access Token: ' + Ti.Network.encodeURIComponent(ACCESS_TOKEN));
		exports.request({
		type:'GET',
		url:'/query/?q='+Ti.Network.encodeURIComponent('SELECT Id FROM Account LIMIT 1'), 
		extcallbacks: callbacks,
		callback: function(data) {
			Ti.API.info('[Force] Access Token is still valid');
			callbacks.success();
		}
		});
	}
	
	else {
		
		var authWindow = new AuthorizationWindow();
		
		authWindow.addEventListener('urlChanged', function(e) {
			
			if (e.url.indexOf('/oauth2/success') !== -1) {
				
				var hash = e.url.split('#')[1];
				var elements = hash.split('&');
				for (var i = 0, l = elements.length; i<l; i++) {
					var element = elements[i].split('=');
					switch (element[0]) {
						case 'access_token':
							ACCESS_TOKEN = Ti.Network.decodeURIComponent(element[1]);
							Ti.App.Properties.setString('force.accessToken', ACCESS_TOKEN);
							Ti.API.info('[force] Access Token: ' + ACCESS_TOKEN);
							break;
						case 'refresh_token':
							REFRESH_TOKEN = Ti.Network.decodeURIComponent(element[1]);
							Ti.App.Properties.setString('force.refreshToken', REFRESH_TOKEN);
							break;
						case 'instance_url':
							INSTANCE_URL = Ti.Network.decodeURIComponent(element[1]);
							Ti.App.Properties.setString('force.instanceURL', INSTANCE_URL);
							break;
						default: break;
					}
				}
				if(callbacks) {
					callbacks.success();
				}
				authWindow.close();
			}
		});
		
		authWindow.open();
	}
};

//blank out session info
exports.logout = function() {
	ACCESS_TOKEN = null;
	Ti.App.Properties.setString('force.accessToken', ACCESS_TOKEN);
	REFRESH_TOKEN = null;
	Ti.App.Properties.setString('force.refreshToken', REFRESH_TOKEN);
	INSTANCE_URL = null;
	Ti.App.Properties.setString('force.instanceURL', INSTANCE_URL);
};

/**
 * Standard HTTP Request
 * @param {Object} opts
 * @description The following are valid options to pass through:
 * 	opts.timeout 	: int Timeout request
 * 	opts.type		: string GET/POST
 * 	opts.format     : json, etc.
 * 	opts.data		: mixed The data to pass
 * 	opts.url		: string The url source to call
 * 	opts.onerror	: funtion A function to execute when there is an XHR error
 * 	opts.callback   : function when successful
 */
 exports.request = function(opts) {
	// Setup the xhr object
	var xhr = Ti.Network.createHTTPClient();

	// Set the timeout or a default if one is not provided
	xhr.timeout = (opts.timeout) ? opts.timeout : 25000;

	/**
	 * When XHR request is loaded
	 */
	xhr.onload = function() {
		// If successful
		try {
			info(JSON.stringify(xhr));
			if (Number(xhr.status) >= 200 && Number(xhr.status) < 300) {
				opts.callback && opts.callback(JSON.parse(this.responseText));
			}
			else {
				if (opts.onerror) {
					opts.onerror();
				}
				else {
					error('Error during Force.com request');
					//TODO: srsly.  Need moar error handling.
				}
			}
		}
		// If not successful
		catch(e) {
        	xhr.onerror(e);
		};
	};

	if (opts.ondatastream) {
		xhr.ondatastream = function(e){
			opts.ondatastream && opts.ondatastream();
		};
    }

    /**
	 * Error handling
	 * @param {Object} e The callback object
	 */
	xhr.onerror = function(e) {
		if (xhr.status === 401) {
			alert('Session expired - please log in.');
			exports.logout();
			opts.extcallbacks.expired();
			exports.authorize({
				success: function() {
					var indexView = Alloy.createController('index').getView();
					indexView.open();
				}
			});
		}
		else {
			opts.onerror && opts.onerror();
			Ti.API.info(xhr.responseText);
		}
	};

	// Open the remote connection
	var fullURL = INSTANCE_URL+'/services/data/'+API_VERSION+opts.url;
	info(fullURL);
	if(opts.type) {
		xhr.open(opts.type, fullURL);	
	} 
	else {
		xhr.open('GET', fullURL);
	}

	xhr.validatesSecureCertificate = true;
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('Authorization', 'OAuth ' + ACCESS_TOKEN );
	xhr.setRequestHeader('X-User-Agent', 'salesforce-toolkit-rest-javascript/' + API_VERSION);

    if(opts.headers) {
        for(var i = 0, j = opts.headers.length; i < j; i++) {
            xhr.setRequestHeader( opts.headers[i].name, opts.headers[i].value );
        }
    }

    if(opts.data) {
		// send the data
        xhr.send(JSON.stringify(opts.data));
	} 
	else {
		xhr.send(null);
	}
};
