import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './redux/store.js'
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './pages/Home.jsx'

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
   ,
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={routes} />
  </Provider>
)
