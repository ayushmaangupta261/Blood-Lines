import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './redux/store.js'
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'



const routes = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {

            }
        ]
    }
])

createRoot(document.getElementById('root')).render(

    <Provider store={store}>
        <RouterProvider router={routes} />
    </Provider>

)
