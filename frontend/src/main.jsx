import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
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

    <RouterProvider router={routes} />

)
