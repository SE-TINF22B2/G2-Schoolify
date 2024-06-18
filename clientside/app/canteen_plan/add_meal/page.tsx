"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Input,
  RadioGroup,
  Radio,
  DatePicker,
  Image,
} from "@nextui-org/react";
import { getLocalTimeZone, isWeekend, today } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const calculateDaysToBoundaries = () => {
  const now = new Date();
  let dayOfWeek = now.getDay();

  // JS Date getDay() method return 0 for Sunday, so need to convert Sunday to 7
  dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

  // Subtract current day number with the day number for Monday(1) and add 7 if it is a week before
  let daysToLastMonday = dayOfWeek - 1;
  daysToLastMonday =
    daysToLastMonday < 0 ? daysToLastMonday + 7 : daysToLastMonday;

  // Subtract Friday's day number(5) with current day number and add 7 if it is a week later
  let daysToNextFriday = 5 - dayOfWeek + 7;

  return { daysToLastMonday, daysToNextFriday };
};

export default function CanteenEditor() {
  let { locale } = useLocale();
  const { daysToLastMonday, daysToNextFriday } = calculateDaysToBoundaries();

  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [description, setDescription] = useState("");
  const [allergies, setAllergies] = useState("");
  const [kategorie, setKategorie] = useState<string>("");
  const [day, setDay] = useState(
    today(getLocalTimeZone())
      .add({ days: 1 })
      .toDate(getLocalTimeZone())
      .toISOString()
  );
  const [price, setPrice] = useState("");
  const [url, setUrl] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKategorie(event.target.value);
  };

  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const isPriceInvalid = () => {
    return isButtonPressed && (parseFloat(price) <= 0 || price === "");
  };

  const isNameInvalid = () => {
    return isButtonPressed && name.trim() === "";
  };

  const isDescInvalid = () => {
    return isButtonPressed && description.trim() === "";
  };

  const isCategoryInvalid = () => {
    return isButtonPressed && kategorie.trim() === "";
  };

  const showToastMessage = (postStatus: String) => {
    if (postStatus === "successful") {
      toast.success("Gericht erfolgreich gespeichert!", {
        position: "top-right",
      });
    } else if (postStatus === "error") {
      toast.error("Gericht konnte nicht gespeichert werden!", {
        position: "top-right",
      });
    } else {
      toast.error("Ein Fehler ist aufgetreten.", {
        position: "top-right",
      });
    }
  };

  const post = () => {
    setIsButtonPressed(true);

    if (
      !isPriceInvalid() &&
      !isNameInvalid() &&
      !isDescInvalid() &&
      !isCategoryInvalid()
    ) {
      fetch("api/meal/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          role: "Admin",
        },
        body: JSON.stringify({
          name: name,
          shortName: shortName,
          description: description,
          allergies: allergies || "Keine",
          kategorie: kategorie,
          day: day,
          price: parseFloat(price),
          url: url,
        }),
      })
        .then((response) => {
          if (response.ok) {
            showToastMessage("successful");
            setIsButtonPressed(false);
          } else {
            showToastMessage("error");
          }
        })
        .catch((error) => {
          showToastMessage(error);
        });
    }
  };

  const resetForm = () => {
    setName("");
    setShortName("");
    setDescription("");
    setAllergies("");
    setKategorie("");

    setPrice("");
    setUrl("");
    setIsButtonPressed(false);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <ToastContainer />
      <Card className="h-fit w-2/3">
        <CardHeader className="flex justify-between items-center text-2xl font-semibold">
          <div className="flex items-center flex-grow">
            <span className="mx-auto">Hinzufügen eines Gerichts</span>
          </div>
          <Button
            isIconOnly
            radius="full"
            size="sm"
            className="text-white"
            onClick={resetForm}
          >
            <Image
              radius="md"
              height="100%"
              width="100%"
              alt="Eingaben löschen"
              src="https://openclipart.org/image/800px/218663"
            />
          </Button>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-col gap-8">
            <div className="flex flex-row gap-4">
              <Input
                size="lg"
                type="text"
                label="Name"
                labelPlacement="outside"
                placeholder="Name des Gerichts"
                isRequired
                isInvalid={isNameInvalid()}
                errorMessage="Name muss angegeben werden."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                size="lg"
                type="text"
                labelPlacement="outside"
                label="Kurzname"
                placeholder="Kurzversion des Namens"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-8">
              <Input
                type="number"
                size="lg"
                label="Preis"
                labelPlacement="outside"
                placeholder="0"
                isInvalid={isPriceInvalid()}
                errorMessage="Preis muss größer als 0€ sein."
                isRequired
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-medium">€</span>
                  </div>
                }
              />
              <Input
                size="lg"
                type="text"
                labelPlacement="outside"
                label="Allergene"
                placeholder="z.B. Erdnüsse, Gluten"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
              />
              <Input
                size="lg"
                type="text"
                labelPlacement="outside"
                label="Bild"
                placeholder="Linkadresse"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-4 text-black">
              <Input
                size="lg"
                type="text"
                labelPlacement="outside"
                label="Beschreibung"
                placeholder="Kurze Beschreibung von Gericht und Beilagen"
                isRequired
                isInvalid={isDescInvalid()}
                errorMessage="Beschreibung muss angegeben werden."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <DatePicker
                size="lg"
                labelPlacement="outside"
                label={<span className="text-base">Tag</span>}
                minValue={today(getLocalTimeZone()).subtract({
                  days: daysToLastMonday,
                })}
                maxValue={today(getLocalTimeZone()).add({
                  days: daysToNextFriday,
                })}
                defaultValue={today(getLocalTimeZone()).add({ days: 1 })}
                className="max-w-[284px]"
                isRequired
                isDateUnavailable={(date) => isWeekend(date, locale)}
                errorMessage="Datum muss diese oder nächste Woche sein."
                description="Datum muss diese oder nächste Woche sein."
                onChange={(e) =>
                  setDay(e.toDate(getLocalTimeZone()).toISOString())
                }
              />
            </div>

            <RadioGroup
              label={<span className="text-foreground">Kategorie</span>}
              orientation="horizontal"
              isRequired
              isInvalid={isCategoryInvalid()}
              errorMessage="Kategorie muss ausgewählt werden."
              color="secondary"
              value={kategorie}
              onChange={handleChange}
              className="-mt-6 text-black"
            >
              <Radio value="Rindfleisch">Rind</Radio>
              <Radio value="Schweinefleisch">Schwein</Radio>
              <Radio value="Fisch">Fisch</Radio>
              <Radio value="Vegetarisch">Vegetarisch</Radio>
              <Radio value="Vegan">Vegan</Radio>
            </RadioGroup>
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-center">
          <Button
            size="lg"
            color="secondary"
            className="text-white"
            onClick={post}
          >
            Gericht speichern
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
