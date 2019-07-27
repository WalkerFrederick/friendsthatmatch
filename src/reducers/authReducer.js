import {UPDATE_AUTH_IN, UPDATE_AUTH_OUT} from '../actions/types'



const initialState = {
    isAuth: false,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case UPDATE_AUTH_IN: 
           return {...state, isAuth: action.payload}
        case UPDATE_AUTH_OUT: 
            return {...state, isAuth: action.payload}
        default:
            return state
    }

}