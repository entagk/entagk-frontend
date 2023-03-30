import './App.css';

import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles

import Auth from './components/Auth/Auth';
import Reset from './components/Reset/Reset';
import Profile from './components/Profile/Profile';
import Subsecription from './components/Subsecription/Subsecription';
import Report from './components/Report/Report';
import ErrorPage from './components/ErrorPage/ErrorPage';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';

import Home from './components/Home/Home';


AOS.init();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='' errorElement={<ErrorPage />}>
      <Route
        path='/'
        element={<Home />}
      />
      <Route
        path='/auth'
        element={<Auth />}
      />
      <Route
        path='/reset/:tokenId'
        element={<Reset />}
      />
      <Route
        path="/profile"
        element={<Profile />}
      />
      <Route
        path="/subsecription"
        element={<Subsecription />}
      />
      <Route
        path="/report"
        element={<Report />}
      />
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App;
