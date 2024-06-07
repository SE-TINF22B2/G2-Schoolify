"use client";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Input,
} from "@nextui-org/react";
import { MailIcon } from "lucide-react";
import React from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function Page() {
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    return (
        <div className="grid h-screen place-items-center ">
            <Card className="w-1/2">
                <CardHeader>
                    Melde dich mit deiner E-Mail und deinem Passwort an{" "}
                </CardHeader>
                <CardBody className="flex justify-center">
                    <div className="flex flex-col gap-4 justify-center">
                        <Input
                            type="email"
                            label="Email"
                            placeholder="you@example.com"
                            labelPlacement="outside"
                            startContent={
                                <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                            }
                            className="max-w-xs"
                        />
                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            labelPlacement="outside"
                            endContent={
                                <button
                                    className="focus:outline-none"
                                    type="button"
                                    onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <VisibilityIcon />
                                    ) : (
                                        <VisibilityOffIcon />
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            className="max-w-xs"
                        />
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
