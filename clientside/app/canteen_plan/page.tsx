"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  ButtonGroup,
  Skeleton,
  Spinner,
} from "@nextui-org/react";
import MealCard from "./MealCard";
import moment from "moment";
import { useEffect, useState } from "react";

type Meal = {
  foodID: number;
  name: string;
  shortName?: string;
  description: string;
  url: string;
  price: string;
  allergies?: string;
  kategorie: string;
  foodWeekFoodWeekID: number;
};

export default function Canteen() {
  const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];

  const [meals, setMeals] = useState<Array<Meal[]>>([]);
  const [statusMessage, setStatusMessage] = useState("Lade Daten...");
  const [isLoading, setIsLoading] = useState(true);
  const [activeWeek, setActiveWeek] = useState(1);
  const [resetKey, setResetKey] = useState<number>(0);
  const startDate = moment()
    .add(activeWeek - 1, "weeks")
    .startOf("isoWeek");

  const getMeals = (foodWeek: number) => {
    let week: String = "thisweek";
    if (foodWeek == 2) {
      week = "nextweek";
    }
    setIsLoading(true);
    fetch(`api/meal/canteenplan/${week}`)
      .then((res: Response) => res.json())
      .then((data: Meal[][] | { statusCode?: number; message?: string }) => {
        if (Array.isArray(data)) {
          setMeals(data);
          setIsLoading(false);
        } else {
          setStatusMessage("Keine Gerichte für diese Woche gefunden :(");
          setMeals([]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlePress = (foodWeek: number) => {
    getMeals(foodWeek);
    setActiveWeek(foodWeek);
    setResetKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    getMeals(1);
  }, []);

  if (isLoading && (!meals.length || meals.length === 0)) {
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

  const maxRows = Math.max(...meals.map((mealDay) => mealDay.length));

  return (
    <div className="flex flex-col items-center pt-5">
      <div className="flex gap-4">
        <Button
          radius="md"
          color="secondary"
          size="lg"
          variant={activeWeek === 2 ? "flat" : "solid"}
          className={
            activeWeek === 2
              ? "text-violet-700 w-36 h-16"
              : "text-white w-36 h-16"
          }
          onPress={() => handlePress(1)}
        >
          Diese Woche
        </Button>
        <Button
          radius="md"
          color="secondary"
          variant={activeWeek === 2 ? "solid" : "flat"}
          size="lg"
          className={
            activeWeek === 2
              ? "text-white w-36 h-16"
              : "text-violet-700 w-36 h-16"
          }
          onPress={() => handlePress(2)}
        >
          Nächste Woche
        </Button>
      </div>
      {!isLoading && (!meals.length || meals.length === 0) ? (
        <div className="h-96 flex items-center justify-center text-lg font-normal leading-5 text-black">
          {statusMessage}
        </div>
      ) : (
        <Table removeWrapper className="pt-5" aria-label="Weekly canteen plan">
          <TableHeader>
            {weekdays.map((day, index) => (
              <TableColumn className="bg-transparent" key={index}>
                <div className="flex flex-col justify-center items-center text-sm font-normal leading-5 text-black">
                  <p>
                    {startDate.clone().add(index, "days").format("DD[.]MM[.]")}
                  </p>
                  <p>{day}</p>
                </div>
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {Array.from({ length: maxRows || 0 }, (_, rowIndex) => (
              <TableRow key={rowIndex}>
                {weekdays.map((_, colIndex) => (
                  <TableCell
                    key={colIndex + "key" + rowIndex}
                    className={
                      colIndex === 4
                        ? "w-1/5"
                        : "w-1/5 border-r-solid border-r-2 border-r-black"
                    }
                  >
                    {meals[colIndex] && meals[colIndex][rowIndex] ? (
                      <MealCard
                        meal={meals[colIndex][rowIndex]}
                        isLoading={isLoading}
                        key={`${colIndex}_${rowIndex}_${resetKey}`}
                      />
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
