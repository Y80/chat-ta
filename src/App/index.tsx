import Chat from '@/pages/Chat'
import More from '@/pages/More'
import { useMount } from 'ahooks'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './Layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Chat />,
      },
      {
        path: '/more',
        element: <More />,
      },
    ],
  },
])

export default function App() {
  useMount(() => {
    window.__removeAppMask?.()
  })

  return <RouterProvider router={router} />
}
