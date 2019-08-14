import {UPDATE_CONTACTS_ACCESS} from '../actions/types'



const initialState = {
    authorizationStatus: false,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case UPDATE_CONTACTS_ACCESS: 
           return {...state, authorizationStatus: action.payload}
        default:
            return state
    }

}