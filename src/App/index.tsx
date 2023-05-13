import Chat from '@/pages/Chat'
import More from '@/pages/More'
import { StyleProvider } from '@ant-design/cssinjs'
import { useMount } from 'ahooks'
import { ConfigProvider } from 'antd'
import React from 'react'
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

  return (
    <React.StrictMode>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#3d3df5',
            colorPrimaryHover: '#3d3df5',
            wireframe: false,
            // borderRadius: 8,
            // borderRadiusSM: 6,
            // borderRadiusXS: 4,
          },
          components: {
            Input: {
              colorBorder: 'transparent',
            },
            InputNumber: {
              colorBorder: 'transparent',
            },
            Select: {
              colorBorder: 'transparent',
            },
          },
        }}
      >
        <StyleProvider hashPriority="high">
          <RouterProvider router={router} />
        </StyleProvider>
      </ConfigProvider>
    </React.StrictMode>
  )
}
