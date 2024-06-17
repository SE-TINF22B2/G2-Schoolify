"use client";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  CardHeader,
  Skeleton,
} from "@nextui-org/react";
import { useState } from "react";
import ReactCardFlip from "react-card-flip";
import VegetarianIcon from "../icons/VegetarianIcon";
import VeganIcon from "../icons/VeganIcon";
import PorkIcon from "../icons/PorkIcon";
import BeefIcon from "../icons/BeefIcon";

interface MealCardProps {
  meal: {
    foodID: number;
    name: string;
    shortName?: string;
    description: string;
    url: string;
    price: string;
    kategorie: string;
    allergies?: string;
    foodWeekFoodWeekID: number;
  };
  isLoading: boolean;
}

export default function MealCard({ meal, isLoading }: MealCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };
  const Icon = () => {
    if (meal.kategorie === "Vegetarisch") {
      return <VegetarianIcon />;
    } else if (meal.kategorie === "Schweinefleisch") {
      return <PorkIcon />;
    } else if (meal.kategorie === "Rindfleisch") {
      return <BeefIcon />;
    } else if (meal.kategorie === "Vegan") {
      return <VeganIcon />;
    }
    return null;
  };

  return (
    <div className="flex justify-center items-center">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        {/* Front side */}
        <Card
          shadow="sm"
          className="h-52 w-52"
          key={meal.name}
          isPressable
          onPress={handleClick}
        >
          <CardBody className="overflow-visible p-0">
            <Skeleton isLoaded={!isLoading} className="rounded-lg">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt={meal.name}
                className="w-full object-cover h-[160px]"
                src={meal.url}
              />
            </Skeleton>
          </CardBody>
          <CardFooter className="text-small justify-between">
            <Skeleton isLoaded={!isLoading} className="rounded-lg">
              <div className="flex items-start gap-1">
                {Icon()}
                <h4 className="text-black text-left text-base font-bold leading-6">
                  {meal.shortName ? meal.shortName : meal.name}
                </h4>
              </div>
            </Skeleton>
            <Skeleton isLoaded={!isLoading} className="rounded-lg">
              <p className="text-default-500">{meal.price + " €"}</p>
            </Skeleton>
          </CardFooter>
        </Card>

        {/* Back side */}
        <Card
          shadow="sm"
          className="h-52 w-52"
          key={meal.name}
          isPressable
          onPress={handleClick}
        >
          <CardHeader className="flex items-start gap-2">
            {Icon()}
            <h4 className="text-black text-left text-base font-bold leading-6">
              {meal.name}
            </h4>
          </CardHeader>
          <CardBody className="px-2 py-0 text-black text-sm font-normal leading-6">
            <p className="pl-8">{meal.description}</p>
          </CardBody>
          <CardFooter className="text-small justify-between">
            <p className="text-gray-600 text-center font-roboto text-base font-normal leading-6">
              {meal.price + " €"}
            </p>
            <p className="text-gray-600 text-xs font-normal font-light leading-6">
              {meal.allergies ? meal.allergies : "Keine"}
            </p>
          </CardFooter>
        </Card>
      </ReactCardFlip>
    </div>
  );
}
