'use client'
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/sidebar'
import ItemListings from '../components/manage-listings'
import RentalRequests from '../components/rental-requests'
import ManageListings from '../components/manage-listings'
import Settings from '../components/settings'
import { useParams,useRouter } from 'next/navigation'
import { RootState } from '@/lib/store'
import { useSelector } from 'react-redux'
//import { useRouter } from 'next/router'
import Home from '../components/home'
import NewListing from '../components/new-listing'

function Dashboard({ params }: { params: { tab: string } }) {
  const { tab } = useParams();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const sideBarTab = useSelector((state: RootState) => state.sidebar.activeSideBarTab);
  
  const [isNewListingActive,setIsNewListingActive] = useState(false)
  const handleNewListingClick = ()=>{
    setIsNewListingActive(!isNewListingActive)
  }
 useEffect(()=>{
  if(user && user.userRoles.includes('Renter')){
    router.push(`/dashboard/${tab}`)    
  }else{
    router.push('/auth/sign-in')
  }
 },[user])
  return (
    <div className='w-full'>
      {
        isNewListingActive?
        <NewListing handleNewListingClick={handleNewListingClick}/>
        :
       sideBarTab === 'rental-requests' ?
        <RentalRequests/>
        :sideBarTab === 'manage-listings' ?
        <ManageListings handleNewListingClick={handleNewListingClick}/>
        :sideBarTab === 'settings' ?
        <Settings/>
        :sideBarTab === 'home'?
        <Home/>
        :
        <></>
      }
      {/* {
        tab.includes('rental-requests') ?
        <RentalRequests/>
        :tab.includes('manage-listings') ?
        <ManageListings/>
        :tab.includes('setting') ?
        <Settings/>
        :tab.includes('home')?
        <Home/>
        :
        <></>
      } */}
        
        
        
        
    </div>
  )
}

export default Dashboard