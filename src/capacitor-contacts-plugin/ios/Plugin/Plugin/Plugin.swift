//
//  Plugin.swift
//
//
//  Created by Kwabena Adu on 12/25/18.
//  Credit: https://github.com/cjorasch/capacitor-test3

import Foundation
import Capacitor
import Contacts

typealias JSObject = [String:Any]
typealias JSArray = [JSObject]

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/ios
 */
@objc(CappContacts)
public class CappContacts: CAPPlugin {
    
    
    // Find all matching contacts who have a phone number
    // Gets a list of contacts
    @objc func find(_ call: CAPPluginCall) {
        // TODO: maxItems?
        // Get the specified predicate
        var predicate: NSPredicate?
        if let matchingName = call.getString("matchingName") {
            // Note: if matchingName is blank then invalid predicate error
            predicate = CNContact.predicateForContacts(matchingName:matchingName)
        } else if let withIdentifiers = call.getArray("withIdentifiers", String.self) {
            predicate = CNContact.predicateForContacts(withIdentifiers: withIdentifiers)
        }
        if predicate == nil {
            call.error("Must specify matching")
            return
        }
        
        let keysToFetch = getKeyDescriptors(call.getArray("keysToFetch", String.self))
        
        do {
            let contacts = try CNContactStore().unifiedContacts(matching: predicate!, keysToFetch: keysToFetch)
            call.success([
                "contacts": convertContacts(contacts, keys: keysToFetch)
                ])
        } catch {
            call.error(error.localizedDescription, error)
        }
    }
    
    @objc func enumerate(_ call: CAPPluginCall) {
        let store = CNContactStore()
        do {
            // Initialize the array of results
            var contacts = [CNContact]()
            
            // Specify the keys to load
            let keysToFetch = getKeyDescriptors(call.getArray("keysToFetch", String.self))
            
            // Step through all of the Contacts
            try store.enumerateContacts(with:CNContactFetchRequest(keysToFetch: keysToFetch)) { (contact, pointer) -> Void in
                // TODO: check search criteria
                contacts.append(contact)
            }
            
            call.success([
                "contacts": convertContacts(contacts, keys: keysToFetch)
                ])
        } catch let error as NSError {
            call.error(error.localizedDescription, error)
        }
        
    }
    
    // Get the current authorization status for contacts
    @objc func authorizationStatus(_ call: CAPPluginCall) {
        let entityTypeInt = call.getInt("entityType", 0) ?? CNEntityType.contacts.rawValue
        let entityType = CNEntityType(rawValue:entityTypeInt)
        let status = CNContactStore.authorizationStatus(for:entityType!)
        call.success([
            "status": status.rawValue
            ])
    }
    
    // Request access to Contacts.  Displays a dialog to allow/deny access if first time
    @objc func requestAccess(_ call: CAPPluginCall) {
        // TODO: ability to specify entity type?
        // Check if access has already been granted
        let status = CNContactStore.authorizationStatus(for:CNEntityType.contacts)
        if status == .authorized {
            call.success([
                "status": true
                ])
        }
        
        // Request access
        CNContactStore().requestAccess(for: CNEntityType.contacts) { (userCanAccessContacts, error) in
            if (userCanAccessContacts) {
                call.success([
                    "status": true
                    ])
            } else {
                call.success([
                    "status": false
                    ])
            }
        }
    }
    
    // ----- CNKeyDescriptor -----
    
    let noKeys = [] as [CNKeyDescriptor]
    
    let allKeys = [
        CNContactEmailAddressesKey,
        CNContactFamilyNameKey,
        CNContactGivenNameKey,
        CNContactIdentifierKey,
        CNContactMiddleNameKey,
        CNContactNamePrefixKey,
        CNContactNameSuffixKey,
        CNContactPhoneNumbersKey,
        CNContactTypeKey,
        ] as [CNKeyDescriptor]
    
    // Convert list of keys to [CNKeyDescriptor] with default value if not specified
    // Also fetch fullName key
    private func getKeyDescriptors(_ keys: [String]?) -> [CNKeyDescriptor] {
        if keys == nil {
            let fullNameKey = CNContactFormatter.descriptorForRequiredKeys(for: CNContactFormatterStyle.fullName)
            var keyDescriptors = []  as [CNKeyDescriptor];
            keyDescriptors += allKeys
            keyDescriptors.append(fullNameKey)
            return keyDescriptors
        } else {
            return keys! as [CNKeyDescriptor]
        }
    }
    
    // Convert [CNContact] to JSArray
    private func convertContacts(_ nativeContacts: [CNContact], keys: [CNKeyDescriptor]) -> JSArray {
        var contacts = JSArray()
        for nativeContact in nativeContacts {
            if let contact = convertContact(nativeContact, keys: keys) {
                contacts.append(contact)
            }
        }
        return contacts
    }
    
    // Convert CNContact to JSObject
    private func convertContact(_ nativeContact: CNContact?, keys: [CNKeyDescriptor]) -> JSObject? {
        if nativeContact == nil {
            return nil
        }
        let contact = nativeContact!
        
        var result = JSObject()
        
        // Always send the identifier
        // if keys.index(where: {$0 === "identifier" as CNKeyDescriptor}) != nil {
        //    result["identifier"] = contact.identifier
        // }
        
        result["identifier"] = contact.identifier
        if contact.isKeyAvailable("contactType") {
            result["contactType"] = contact.contactType.rawValue
        }
        if contact.isKeyAvailable("namePrefix") {
            setProp(&result, "namePrefix", contact.namePrefix)
        }
        if contact.isKeyAvailable("givenName") {
            setProp(&result, "givenName", contact.givenName)
        }
        if contact.isKeyAvailable("familyName") {
            setProp(&result, "familyName", contact.familyName)
        }
        if contact.isKeyAvailable("middleName") {
            setProp(&result, "middleName", contact.middleName)
        }
        if contact.isKeyAvailable("nameSuffix") {
            setProp(&result, "nameSuffix", contact.nameSuffix)
        }
        let fullName = CNContactFormatter.string(from: contact, style: .fullName)
        setProp(&result, "fullName", fullName)
        if contact.isKeyAvailable("phoneNumbers") && contact.phoneNumbers.count > 0 {
            result["phoneNumbers"] = contact.phoneNumbers.map { (item) -> [String: Any] in
                var dict = convertLabeledValue(item)
                setProp(&dict, "stringValue", item.value.stringValue)
                setProp(&dict, "countryCode",item.value.value(forKey: "countryCode") as? String)
                setProp(&dict, "digits", item.value.value(forKey: "digits") as? String)
                return dict
            }
        }
        if contact.isKeyAvailable("emailAddresses") && contact.emailAddresses.count > 0 {
            result["emailAddresses"] = contact.emailAddresses.map { (item) -> [String: Any] in
                var dict = convertLabeledValue(item)
                setProp(&dict, "value", item.value as String)
                return dict
            }
        }
        return result;
    }
    // Convert CNLabeledValue<T> to serializable value
    private func convertLabeledValue<T>(_ item: CNLabeledValue<T>) -> JSObject {
        var dict = JSObject()
        dict["identifier"] = item.identifier
        if var label = item.label {
            if label.hasPrefix("_$!<") && label.hasSuffix(">!$_") {
                let start = label.index(label.startIndex, offsetBy: 4)
                let end = label.index(label.endIndex, offsetBy: -4)
                label = String(label[start..<end])
            }
            setProp(&dict, "label", label)
        }
        // setProp(&dict, "localizedLabel", item.label == nil ? nil : CNLabeledValue<T>.localizedString(forLabel: item.label!))
        return dict
    }
    
    // TODO: check for empty and trim?  or pass through actual values?
    // Set a property value if a value is not blank
    private func setProp(_ dict: inout [String: Any], _ key: String, _ value: String?) {
        // Ignore if value is nil or empty
        if let value = value, !value.isEmpty {
            // TODO: why trim?
            // Trim whitespace
            let trimmed = value.trimmingCharacters(in: .whitespacesAndNewlines)
            
            // Ignore if trimmed value is empty
            if (!trimmed.isEmpty) {
                // Set the property value
                dict[key] = value
            }
        }
    }
}
