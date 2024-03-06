"use client"
import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/listbox'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table'
import { Button } from '@nextui-org/button'
import React, { useState } from 'react'
import { BsCircle } from 'react-icons/bs'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'

function ProfileSettings() {
    const [activeTab,setActiveTab] = useState("prof-settings")
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    
    const handleProfileClick = () =>{
        setActiveTab("prof-settings")
    }
    const handleAccountSettingsClick = () =>{
        setActiveTab("acc-settings")
    }
  return (
    <div className='px-4 md:px-44 py-4 md:py-20 flex flex-row gap-10'>
        <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
            <Listbox variant="flat" aria-label="Listbox menu with sections">
                <ListboxSection title="Profile" showDivider>  
                <ListboxItem
                    key="profile"
                    //description="Create a new file"
                    onClick={handleProfileClick}
                    >
                    Your profile
                </ListboxItem>
              
                </ListboxSection> 
                <ListboxSection title="Appearance" showDivider>  
                <ListboxItem
                    key="profile"
                    //description="Create a new file"
                    onClick={handleProfileClick}
                    >
                    Change styles
                </ListboxItem>
              
                </ListboxSection> 
                <ListboxSection title="Settings">  
                <ListboxItem
                    key="account"
                    onClick={handleAccountSettingsClick}
                    // className="text-danger"
                    // color="danger"
                    // description="Permanently delete the file"
                  //  startContent={<DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />}
                >
                    Settings
                </ListboxItem>
                </ListboxSection> 
            </Listbox>
        </div>
        <div className='w-2/3'>
            <div className='flex flex-col gap-10'>
                <div className='text-2xl font-bold'>{activeTab==="prof-settings"?"Gisith Jayawardena":activeTab==="acc-settings"?'Settings':''}</div>
              {activeTab==="prof-settings"?
                <div>
                    <Table hideHeader aria-label="Example static collection table" className='w-full'>
                        <TableHeader>
                            <TableColumn>NAME</TableColumn>
                            <TableColumn>ROLE</TableColumn>
                        </TableHeader>
                        <TableBody>
                            <TableRow key="1" className='border-b-slate-800'>
                                <TableCell>Name</TableCell>
                                <TableCell className='text-end'>Gisith Jayawardena</TableCell>
                            </TableRow>
                            <TableRow key="2">
                                <TableCell>Email</TableCell>
                                <TableCell className='text-end'>gisithj@gmail.com</TableCell>
                            </TableRow>
                            <TableRow key="3">
                                <TableCell>Mobile No</TableCell>
                                <TableCell className='text-end'>+94 76 34 64 139</TableCell>
                            </TableRow>
                            <TableRow key="4">
                                <TableCell>Email</TableCell>
                                <TableCell className='text-end'>gisithj@gmail.com</TableCell>
                            </TableRow>
                           
                        </TableBody>
                    </Table>
                </div>
                :activeTab==="acc-settings"?
                <>
                  <Table hideHeader aria-label="Example static collection table" className='w-full'>
                        <TableHeader>
                            <TableColumn>NAME</TableColumn>
                            <TableColumn>ROLE</TableColumn>
                        </TableHeader>
                        <TableBody>
                            <TableRow key="1">
                            <TableCell>Delete your account</TableCell>
                            <TableCell className='text-end'> <Button size="sm" variant='ghost' color='danger' onPress={onOpen}>Delete account</Button></TableCell>
                            </TableRow>
                           
                        </TableBody>
                        </Table>
                          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                          <ModalContent>
                            {(onClose) => (
                              <>
                                <ModalHeader className="flex flex-col gap-1">Confirm Account Delete</ModalHeader>
                                <ModalBody>
                                  <p>Are you sure you want to delete your account?</p>
                                  <p>This action is irreversible and will permanently remove all your data associated with your account. You will lose access to your profile, settings, and any content you&apos;ve created.</p>
                                
                                </ModalBody>
                                <ModalFooter>
                                  <Button color="primary" variant="light" onPress={onClose}>
                                    Cancel
                                  </Button>
                                  <Button color="danger" onPress={onClose}>
                                    Delete account
                                  </Button>
                                </ModalFooter>
                              </>
                            )}
                          </ModalContent>
                        </Modal>
                    </>
                    
                :
                <div>
                  
                </div>
                }
            </div>
        </div>
    </div>
  )
}

export default ProfileSettings