import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from 'react-router-dom'
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

  import store from './redux/store';

  let persistor = persistStore(store);

ReactDOM.render(
  <BrowserRouter>
  <Provider store={store}>
    <PersistGate persistor={persistor}>
    <App />
    </PersistGate>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);