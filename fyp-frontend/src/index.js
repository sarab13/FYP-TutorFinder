import './index.css'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from 'react-router-dom'
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { ChatContext } from './Context/ChatProvider';
  import store from './redux/store';
  import { ChakraProvider } from '@chakra-ui/react'

  let persistor = persistStore(store);

ReactDOM.render(
  <BrowserRouter>
  <ChakraProvider>
  <Provider store={store}>
    <PersistGate persistor={persistor}>
    <App />
    </PersistGate>
    </Provider>
    </ChakraProvider>
  </BrowserRouter>,
  document.getElementById('root')
);