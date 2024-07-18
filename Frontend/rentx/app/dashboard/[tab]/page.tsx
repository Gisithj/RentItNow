'use client'
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/sidebar'
import ItemListings from '../components/manage-listing/manage-listings'
import RentalRequests from '../components/rental-request/rental-requests'
import ManageListings from '../components/manage-listing/manage-listings'
import Settings from '../components/settings'
import { useParams,useRouter } from 'next/navigation'
import { RootState } from '@/lib/store'
import { useSelector } from 'react-redux'
//import { useRouter } from 'next/router'
import Home from '../components/home'
import NewListing from '../components/manage-listing/new-listing'
import ProfileSettings from '@/app/profile-settings/page'

function Dashboard({ params }: { params: { tab: string } }) {
  const { tab } = useParams();
  console.log(tab);
  
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const sideBarTab = useSelector((state: RootState) => state.sidebar.activeSideBarTab);
  
  const [isNewListingActive,setIsNewListingActive] = useState(false)
  const [isEditistingActive,setIsEditListingActive] = useState(false)

  const handleNewListingClick = ()=>{
    setIsNewListingActive(!isNewListingActive)
  }
  const handleEditListingClick = ()=>{
    setIsEditListingActive(!isEditistingActive)
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
      {/* {
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
      } */}
      {
        //  isNewListingActive?
        //  <NewListing handleNewListingClick={handleNewListingClick}/>
        //  :
        //  isEditistingActive?
        //  <NewListing handleNewListingClick={handleNewListingClick}/>
        //  :
          tab.includes('add-new-listing')?
          <NewListing isInEditMode={false}/>
          :tab.includes('rental-requests') ?
          <RentalRequests/>
          :tab.includes('manage-listings') ?
          //<ManageListings handleNewListingClick={handleNewListingClick} handleEditListingClick={handleEditListingClick}/>
          <ManageListings />
          :tab.includes('setting') ?
          <ProfileSettings/>
          :tab.includes('home')?
          <Home/>
          :
          <></>
      }
        
        
        
        
    </div>
  )
}

export default Dashboard