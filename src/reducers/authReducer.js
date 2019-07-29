import {UPDATE_AUTH_IN, UPDATE_AUTH_OUT, UPDATE_CURRENT_USER} from '../actions/types'



const initialState = {
    isAuth: false,
    user: {},
}

export default function(state = initialState, action) {
    switch(action.type) {
        case UPDATE_AUTH_IN: 
           return {...state, isAuth: action.payload}
        case UPDATE_AUTH_OUT: 
            return {...state, isAuth: action.payload}
        case UPDATE_CURRENT_USER: 
            return {...state, user: action.payload}
        default:
            return state
    }

}