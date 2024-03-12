'use client'
import React, { useEffect } from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button, Avatar, PopoverTrigger, Popover, PopoverContent, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input} from "@nextui-org/react";
import { ThemeSwitcher } from "./theme-switcher";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../lib/features/authSlice";
import { useRouter } from "next/navigation";
import { CHECK_AUTH, LOGOUT } from "@/api/auth";
import { RootState } from "@/lib/store";
import { setActiveTab } from "@/lib/features/navbarSlice";
import { IoMdSearch } from "react-icons/io";
// import {AcmeLogo} from "assets/vercel.svg";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = useRouter()

  const menuItems = [
    {label:"Home",link:"/"},
    {label:"Rent tools",link:"/rent-tools"},
    {label:"Become a renter",link:"#"},
    {label:"How it works",link:"#"},
  ];
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const activeNavBar = useSelector((state: RootState) => state.navbar.activeNavBar);
  const dispatch = useDispatch()

  const handleLogout = async ()=>{
    
    const responseData = await LOGOUT()
    if( responseData?.status===200){
      dispatch(logout())
      localStorage.removeItem("token");
      router.push("/auth/sign-in")
    }
  }
  const handleSettingsClick = async ()=>{
    router.push("/profile-settings")
  }
  const handleNavBarTabClick = (tab:string)=>{
    
    dispatch(setActiveTab(tab))
  }

  useEffect(() => {
    const checkAuth = async () => {      
      try {
          const responseData = await CHECK_AUTH().then((response)=>{
            
            if(response?.data.isAuthenticated==true){              
              dispatch(login())  
            }else{
              dispatch(logout())  
            }
          })          
      } catch (error) {
        console.error('Error checking authentication status:', error);
      }
    };
    checkAuth();    
    
  }, []);
  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth="full" className="px-32">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          {/* <AcmeLogo /> */}
          <Link color="foreground" href="/">
          <p className="font-bold text-inherit">ACME</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
      {menuItems.map((item, index) => (
          <NavbarItem key={`${item}-${index}`} >
            <Link
              color={activeNavBar===item.label.toLowerCase()?"primary":"foreground"}
              href={item.link}
              onPress={()=>handleNavBarTabClick(item.label.toLowerCase())}
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
        
        {/* <NavbarItem isActive={activeNavBar==="rent tools"?true:false} >
          <Link color={activeNavBar===menuItems[0].toLowerCase()?"primary":"foreground"} href="#" onClick={()=>handleNavBarTabClick(menuItems[0].toLowerCase())}>
          Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={activeNavBar==="rent tools"?true:false} >
          <Link color={activeNavBar===menuItems[1].toLowerCase()?"primary":"foreground"} href="#" onClick={()=>handleNavBarTabClick(menuItems[0].toLowerCase())}>
          Rent tools
          </Link>
        </NavbarItem>
        <NavbarItem isActive={activeNavBar==="become a renter"?true:false}>
          <Link color={activeNavBar===menuItems[2].toLowerCase()?"primary":"foreground"} href="#" aria-current="page" onClick={()=>handleNavBarTabClick(menuItems[1].toLowerCase())}>
          Become a renter
          </Link>
        </NavbarItem>
        <NavbarItem isActive={activeNavBar==="how it works"?true:false}>
          <Link color={activeNavBar===menuItems[2].toLowerCase()?"primary":"foreground"} href="#" onPress={()=>handleNavBarTabClick(menuItems[2].toLowerCase())}>
          How it works
          </Link>
        </NavbarItem> */}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem >
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={<IoMdSearch size={18} />}
          type="search"
        />
        </NavbarItem>
        <NavbarItem >
          <ThemeSwitcher/>
        </NavbarItem>
        {isLoggedIn?
         <div className="flex flex-row gap-2 items-center">
           <NavbarItem>
           <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings" onPress={handleSettingsClick}>My Settings</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger" onPress={handleLogout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
            {/* <Dropdown>
              <DropdownTrigger>
                <Avatar size="sm" className="cursor-pointer"/>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions" className="text-center">
                <DropdownItem key="new" onClick={handleSettingsClick}>Settings</DropdownItem>
                <DropdownItem key="copy"  className="text-danger" color="danger" onClick={handleLogout}>Logout</DropdownItem>
              </DropdownMenu>
            </Dropdown>         */}
           </NavbarItem>
         </div>
         
        :
          <div className="flex flex-row gap-2 items-center">
            <NavbarItem>
              <Link href="/auth/sign-in">Login</Link>
            </NavbarItem>      
            {/* <NavbarItem>
              <Button as={Link} color="primary" href="/auth/sign-up" variant="flat">
                Sign Up
              </Button>
            </NavbarItem> */}
          </div>
       
          
        } 
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`} >
            <Link
              color={activeNavBar===item.label.toLowerCase()?"primary":"foreground"}
              className="w-full"
              href="#"
              size="lg"
              onPress={()=>handleNavBarTabClick(item.label.toLowerCase())}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
