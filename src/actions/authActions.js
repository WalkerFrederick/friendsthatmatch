import {UPDATE_AUTH_IN, UPDATE_AUTH_OUT, UPDATE_CURRENT_USER} from './types'

export function updateAuthIn() {
    return function(dispatch){
        dispatch({
            type: UPDATE_AUTH_IN,
            payload: true
        })
    }
}

export function updateAuthOut() {
    return function(dispatch){
        dispatch({
            type: UPDATE_AUTH_OUT,
            payload: false
        })
    }
}

export function updateCurrentUser(user) {
    return function(dispatch){
        dispatch({
            type: UPDATE_CURRENT_USER,
            payload: user
        })
    }
}