/*
 * Appcelerator Salesforce Example Application
 *
 * This application demonstrates how to call the methods of the Salesforce module
 * (see `lib/apis.js' for example code).
 *
 * This application requires credentials to be defined before calling the Salesforce methods.
 * Modify the following set of values in the `config.json` file before running the application:
 *
 * 	"global": {
 *		"consumerKey" : "<APPLICATION CONSUMER KEY>",
 *		"consumerSecret" : "<APPLICATION CONSUMER SECRET",
 *		"securityToken" : "<USER SECURITY TOKEN>",
 *		"username": "<USERNAME>",
 *		"password": "<PASSWORD>"
 *	}
 *
 * To run the example:
 *   1. Install the appcelerator.salesforce module (if not already installed)
 *   2. Create a new Titanium Alloy application
 *   3. Add the appcelerator.salesforce module to your application's tiapp.xml file
 *   4. Copy the `app` folder from the example folder into your new Titanium application
 *   5. Update the application credentials in the `config.json` file
 *   7. Run the application
 *   8. Click on `loginApi` or `login` to verify that the credentials are correct
 */

Alloy.Globals.data = {
	'Global' : [ 'versions' ],
	'Authentication' : [ 'login', 'loginApi', 'logout', 'refresh' ],
	'SObjects' : [ 'sobjects', 'metadata', 'describe', 'create', 'retrieve', 'update', 'remove' ],
	'Blobs' : [ 'upsertBlob', 'retrieveBlob' ],
	'External': [ 'upsertExternal', 'retrieveExternal' ],
	'Query and Search' : [ 'query', 'searchQuery', 'searchScopeOrder' ]
};