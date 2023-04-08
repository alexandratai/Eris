import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import session from './session';
import serverReducer from './servers';
import channelReducer from './channels';
import messageReducer from './messages';
const REMOVE_USER = "session/REMOVE_USER";

const appReducer = combineReducers({
  session,
  servers: serverReducer,
  channels: channelReducer,
  messages: messageReducer,
});

const rootReducer = (state, action) => {
  if (action.type === REMOVE_USER) {
    return appReducer(undefined, action)
    // ^ Note: Reducers are supposed to return the initial state 
    // when they are called with undefined as the first argument, no matter the action
  };

  return appReducer(state, action);
};

let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
