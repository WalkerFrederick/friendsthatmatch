import {UPDATE_AUTH_IN, UPDATE_AUTH_OUT} from './types'

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
