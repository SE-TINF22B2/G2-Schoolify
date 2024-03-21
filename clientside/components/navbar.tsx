"use client";
import {
    Navbar as NavbarNextUi,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    NavbarMenuToggle,
    NavbarMenuItem,
    NavbarMenu,
} from "@nextui-org/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import FaceOutlinedIcon from "@mui/icons-material/FaceOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const menuItems = [
      "Startseite",
      "Noten",
      "Stundenplan",
      "Mensa",
      "Abwesenheit",
      "Deployments",
      "My Settings",
      "Team Settings",
      "Help & Feedback",
      "Log Out",
    ];
    return (
        <NavbarNextUi
            classNames={{
                item: [
                    "flex",
                    "relative",
                    "h-full",
                    "items-center",
                    "data-[active=true]:after:bg-secondary",
                    "data-[active=true]:after:absolute",
                    "data-[active=true]:after:bottom-0",
                    "data-[active=true]:after:left-0",
                    "data-[active=true]:after:right-0",
                    "data-[active=true]:after:h-[5px]",
                    "data-[active=true]:after:rounded-[2px]",
                ],
            }}
            isBordered
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <Image
                        src="/images/logo_light_mode.png"
                        width={180}
                        height={100}
                        alt="test"></Image>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent
                className="hidden sm:flex gap-4 bg-popover rounded-full px-4 "
                justify="center">
                <NavbarItem isActive={usePathname() == "/" ? true : false}>
                    <Link color="primary" href="/" className="columns-1">
                        <div className="grid grid-cols-1 justify-items-center">
                            <HomeOutlinedIcon />
                            Startseite
                        </div>
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={usePathname() == "/marks" ? true : false}>
                    <Link href="/marks" aria-current="page">
                        <div className="grid grid-cols-1 justify-items-center">
                            <FaceOutlinedIcon />
                            Noten
                        </div>
                    </Link>
                </NavbarItem>
                <NavbarItem
                    isActive={usePathname() == "/timetable" ? true : false}>
                    <Link color="primary" href="/timetable">
                        <div className="grid grid-cols-1 justify-items-center">
                            <DateRangeOutlinedIcon />
                            Stundenplan
                        </div>
                    </Link>
                </NavbarItem>
                <NavbarItem
                    isActive={usePathname() == "/canteen_plan" ? true : false}>
                    <Link color="primary" href="canteen_plan">
                        <div className="grid grid-cols-1 justify-items-center">
                            <RestaurantOutlinedIcon />
                            Mensa
                        </div>
                    </Link>
                </NavbarItem>
                <NavbarItem
                    isActive={usePathname() == "/absence" ? true : false}>
                    <Link color="primary" href="/absence">
                        <div className="grid grid-cols-1 justify-items-center">
                            <VaccinesOutlinedIcon />
                            Abwesenheit
                        </div>
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Link className="rounded-full" href="#">
                        <CloudOutlinedIcon />
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link className="rounded-full" href="#">
                        <NotificationsOutlinedIcon />
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link className="rounded-full" href="#">
                        <AccountCircleOutlinedIcon />
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu>
            <NavbarMenuItem isActive={usePathname() == "/" ? true : false}>
                    <Link color="primary" href="/" className="columns-1">
                            Startseite
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem isActive={usePathname() == "/marks" ? true : false}>
                    <Link href="/marks" aria-current="page">
                            Noten
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem
                    isActive={usePathname() == "/timetable" ? true : false}>
                    <Link color="primary" href="/timetable">
                            Stundenplan
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem
                    isActive={usePathname() == "/canteen_plan" ? true : false}>
                    <Link color="primary" href="canteen_plan">
  
                            Mensa
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem
                    isActive={usePathname() == "/absence" ? true : false}>
                    <Link color="primary" href="/absence">
                            Abwesenheit
                    </Link>
                </NavbarMenuItem>
            </NavbarMenu>
        </NavbarNextUi>
    );
}
