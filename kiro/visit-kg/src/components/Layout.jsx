import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Toast from './Toast'

export default function Layout() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '64px' }}>
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </>
  )
}
