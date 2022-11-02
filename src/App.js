import './App.css';

import Auth from './components/Auth/Auth';
import Profile from './components/Profile/Profile';
import Subsecription from './components/Subsecription/Subsecription';
import Setting from './components/Setting/Setting';
import Report from './components/Report/Report';
import ErrorPage from './components/ErrorPage/ErrorPage';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';

import Home from './components/Home/Home';


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
        path="/profile"
        element={<Profile />}
      />
      <Route
        path="/subsecription"
        element={<Subsecription />}
      />
      <Route
        path="/setting"
        element={<Setting />}
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