import { combineReducers} from 'redux'
import authReducer from './authReducer.js'
import permissionReducer  from './permissionReducer.js'

export default combineReducers({
    auth: authReducer,
    permissions: permissionReducer,
})