import React from 'react'
import Sidebar from '../components/sidebar'

function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <div className='flex flex-row px-4 md:px-32 py-4 md:py-20 gap-10'>
    <Sidebar/>
   {children}
</div>
  )
}

export default DashboardLayout