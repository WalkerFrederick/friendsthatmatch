#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(CappContacts, "CappContacts",
           CAP_PLUGIN_METHOD(find, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(enumerate, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(authorizationStatus, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(requestAccess, CAPPluginReturnPromise);
)
