import { Suspense } from "react";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistedStore } from "./store/index"
import Router from "./routes";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Loader from "./utils/loader/loader";


function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistedStore}>

        <Suspense fallback={<Loader />}>
          <Router />
        </Suspense>

        <ToastContainer />
      </PersistGate>
    </Provider>
  )
}

export default App
