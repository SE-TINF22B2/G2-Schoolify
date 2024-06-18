"use client";

import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import ShowMeals from "./show_meals/page";
import AddMeal from "./add_meal/page";
import { Spinner } from "@nextui-org/react";

export default function Canteen() {
  const [role, setRole] = useState<string | null | undefined>(null);

  useEffect(() => {
    const cookie = Cookies.get("role");
    setRole(cookie);
  }, []);

  if (role === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner
          label="Lade Daten..."
          color="secondary"
          labelColor="secondary"
          size="lg"
        />
      </div>
    );
  }

  return <div>{role === "Admin" ? <AddMeal /> : <ShowMeals />}</div>;
}
