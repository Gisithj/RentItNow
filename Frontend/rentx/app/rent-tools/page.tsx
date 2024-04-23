import React from 'react'
import CatelogSidebar from './catelog-sidebar'
import Catelog from './catelog'

function ItemCatelog() {
  return (
    <div className='px-4 sm:px-10 lg:px-32 py-4 sm:py-10 lg:py-20 flex flex-row gap-10'>
        <CatelogSidebar/>
        <Catelog/>
    </div>
  )
}

export default ItemCatelog