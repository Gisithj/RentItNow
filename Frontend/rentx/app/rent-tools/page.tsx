import React from 'react'
import CatelogSidebar from './catelog-sidebar'
import Catelog from './catelog'

function ItemCatelog() {
  return (
    <div className='px-4 md:px-32 py-4 md:py-20 flex flex-row gap-10'>
        <CatelogSidebar/>
        <Catelog/>
    </div>
  )
}

export default ItemCatelog