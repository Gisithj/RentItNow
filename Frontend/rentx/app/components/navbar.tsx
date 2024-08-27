"use client";
import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Avatar,
  PopoverTrigger,
  Popover,
  PopoverContent,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
  useDisclosure,
  Modal,
  ModalContent,
  Badge,
  DropdownSection,
} from "@nextui-org/react";
import { ThemeSwitcher } from "./theme-switcher";
import { useSelector } from "react-redux";
import { login, logout } from "../../lib/features/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { CHECK_AUTH, LOGOUT } from "@/api/auth";
import { RootState } from "@/lib/store";
import { setActiveTab } from "@/lib/features/navbarSlice";
import { IoMdNotifications, IoMdSearch } from "react-icons/io";
import { useAppDispatch } from "@/lib/hooks";
import {
  connection,
  getConnectionId,
  stopConnection,
} from "@/utils/signalrService";
import SignIn from "./signIn";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import {
  GET_NOTIFICATIONS,
  MARK_ALL_NOTIFICATIONS_AS_READ,
} from "@/api/messages";
import { Notification } from "@/utils/interfaces";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();
  const menuItems = [
    { label: "Home", link: "/" },
    { label: "Rent tools", link: "/rent-tools" },
    { label: "How it works", link: "#" },
  ];
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const activeNavBar = useSelector(
    (state: RootState) => state.navbar.activeNavBar
  );
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const handleLogout = async () => {
    stopConnection();
    const responseData = await LOGOUT();
    if (responseData?.status === 200) {
      dispatch(logout());
      localStorage.removeItem("token");
      router.push("/auth/sign-in");
    }
  };

  const handleSettingsClick = async () => {
    router.push("/profile-settings");
  };
  const handleChatOpen = async () => {
    router.push("/chat");
  };
  const handleNavBarTabClick = (tab: string) => {
    dispatch(setActiveTab(tab));
  };
  const markAllNotificationsAsRead = async () => {
    console.log("Called");
    
    const connectionId = await getConnectionId();
    try {
      console.log(currentUser?.id);
      console.log(connectionId);
      
      
      currentUser &&
        connectionId &&
        await MARK_ALL_NOTIFICATIONS_AS_READ(currentUser.id, connectionId);
    } catch (error) {}
  };
  const fetchNotification = async () => {
    try {
      const notificatins = await GET_NOTIFICATIONS(currentUser!.id).then(
        (response) => {
          setNotifications(response);
          console.log("notifications", response);
        }
      );
    } catch (error) {
      console.error("Error checking authentication status:", error);
    }
  };
  connection.on("NotificationUpdate", () => {
    console.log("notification updated called from signalR");
    
    fetchNotification();
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const responseData = await CHECK_AUTH().then((response) => {
          if (response?.data.isAuthenticated == true) {
            if (!isLoggedIn) {
              dispatch(login());
            }
            // dispatch(login())
          } else {
            dispatch(logout());
          }
        });
      } catch (error) {
        console.error("Error checking authentication status:", error);
      }
    };

    checkAuth();
    fetchNotification();
  }, [isLoggedIn, currentUser]);
  useEffect(() => {
    console.log("notifications", notifications);
  }, [notifications]);
  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
      className="px-2 md:px-32"
    >
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
        {menuItems.map(
          (item, index) =>
            !currentUser?.userRoles.includes("Renter") && (
              <NavbarItem key={`${item}-${index}`}>
                <Link
                  color={
                    activeNavBar === item.label.toLowerCase()
                      ? "primary"
                      : "foreground"
                  }
                  href={item.link}
                  onPress={() => handleNavBarTabClick(item.label.toLowerCase())}
                >
                  {item.label}
                </Link>
              </NavbarItem>
            )
        )}

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
        <NavbarItem>
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[10rem] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Type to search..."
            size="sm"
            startContent={<IoMdSearch size={18} />}
            type="search"
          />
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        {isLoggedIn ? (
          <div className="flex flex-row gap-4 items-center">
            <NavbarItem onClick={handleChatOpen} className="cursor-pointer">
              <IoChatboxEllipsesOutline size={30} />
            </NavbarItem>
            <NavbarItem>
            {
                  notifications && notifications.length > 0
                    ? 
                    <Badge
                    content={
                      notifications && notifications.length > 0
                        ? notifications.length
                        : 0
                    }
                    color="primary"
                  >
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <Button isIconOnly aria-label="Like" size="sm">
                          <IoMdNotifications size={20} />
                        </Button>
                      </DropdownTrigger>
    
                      {notifications && notifications.length > 0 ? (
                        <DropdownMenu
                          aria-label="notification Actions"
                          variant="flat"
                        >
                          <DropdownSection title="Actions">
                            {notifications.map((notification) => (
                              <DropdownItem key={notification.id}>
                                <div className="flex flex-col gap-2">
                                  <div>{notification.message}</div>
                                  <div>{notification.createdAt.toString()}</div>
                                </div>
                              </DropdownItem>
                            ))}
                          </DropdownSection>
                          <DropdownSection>
                            <DropdownItem
                              key="mark-all-read"
                              onClick={markAllNotificationsAsRead}
                            >
                              Mark all as read
                            </DropdownItem>
                          </DropdownSection>
                        </DropdownMenu>
                      ) : (
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                          <DropdownItem
                            key="logout"
                            color="danger"
                            onPress={handleLogout}
                          >
                            You are all caught up
                          </DropdownItem>
                        </DropdownMenu>
                      )}
                    </Dropdown>
                  </Badge>
                    : 
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <Button isIconOnly aria-label="Like" size="sm">
                          <IoMdNotifications size={20} />
                        </Button>
                      </DropdownTrigger>  
                  
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                          <DropdownItem
                            key="logout"
                            color="danger"
                            onPress={handleLogout}
                          >
                            You are all caught up
                          </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                }
             
            </NavbarItem>
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
                {currentUser && currentUser.userRoles.includes("Customer") ? (
                  <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2">
                      <p className="font-semibold">{currentUser?.userName}</p>
                      <p className="font-light text-xs">{currentUser?.email}</p>
                    </DropdownItem>
                    <DropdownItem key="settings" onPress={handleSettingsClick}>
                      Account settings
                    </DropdownItem>

                    <DropdownItem key="my-rentals" href="/my-rentals">
                      My rentals
                    </DropdownItem>

                    <DropdownItem
                      key="logout"
                      color="danger"
                      onPress={handleLogout}
                    >
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                ) : (
                  <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2">
                      <p className="font-semibold">{currentUser?.userName}</p>
                      <p className="font-light text-xs">{currentUser?.email}</p>
                    </DropdownItem>
                    <DropdownItem key="settings" onPress={handleSettingsClick}>
                      Account settings
                    </DropdownItem>

                    <DropdownItem
                      key="logout"
                      color="danger"
                      onPress={handleLogout}
                    >
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                )}
              </Dropdown>
            </NavbarItem>
          </div>
        ) : (
          <div className="flex flex-row gap-2 items-center">
            <NavbarItem>
              <Button onPress={onOpen}>Login</Button>
              {/* <Link href="/auth/sign-in">Login</Link> */}
            </NavbarItem>
            {/* <NavbarItem>
              <Button as={Link} color="primary" href="/auth/sign-up" variant="flat">
                Sign Up
              </Button>
            </NavbarItem> */}
          </div>
        )}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map(
          (item, index) =>
            !currentUser?.userRoles.includes("Renter") && (
              <NavbarItem key={`${item}-${index}`}>
                <Link
                  color={
                    activeNavBar === item.label.toLowerCase()
                      ? "primary"
                      : "foreground"
                  }
                  href={item.link}
                  onPress={() => handleNavBarTabClick(item.label.toLowerCase())}
                >
                  {item.label}
                </Link>
              </NavbarItem>
            )
        )}
      </NavbarMenu>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <SignIn onClose={onClose} />
        </ModalContent>
      </Modal>
    </Navbar>
  );
}
