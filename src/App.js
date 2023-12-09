import './App.css';

import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles

import Auth from './components/Auth/Auth';
import Reset from './components/Reset/Reset';
import Leaderboard from './components/Leaderboard/Leaderboard';
import ErrorPage from './components/ErrorPage/ErrorPage';
import Templates from './components/Templates/Templates';
import Achievements from './components/Achievements/Achievements';

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
        path="/leaderboard"
        element={<Leaderboard />}
      />
      <Route
        path='/templates/you'
        element={<Templates />}
      />
      <Route 
        path='/achievements'
        element={<Achievements />}
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
