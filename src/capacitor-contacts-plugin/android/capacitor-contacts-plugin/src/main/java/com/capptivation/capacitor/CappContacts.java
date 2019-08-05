/**
 * Credit: https://github.com/googlesamples/android-BasicContactables
 * Credit: https://github.com/apache/cordova-plugin-contacts/blob/master/src/android/ContactAccessorSdk5.java
 */
package com.capptivation.capacitor;

import android.Manifest;
import android.database.Cursor;
import android.net.Uri;
import android.provider.ContactsContract;
import android.provider.ContactsContract.CommonDataKinds;
import android.provider.ContactsContract.CommonDataKinds.Phone;
import android.util.Log;
import android.content.Context;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import java.util.HashSet;

@NativePlugin(
    permissions = {
        Manifest.permission.READ_CONTACTS
    }
)

public class CappContacts extends Plugin {

  private static final String PERMISSION_DENIED_ERROR = "Unable to access Contacts, user denied permission request";

  static final int REQUEST_CONTACTS = 12345;


    @Override
    protected void handleRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
      super.handleRequestPermissionsResult(requestCode, permissions, grantResults);

      log("handling request perms result");
      PluginCall savedCall = getSavedCall();
      if (savedCall == null) {
        log("No stored plugin call for permissions request result");
        return;
      }

      for(int result : grantResults) {
        if (result == PackageManager.PERMISSION_DENIED) {
          savedCall.error("User denied permission");
          return;
        }
      }

      if (requestCode == REQUEST_CONTACTS) {
        // We got the permission
      }
    }

      @PluginMethod()
      public void find(PluginCall call) {
        String matchingName = call.getString("matchingName");
        JSObject ret = new JSObject();
        ret.put("contacts", this.search(matchingName));
        call.success(ret);
      }

      @PluginMethod()
      public void enumerate(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("contacts", new JSArray());
        call.success(ret);
      }

      @PluginMethod()
        public void authorizationStatus(PluginCall call) {
          JSObject ret = new JSObject();
          ret.put("status", hasRequiredPermissions());
          call.success(ret);
        }

        @PluginMethod()
        public void requestAccess(PluginCall call) {
          if (!hasRequiredPermissions()) {
            saveCall(call);
            pluginRequestPermission(Manifest.permission.READ_CONTACTS, 12345);
          }
          call.success();
        }

  private JSArray search(String searchTerm) {
    // Log.d(getLogTag(), "\tSearching for: " + query + "\n");
    Cursor cursor;
    Context mContext;
    String query = "%" + searchTerm + "%";

    // Where the Contactables table excels is matching text queries,
    // not just data dumps from Contacts db.  One search term is used to query
    // display name, email address and phone number.

    // BEGIN_INCLUDE(uri_with_query)
    Uri uri = Uri.withAppendedPath(
        ContactsContract.CommonDataKinds.Contactables.CONTENT_FILTER_URI, Uri.encode(query));
    // END_INCLUDE(uri_with_query)

    // Determine which columns we should be fetching.
    HashSet<String> columnsToFetch = new HashSet<String>();
    columnsToFetch.add(ContactsContract.Data.CONTACT_ID);
    // columnsToFetch.add(ContactsContract.Data.RAW_CONTACT_ID);
    columnsToFetch.add(ContactsContract.Data.MIMETYPE);
    columnsToFetch.add(ContactsContract.Data.LOOKUP_KEY);
    columnsToFetch.add(ContactsContract.Data.DISPLAY_NAME);
    columnsToFetch.add(CommonDataKinds.StructuredName.FAMILY_NAME);
    columnsToFetch.add(CommonDataKinds.StructuredName.GIVEN_NAME);
    columnsToFetch.add(CommonDataKinds.StructuredName.MIDDLE_NAME);
    columnsToFetch.add(CommonDataKinds.Phone.NUMBER);
    columnsToFetch.add(CommonDataKinds.Phone.LABEL);
    columnsToFetch.add(CommonDataKinds.Phone.TYPE);
    columnsToFetch.add(CommonDataKinds.Phone._ID);
    columnsToFetch.add(CommonDataKinds.Email.ADDRESS);
    columnsToFetch.add(CommonDataKinds.Email.LABEL);
    columnsToFetch.add(CommonDataKinds.Email.TYPE);
    columnsToFetch.add(CommonDataKinds.Email._ID);

    // BEGIN_INCLUDE(cursor_loader)

    // Easy way to limit the query to contacts with phone numbers.
    String selection =
       ContactsContract.CommonDataKinds.Contactables.HAS_PHONE_NUMBER + " = " + 1;

    // Sort results such that rows for the same contact stay together.
    String sortBy = ContactsContract.CommonDataKinds.Contactables.LOOKUP_KEY;
    mContext = this.bridge.getContext();
    cursor = mContext.getContentResolver().query(
        uri,       // URI representing the table/resource to be queried
        columnsToFetch.toArray(new String[] {}),      // projection - the list of columns to return.  Null means "all"
        selection, // selection - Which rows to return (condition rows must match)
        null,      // selection args - can be provided separately and subbed into selection.
        sortBy);   // string specifying sort order
    // END_INCLUDE(cursor_loader)

    int limit = Integer.MAX_VALUE;
    JSArray contacts = populateContactArray(limit, cursor);

    if (!cursor.isClosed()) {
      cursor.close();
    }
    return contacts;

  }

  /**
   * Create a ContactField JSObject
   * @param cursor the current database row
   * @return a JSObject representing a ContactField
   */
  private JSObject phoneQuery(Cursor cursor) {
    JSObject phoneNumber = new JSObject();
    try {
      int typeCode = cursor.getInt(cursor.getColumnIndexOrThrow(Phone.TYPE));
      String typeLabel = cursor.getString(cursor.getColumnIndexOrThrow(Phone.LABEL));
      String type = (typeCode == Phone.TYPE_CUSTOM) ? typeLabel : getPhoneType(typeCode);
      phoneNumber.put("identifier", cursor.getString(cursor.getColumnIndexOrThrow(ContactsContract.CommonDataKinds.Phone._ID)));
      phoneNumber.put("stringValue", cursor.getString(cursor.getColumnIndexOrThrow(ContactsContract.CommonDataKinds.Phone.NUMBER)));
      phoneNumber.put("type", type);
      // Log.d(getLogTag(), "\tPhone: " + phoneNumber.getString("value") + "\n");

    } catch (IllegalArgumentException e) {
      Log.e(getLogTag(), e.getMessage(), e);
    } catch (Exception excp) {
      Log.e(getLogTag(), excp.getMessage(), excp);
    }
    return phoneNumber;
  }

  /**
   * getPhoneType converts an Android phone type into a string
   * @param type
   * @return phone type as string.
   */
  private String getPhoneType(int type) {
    String stringType;

    switch (type) {
      case Phone.TYPE_CUSTOM:
        stringType = "custom";
        break;
      case Phone.TYPE_FAX_HOME:
        stringType = "home fax";
        break;
      case Phone.TYPE_FAX_WORK:
        stringType = "work fax";
        break;
      case Phone.TYPE_HOME:
        stringType = "home";
        break;
      case Phone.TYPE_MOBILE:
        stringType = "mobile";
        break;
      case Phone.TYPE_OTHER:
      default:
        stringType = "other";
        break;
    }
    return stringType;
  }

  /**
   * Create a ContactField JSObject
   * @param cursor the current database row
   * @return a JSObject representing a ContactField
   */
  private JSObject emailQuery(Cursor cursor) {
    JSObject email = new JSObject();
    try {
      email.put("identifier", cursor.getString(cursor.getColumnIndexOrThrow(ContactsContract.CommonDataKinds.Email._ID)));
      email.put("value", cursor.getString(cursor.getColumnIndexOrThrow(ContactsContract.CommonDataKinds.Email.ADDRESS)));
      // Log.d(getLogTag(), "\tEmail: " + email.getString("value") + "\n");

    } catch (IllegalArgumentException e) {
      Log.e(getLogTag(), e.getMessage(), e);
    }
    return email;
  }

  /**
   * Creates an array of contacts from the cursor you pass in
   *
   * @param limit        max number of contacts for the array
   * @param cursor            the cursor
   * @return             a JSArray of contacts
   */
  private JSArray populateContactArray(int limit, Cursor cursor) {

    JSArray contacts = new JSArray();
    boolean newContact = true;

    if (cursor.getCount() == 0) {
      return contacts;
    }

    // Pulling the relevant value from the cursor requires knowing the column index to pull
    // it from.
    // BEGIN_INCLUDE(get_columns)
    int nameColumnIndex = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Contactables.DISPLAY_NAME);
    int lookupColumnIndex = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Contactables.LOOKUP_KEY);
    int typeColumnIndex = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Contactables.MIMETYPE);
    // END_INCLUDE(get_columns)

    // Lookup key is the easiest way to verify a row of data is for the same
    // contact as the previous row.
    String lookupKey = "";

    JSArray phones = new JSArray();
    JSArray emails = new JSArray();
    JSObject contact = new JSObject();

    while (cursor.moveToNext() && (contacts.length() <= (limit - 1))) {

      // If we are in the first row set the oldContactId
      String currentLookupKey = cursor.getString(lookupColumnIndex);
      if (cursor.getPosition() == 0) {
        lookupKey = currentLookupKey;
      }

      // When the contact ID changes we need to push the Contact object
      // to the array of contacts and create new objects.
      if (!lookupKey.equals(currentLookupKey)) {
        // Populate the Contact object with it's arrays
        // and push the contact into the contacts array
          contacts.put(populateContact(contact, phones, emails));

        // Clean up the objects
        contact = new JSObject();
        phones = new JSArray();
        emails = new JSArray();
        newContact = true;
      }

      // When we detect a new contact set the ID and display name.
      // These fields are available in every row in the result set returned.
      if (newContact) {
        newContact = false;
        String displayName = cursor.getString(nameColumnIndex);
        // Todo: Person or organization?
        //       If the contact does not have a given or family name then
        //       it is not a person.
        contact.put("contactType", 0); // Todo: Temp hack?
        contact.put("fullName", displayName);
      }

      String mimeType = cursor.getString(typeColumnIndex);
      // The data type can be determined using the mime type column.

      switch (mimeType) {
        // Todo: Also fetch given name and family name
        case ContactsContract.CommonDataKinds.Phone.CONTENT_ITEM_TYPE:
          phones.put(phoneQuery(cursor));
          break;
        case ContactsContract.CommonDataKinds.Email.CONTENT_ITEM_TYPE:
          emails.put(emailQuery(cursor));
          break;
      }
      // Set the old contact ID
      lookupKey = currentLookupKey;

    }

    // Push the last contact into the contacts array
    if (contacts.length() < limit) {
      contacts.put(populateContact(contact, phones, emails));
    }

    cursor.close();
    return contacts;
  }

  /**
   * Create a new contact using a JSObject to hold all the data.
   * @param contact
   * @param phones array of phones
   * @param emails array of emails
   * @return contact
   */
  private JSObject populateContact(JSObject contact, JSArray phones, JSArray emails) {
    try {
      if (phones.length() > 0) {
        contact.put("phoneNumbers", phones);
      }
      if (emails.length() > 0) {
        contact.put("emailAddresses", emails);
      }
    } catch (Exception e) {
      Log.e(getLogTag(), e.getMessage(), e);
    }
    return contact;
  }

}
