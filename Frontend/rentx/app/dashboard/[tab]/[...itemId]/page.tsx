'use client'
import { useParams } from 'next/navigation';
import React from 'react'
import NewListing from '../../components/manage-listing/new-listing';

function EditListing({ params }: { params: { itemId: string } }) {
  const { tab,itemId } = useParams();
  console.log(itemId);
  return (
    <NewListing isInEditMode={true} itemId={itemId[0]}/>
  )
}

export default EditListing