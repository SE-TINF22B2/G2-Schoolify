"use client";
import {
    Button,
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
function loginRequest(
    email: string,
    password: string,
    setErrorMessage: any,
    setIsLoggedIn: any
) {
    fetch("api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.statusCode === 200) {
                setIsLoggedIn(true);
            }else{
                setErrorMessage(data.message);
            }

            console.log(data);
        })
        .catch((error) => {
            setErrorMessage(error);
        });

    console.log(email, password);
}

export default function Page() {
    const [isVisible, setIsVisible] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);

    const toggleVisibility = () => setIsVisible(!isVisible);
    return (
        <div className="grid h-screen place-items-center ">
            <Card className="w-1/2 h-1/2">
                <CardHeader className="flex justify-center text-2xl font-semibold mt-4">
                    Melde dich hier an.
                </CardHeader>
                <CardBody className="flex justify-center">
                    <div className="flex flex-col gap-4 justify-center place-items-center">
                        <Input
                            isRequired
                            onChange={(e) => setEmail(e.target.value)}
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
                            isRequired
                            label="Password"
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
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
                <CardFooter className="flex-col justify-center">
                    <div className="text-rose-700 text-xs mb-4">{errorMessage}</div>
                    <Button
                        color="secondary"
                        className="text-white text-1xl mb-4 w-1/4"
                        onClick={() =>
                            loginRequest(
                                email,
                                password,
                                setErrorMessage,
                                setIsLoggedIn
                            )
                        }>
                        Anmelden
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
