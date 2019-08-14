import {UPDATE_CONTACTS_ACCESS} from './types'

export function updateContactsAccess(authorizationStatus) {
    return function(dispatch){
        dispatch({
            type: UPDATE_CONTACTS_ACCESS,
            payload: authorizationStatus
        })
    }
}