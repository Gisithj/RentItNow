'use client'
import React, { useEffect } from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button, Avatar, PopoverTrigger, Popover, PopoverContent, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
import { ThemeSwitcher } from "./theme-switcher";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../lib/features/authSlice";
import { useRouter } from "next/navigation";
import { CHECK_AUTH, LOGOUT } from "@/api/auth";
import { RootState } from "@/lib/store";
// import {AcmeLogo} from "assets/vercel.svg";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = useRouter()

  const menuItems = [
    "Rent tools",
    "Become a renter",
    "How it works",
    // "Analytics",
    // "System",
    // "Deployments",
    // "My Settings",
    // "Team Settings",
    // "Help & Feedback",
    // "Log Out",
  ];
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useDispatch()
  console.log(isLoggedIn);

  const handleLogout = async ()=>{
    
    const responseData = await LOGOUT()
    console.log(responseData);
    if( responseData?.status===200){
      dispatch(logout())
      localStorage.removeItem("token");
      router.push("/auth/sign-in")
    }
  }
  const handleSettingsClick = async ()=>{
    router.push("/profile-settings")
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
    <Navbar onMenuOpenChange={setIsMenuOpen}>
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
        <NavbarItem>
          <Link color="foreground" href="#">
          Rent tools
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
          Become a renter
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
          How it works
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem >
          <ThemeSwitcher/>
        </NavbarItem>
        {isLoggedIn?
         <div className="flex flex-row gap-2 items-center">
           <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Avatar size="sm" className="cursor-pointer"/>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions" className="text-center">
                <DropdownItem key="new" onClick={handleSettingsClick}>Settings</DropdownItem>
                <DropdownItem key="copy"  className="text-danger" color="danger" onClick={handleLogout}>Logout</DropdownItem>
              </DropdownMenu>
            </Dropdown>        
           </NavbarItem>
         </div>
         
        :
          <div className="flex flex-row gap-2 items-center">
            <NavbarItem>
              <Link href="/auth/sign-in">Login</Link>
            </NavbarItem>      
            <NavbarItem>
              <Button as={Link} color="primary" href="/auth/sign-up" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </div>
       
          
        } 
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
