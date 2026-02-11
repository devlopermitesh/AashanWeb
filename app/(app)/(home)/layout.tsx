"use client"
import Footer from "@/components/Footer";
import Header from "@/components/Header"

const Layout=({children}:{children:React.ReactNode})=>{
    return (
    <section className="flex flex-col w-full min-h-screen ">
  <Header />

  <main className="flex-1 flex">
  {children}
  </main>
  <Footer/>
  </section>
    )
}
export default Layout;