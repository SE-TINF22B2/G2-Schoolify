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
} from "@nextui-org/react";
import MealCard from "./MealCard";
import moment from "moment";
import { useEffect, useState } from "react";

type Meal = {
  foodID: number;
  name: string;
  shortName?: string;
  description: string;
  img: string;
  price: string;
  allergies: string;
  kategorie: string;
  foodWeekFoodWeekID: number;
};

const thisWeek: Array<Meal[]> = [
  [
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Griechische Reispfanne",
      shortName: "Reispfanne",
      description: "mit Sojastreifen, Gemüse und Kräuterdip",
      img: "https://www.edeka.de/media/01-rezeptbilder/rezeptbilder-e-h/rez-edeka-griechische-reispfanne-rezept-e-h-1-1.jpg",
      price: "$5.50",
      kategorie: "Vegetarian",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Pommes",
      description: "wahlweise mit Mayo oder Ketchup",
      img: "https://media.istockphoto.com/id/966934632/de/foto/schmackhafte-pommes-frites-in-eine-sch%C3%BCssel-geben.jpg?s=612x612&w=0&k=20&c=7q1DvvLQuEQE7wZmGkiWPWsJzoYAPE0MwsNXWdkpnLQ=",
      price: "$3.00",
      kategorie: "Vegan",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Paniertes Schweineschnitzel",
      shortName: "Schnitzel",
      description: "Beilage Soße",
      img: "https://media.istockphoto.com/id/603258520/photo/schnitzel-and-fried-potatoes.jpg?s=612x612&w=0&k=20&c=RXAndwtpKN2XUvV_TCkCQCfdlQ6sjJXTOiNpq7Kphs0=",
      price: "$10.00",
      kategorie: "Pork",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
  ],
  [
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Bunter Salat",
      description: "Feldsalat mit Obst und Käse",
      img: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=420&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXRodW1ibmFpbHx8OTI1MTcyM3x8ZW58MHx8fHx8",
      price: "$10.00",
      kategorie: "Vegetarian",
      allergies: "[G]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Spaghetti Bolognese",
      shortName: "Bolognese",
      description: "mit Rinderhack und Parmesan",
      img: "https://img.freepik.com/free-photo/healthy-lunch-vegetarian-pasta-with-fresh-tomato-generated-by-ai_24640-81714.jpg",
      price: "$10.00",
      kategorie: "Beef",
      allergies: "[Ei,ML]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Linsen Bolognese",
      shortName: "Bolognese",
      description: "mit roten Linsen und Basilikum",
      img: "https://www.gaumenfreundin.de/wp-content/uploads/2021/04/Rote-Linsenbolognese-einfach.jpg",
      price: "$8.00",
      kategorie: "Vegan",
      allergies: "[]",
    },
  ],
  [
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Pizza",
      description: "mit Mozzarella und Tomate",
      img: "https://st.depositphotos.com/1144352/3656/i/450/depositphotos_36567413-stock-photo-pizza.jpg",
      price: "$5.50",
      kategorie: "Vegetarian",
      allergies: "[Ei,ML,So,We]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Pommes",
      description: "wahlweise mit Mayo oder Ketchup",
      img: "https://media.istockphoto.com/id/966934632/de/foto/schmackhafte-pommes-frites-in-eine-sch%C3%BCssel-geben.jpg?s=612x612&w=0&k=20&c=7q1DvvLQuEQE7wZmGkiWPWsJzoYAPE0MwsNXWdkpnLQ=",
      price: "$3.00",
      kategorie: "Vegan",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Burger",
      description:
        "mit Salat, Käse, Tomate, Zwiebeln und Rinderhack, Beilage Pommes",
      img: "https://as1.ftcdn.net/v2/jpg/02/44/61/14/1000_F_244611436_4WKrV3YAOBo0LKe9S7hoXv55aDmgwvwr.jpg",
      price: "$10.00",
      kategorie: "Beef",
      allergies: "[Ei,We]",
    },
  ],
  [
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Griechische Reispfanne",
      shortName: "Reispfanne",
      description: "mit Sojastreifen, Gemüse und Kräuterdip",
      img: "https://www.edeka.de/media/01-rezeptbilder/rezeptbilder-e-h/rez-edeka-griechische-reispfanne-rezept-e-h-1-1.jpg",
      price: "$5.50",
      kategorie: "Vegetarian",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Pommes",
      description: "wahlweise mit Mayo oder Ketchup",
      img: "https://media.istockphoto.com/id/966934632/de/foto/schmackhafte-pommes-frites-in-eine-sch%C3%BCssel-geben.jpg?s=612x612&w=0&k=20&c=7q1DvvLQuEQE7wZmGkiWPWsJzoYAPE0MwsNXWdkpnLQ=",
      price: "$3.00",
      kategorie: "Vegan",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Paniertes Schweineschnitzel",
      shortName: "Schnitzel",
      description: "Beilage Soße",
      img: "https://media.istockphoto.com/id/603258520/photo/schnitzel-and-fried-potatoes.jpg?s=612x612&w=0&k=20&c=RXAndwtpKN2XUvV_TCkCQCfdlQ6sjJXTOiNpq7Kphs0=",
      price: "$10.00",
      kategorie: "Pork",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
  ],
  [
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Bunter Salat",
      description: "Feldsalat mit Obst und Käse",
      img: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=420&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXRodW1ibmFpbHx8OTI1MTcyM3x8ZW58MHx8fHx8",
      price: "$10.00",
      kategorie: "Vegetarian",
      allergies: "[G]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Spaghetti Bolognese",
      shortName: "Bolognese",
      description: "mit Rinderhack und Parmesan",
      img: "https://img.freepik.com/free-photo/healthy-lunch-vegetarian-pasta-with-fresh-tomato-generated-by-ai_24640-81714.jpg",
      price: "$10.00",
      kategorie: "Beef",
      allergies: "[Ei,ML]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Linsen Bolognese",
      shortName: "Bolognese",
      description: "mit roten Linsen und Basilikum",
      img: "https://www.gaumenfreundin.de/wp-content/uploads/2021/04/Rote-Linsenbolognese-einfach.jpg",
      price: "$8.00",
      kategorie: "Vegan",
      allergies: "[]",
    },
  ],
];

const nextWeek: Array<Meal[]> = [
  [
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Pommes",
      description: "wahlweise mit Mayo oder Ketchup",
      img: "https://media.istockphoto.com/id/966934632/de/foto/schmackhafte-pommes-frites-in-eine-sch%C3%BCssel-geben.jpg?s=612x612&w=0&k=20&c=7q1DvvLQuEQE7wZmGkiWPWsJzoYAPE0MwsNXWdkpnLQ=",
      price: "$3.00",
      kategorie: "Vegan",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Pommes",
      description: "wahlweise mit Mayo oder Ketchup",
      img: "https://media.istockphoto.com/id/966934632/de/foto/schmackhafte-pommes-frites-in-eine-sch%C3%BCssel-geben.jpg?s=612x612&w=0&k=20&c=7q1DvvLQuEQE7wZmGkiWPWsJzoYAPE0MwsNXWdkpnLQ=",
      price: "$3.00",
      kategorie: "Vegan",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Pommes",
      description: "wahlweise mit Mayo oder Ketchup",
      img: "https://media.istockphoto.com/id/966934632/de/foto/schmackhafte-pommes-frites-in-eine-sch%C3%BCssel-geben.jpg?s=612x612&w=0&k=20&c=7q1DvvLQuEQE7wZmGkiWPWsJzoYAPE0MwsNXWdkpnLQ=",
      price: "$3.00",
      kategorie: "Vegan",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
  ],
  [
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Pommes",
      description: "wahlweise mit Mayo oder Ketchup",
      img: "https://media.istockphoto.com/id/966934632/de/foto/schmackhafte-pommes-frites-in-eine-sch%C3%BCssel-geben.jpg?s=612x612&w=0&k=20&c=7q1DvvLQuEQE7wZmGkiWPWsJzoYAPE0MwsNXWdkpnLQ=",
      price: "$3.00",
      kategorie: "Vegan",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Pommes",
      description: "wahlweise mit Mayo oder Ketchup",
      img: "https://media.istockphoto.com/id/966934632/de/foto/schmackhafte-pommes-frites-in-eine-sch%C3%BCssel-geben.jpg?s=612x612&w=0&k=20&c=7q1DvvLQuEQE7wZmGkiWPWsJzoYAPE0MwsNXWdkpnLQ=",
      price: "$3.00",
      kategorie: "Vegan",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Pommes",
      description: "wahlweise mit Mayo oder Ketchup",
      img: "https://media.istockphoto.com/id/966934632/de/foto/schmackhafte-pommes-frites-in-eine-sch%C3%BCssel-geben.jpg?s=612x612&w=0&k=20&c=7q1DvvLQuEQE7wZmGkiWPWsJzoYAPE0MwsNXWdkpnLQ=",
      price: "$3.00",
      kategorie: "Vegan",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Pommes",
      description: "wahlweise mit Mayo oder Ketchup",
      img: "https://media.istockphoto.com/id/966934632/de/foto/schmackhafte-pommes-frites-in-eine-sch%C3%BCssel-geben.jpg?s=612x612&w=0&k=20&c=7q1DvvLQuEQE7wZmGkiWPWsJzoYAPE0MwsNXWdkpnLQ=",
      price: "$3.00",
      kategorie: "Vegan",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
  ],
  [
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Pommes",
      description: "wahlweise mit Mayo oder Ketchup",
      img: "https://media.istockphoto.com/id/966934632/de/foto/schmackhafte-pommes-frites-in-eine-sch%C3%BCssel-geben.jpg?s=612x612&w=0&k=20&c=7q1DvvLQuEQE7wZmGkiWPWsJzoYAPE0MwsNXWdkpnLQ=",
      price: "$3.00",
      kategorie: "Vegan",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Pommes",
      description: "wahlweise mit Mayo oder Ketchup",
      img: "https://media.istockphoto.com/id/966934632/de/foto/schmackhafte-pommes-frites-in-eine-sch%C3%BCssel-geben.jpg?s=612x612&w=0&k=20&c=7q1DvvLQuEQE7wZmGkiWPWsJzoYAPE0MwsNXWdkpnLQ=",
      price: "$3.00",
      kategorie: "Vegan",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
  ],
  [
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Pommes",
      description: "wahlweise mit Mayo oder Ketchup",
      img: "https://media.istockphoto.com/id/966934632/de/foto/schmackhafte-pommes-frites-in-eine-sch%C3%BCssel-geben.jpg?s=612x612&w=0&k=20&c=7q1DvvLQuEQE7wZmGkiWPWsJzoYAPE0MwsNXWdkpnLQ=",
      price: "$3.00",
      kategorie: "Vegan",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Pommes",
      description: "wahlweise mit Mayo oder Ketchup",
      img: "https://media.istockphoto.com/id/966934632/de/foto/schmackhafte-pommes-frites-in-eine-sch%C3%BCssel-geben.jpg?s=612x612&w=0&k=20&c=7q1DvvLQuEQE7wZmGkiWPWsJzoYAPE0MwsNXWdkpnLQ=",
      price: "$3.00",
      kategorie: "Vegan",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Pommes",
      description: "wahlweise mit Mayo oder Ketchup",
      img: "https://media.istockphoto.com/id/966934632/de/foto/schmackhafte-pommes-frites-in-eine-sch%C3%BCssel-geben.jpg?s=612x612&w=0&k=20&c=7q1DvvLQuEQE7wZmGkiWPWsJzoYAPE0MwsNXWdkpnLQ=",
      price: "$3.00",
      kategorie: "Vegan",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
  ],
  [
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Pommes",
      description: "wahlweise mit Mayo oder Ketchup",
      img: "https://media.istockphoto.com/id/966934632/de/foto/schmackhafte-pommes-frites-in-eine-sch%C3%BCssel-geben.jpg?s=612x612&w=0&k=20&c=7q1DvvLQuEQE7wZmGkiWPWsJzoYAPE0MwsNXWdkpnLQ=",
      price: "$3.00",
      kategorie: "Vegan",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Pommes",
      description: "wahlweise mit Mayo oder Ketchup",
      img: "https://media.istockphoto.com/id/966934632/de/foto/schmackhafte-pommes-frites-in-eine-sch%C3%BCssel-geben.jpg?s=612x612&w=0&k=20&c=7q1DvvLQuEQE7wZmGkiWPWsJzoYAPE0MwsNXWdkpnLQ=",
      price: "$3.00",
      kategorie: "Vegan",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
    {
      foodID: 1,
      foodWeekFoodWeekID: 1,
      name: "Pommes",
      description: "wahlweise mit Mayo oder Ketchup",
      img: "https://media.istockphoto.com/id/966934632/de/foto/schmackhafte-pommes-frites-in-eine-sch%C3%BCssel-geben.jpg?s=612x612&w=0&k=20&c=7q1DvvLQuEQE7wZmGkiWPWsJzoYAPE0MwsNXWdkpnLQ=",
      price: "$3.00",
      kategorie: "Vegan",
      allergies: "[Ei,ML,Se,Sn,So,We]",
    },
  ],
];

export default function Canteen() {
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const [meals, setMeals] = useState<Array<Meal[]>>([]);
  const [statusMessage, setStatusMessage] = useState("Loading...");
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
    fetch(`api/meal/canteenplan/${week}`)
      .then((res: Response) => res.json())
      .then((data: Meal[][] | { statusCode?: number; message?: string }) => {
        if (Array.isArray(data)) {
          setMeals(data);
        } else {
          setStatusMessage("No data found");
        }
      });
  };

  const handlePress = (foodWeek: number) => {
    // getMeals(foodWeek);
    setActiveWeek(foodWeek);
    setResetKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    // getMeals(1);
    setMeals(thisWeek);
  }, []);

  if (meals.length === 0) {
    return <div>{statusMessage}</div>;
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
          {Array.from({ length: maxRows }, (_, rowIndex) => (
            <TableRow key={rowIndex}>
              {weekdays.map((_, colIndex) => (
                <TableCell
                  key={colIndex}
                  className={
                    colIndex === 4
                      ? ""
                      : "border-r-solid border-r-2 border-r-black"
                  }
                >
                  {meals[colIndex] && meals[colIndex][rowIndex] ? (
                    <MealCard
                      meal={meals[colIndex][rowIndex]}
                      key={`${colIndex}_${rowIndex}_${resetKey}`}
                    />
                  ) : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
