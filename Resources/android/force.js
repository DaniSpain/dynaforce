function info(str) {
    Ti.API.info("[Force.com] " + str);
}

function error(str) {
    Ti.API.error("[Force.com] " + str);
}

var API_VERSION = "v29.0";

var CONSUMER_KEY = Ti.App.Properties.getString("force.consumer.key");

var CONSUMER_SECRET = Ti.App.Properties.getString("force.consumer.secret");

var MOD_URL = "https://login.salesforce.com/";

var REDIRECT_URI = MOD_URL + "services/oauth2/success";

var MOD = [ "Production/Developer", "Sandbox" ];

var CUR_MOD = 0;

var LOGIN_URL = MOD_URL + "services/oauth2/authorize?display=touch&response_type=token" + "&client_id=" + Ti.Network.encodeURIComponent(CONSUMER_KEY) + "&redirect_uri=" + REDIRECT_URI;

var INSTANCE_URL = Ti.App.Properties.getString("force.instanceURL");

var ACCESS_TOKEN = Ti.App.Properties.getString("force.accessToken");

var REFRESH_TOKEN = Ti.App.Properties.getString("force.refreshToken");

exports.authorize = function(callbacks) {
    function AuthorizationWindow() {
        function cancel() {
            self.close();
            callbacks.cancel && callbacks.cancel();
        }
        var self = Ti.UI.createWindow({
            modal: true,
            backgroundColor: "#ffffff",
            title: "Force.com Login"
        });
        var view = Ti.UI.createView({
            height: Ti.UI.FILL,
            widht: Ti.UI.FILL,
            top: Alloy.Globals.top,
            layout: "vertical"
        });
        var webView = Ti.UI.createWebView({
            height: "85%",
            widht: Ti.UI.FILL,
            url: LOGIN_URL
        });
        var btnTitle = "Change to ";
        btnTitle += 0 == CUR_MOD ? MOD[1] : MOD[0];
        var modButton = Ti.UI.createButton({
            width: Ti.UI.FILL,
            bottom: 0,
            height: "80dp",
            title: btnTitle
        });
        modButton.addEventListener("click", function() {
            if (0 == CUR_MOD) {
                CUR_MOD = 1;
                MOD_URL = "https://test.salesforce.com/";
            } else {
                CUR_MOD = 0;
                MOD_URL = "https://login.salesforce.com/";
            }
            REDIRECT_URI = MOD_URL + "services/oauth2/success";
            LOGIN_URL = LOGIN_URL = MOD_URL + "services/oauth2/authorize?display=touch&response_type=token" + "&client_id=" + Ti.Network.encodeURIComponent(CONSUMER_KEY) + "&redirect_uri=" + REDIRECT_URI;
            var btnTitle = "Change to ";
            btnTitle += 0 == CUR_MOD ? MOD[1] : MOD[0];
            modButton.setTitle(btnTitle);
            webView.setUrl(LOGIN_URL);
            alert("Switched to " + MOD_URL);
        });
        view.add(webView);
        view.add(modButton);
        self.add(view);
        var ind;
        self.addEventListener("android:back", cancel);
        self.addEventListener("open", function() {
            ind = Ti.UI.createActivityIndicator({
                location: Ti.UI.ActivityIndicator.STATUS_BAR,
                type: Ti.UI.ActivityIndicator.DETERMINANT,
                message: "Loading..."
            });
            ind.show();
        });
        webView.addEventListener("load", function(e) {
            ind && ind.hide();
            self.fireEvent("urlChanged", e);
        });
        return self;
    }
    if (ACCESS_TOKEN) {
        Ti.API.info("[force] Access Token: " + Ti.Network.encodeURIComponent(ACCESS_TOKEN));
        exports.request({
            type: "GET",
            url: "/query/?q=" + Ti.Network.encodeURIComponent("SELECT Id FROM Account LIMIT 1"),
            extcallbacks: callbacks,
            callback: function() {
                Ti.API.info("[Force] Access Token is still valid");
                callbacks.success();
            }
        });
    } else {
        var authWindow = new AuthorizationWindow();
        authWindow.addEventListener("urlChanged", function(e) {
            if (-1 !== e.url.indexOf("/oauth2/success")) {
                var hash = e.url.split("#")[1];
                var elements = hash.split("&");
                for (var i = 0, l = elements.length; l > i; i++) {
                    var element = elements[i].split("=");
                    switch (element[0]) {
                      case "access_token":
                        ACCESS_TOKEN = Ti.Network.decodeURIComponent(element[1]);
                        Ti.App.Properties.setString("force.accessToken", ACCESS_TOKEN);
                        Ti.API.info("[force] Access Token: " + ACCESS_TOKEN);
                        break;

                      case "refresh_token":
                        REFRESH_TOKEN = Ti.Network.decodeURIComponent(element[1]);
                        Ti.App.Properties.setString("force.refreshToken", REFRESH_TOKEN);
                        break;

                      case "instance_url":
                        INSTANCE_URL = Ti.Network.decodeURIComponent(element[1]);
                        Ti.App.Properties.setString("force.instanceURL", INSTANCE_URL);
                        break;

                      default:                    }
                }
                callbacks && callbacks.success();
                authWindow.close();
            }
        });
        authWindow.open();
    }
};

exports.logout = function() {
    ACCESS_TOKEN = null;
    Ti.App.Properties.setString("force.accessToken", ACCESS_TOKEN);
    REFRESH_TOKEN = null;
    Ti.App.Properties.setString("force.refreshToken", REFRESH_TOKEN);
    INSTANCE_URL = null;
    Ti.App.Properties.setString("force.instanceURL", INSTANCE_URL);
};

exports.request = function(opts) {
    var xhr = Ti.Network.createHTTPClient();
    xhr.timeout = opts.timeout ? opts.timeout : 25e3;
    xhr.onload = function() {
        try {
            info(JSON.stringify(xhr));
            Number(xhr.status) >= 200 && 300 > Number(xhr.status) ? opts.callback && opts.callback(JSON.parse(this.responseText)) : opts.onerror ? opts.onerror() : error("Error during Force.com request");
        } catch (e) {
            xhr.onerror(e);
        }
    };
    opts.ondatastream && (xhr.ondatastream = function() {
        opts.ondatastream && opts.ondatastream();
    });
    xhr.onerror = function() {
        if (401 === xhr.status) {
            alert("Session expired - please log in.");
            exports.logout();
            opts.extcallbacks.expired();
            exports.authorize({
                success: function() {
                    var indexView = Alloy.createController("index").getView();
                    indexView.open();
                }
            });
        } else {
            opts.onerror && opts.onerror();
            Ti.API.info(xhr.responseText);
        }
    };
    var fullURL = INSTANCE_URL + "/services/data/" + API_VERSION + opts.url;
    info(fullURL);
    opts.type ? xhr.open(opts.type, fullURL) : xhr.open("GET", fullURL);
    xhr.validatesSecureCertificate = true;
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "OAuth " + ACCESS_TOKEN);
    xhr.setRequestHeader("X-User-Agent", "salesforce-toolkit-rest-javascript/" + API_VERSION);
    if (opts.headers) for (var i = 0, j = opts.headers.length; j > i; i++) xhr.setRequestHeader(opts.headers[i].name, opts.headers[i].value);
    opts.data ? xhr.send(JSON.stringify(opts.data)) : xhr.send(null);
};