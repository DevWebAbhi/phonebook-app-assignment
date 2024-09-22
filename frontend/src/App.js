import logo from './logo.svg';
import './App.css';
import {Provider} from 'react-redux'
import { store } from './redux/store';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom';
import AllRoutes from './AllRoutes';
import Navbar from './components/Navbar';
function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <ChakraProvider>
          <BrowserRouter>
          <Navbar/>
               <AllRoutes/>
          </BrowserRouter>
        </ChakraProvider>

      </Provider>
    </div>
  );
}

export default App;
