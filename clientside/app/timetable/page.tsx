"use client";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import mockdata from "./lessons.json";
import moment from "moment";

import React, { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
} from "@nextui-org/react";

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Lesson } from "./LessonType";
import { fetchLessons } from "./fetchLessons";
import getColorForLesson from "./getColorForLesson";
const columns = [
    "Stunde",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
];
const timeslots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


function getLesson(
    timeslot: number,
    dayIndex: number,
    lessons: Lesson[][]
): Lesson | undefined {
    const dayLessons = lessons[dayIndex];
    
    // Find the lesson for the specific timeslot (row index)
    if(dayLessons === undefined) return undefined;
    return dayLessons.find(lesson => lesson.timeslot === timeslot);
    // return lessons.find(
    //     (lesson) => lesson.timeslot === timeslot && lesson.day === day
    // );
}

function convertToWeekFormat(m: moment.Moment) {
    const weekend = moment(m);
    weekend.add(4, "days");
    return m.format("D[.] M[.]") + " - " + weekend.format("D[.] M[.]");
}


//@ts-nocheck
export default function Timetable() {
    const [weekstart] = useState(moment().startOf("isoWeek"));
    const [week, setWeek] = useState(convertToWeekFormat(weekstart));
    const [lessons, setLessons] = useState({} as Lesson[][]);

    useEffect(() => {
        columns.forEach((column, index) => {
            if(column !== "Stunde"){
                const dayOffset = index - 1; // Offset because first column is for timeslots
                const columnDate = moment(weekstart)
                    .add(dayOffset, "days")
                    .format("D[.] M[.]");
                const element = document.getElementById("date" + column);
                if (element) {
                    element.innerText = columnDate;
                }
            }

        });
    }),[week];

    useEffect(() => {
        fetch(`api/lesson/getLessonsForWeek?classId=1`)
      .then((response:Response) => response.json()).then((data: Lesson[][]) => {setLessons(data); console.log(data)})
    }),[weekstart];



    return (
        <div>
            <div className="flex py-6 justify-center">
                <div
                    id="center"
                    className="flex justify-center items-center text-black">
                    <button
                        onClick={async () => {
                            weekstart.subtract(7, "days");
                            setWeek(convertToWeekFormat(weekstart));
                            // setLessons(fetchLessons(1));
                        }}>
                        <ArrowBackIosNewOutlinedIcon />
                    </button>
                    <div className="px-5">{week}</div>
                    <button
                        onClick={() => {
                            weekstart.add(7, "days");
                            setWeek(convertToWeekFormat(weekstart));
                            // setLessons(fetchLessons(1));
                        }}>
                        <ArrowForwardIosOutlinedIcon />
                    </button>
                </div>
            </div>
            <div>
                <Table removeWrapper aria-label="Stundenplan">
                    <TableHeader>
                        {columns.map((column) => (
                            <TableColumn
                                align="center"
                                className="bg-transparent"
                                key={column}>
                                <div className="flex flex-col justify-center items-center text-sm font-normal leading-5 text-black">
                                    <p id={"date" + column}></p>
                                    <p>{column}</p>
                                </div>
                            </TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {timeslots.map((_, rowIndex) => {
                            return (
                                <TableRow key={rowIndex}>
                                    {columns.map((_, colIndex) => {
                                        const lesson = getLesson(
                                            rowIndex + 1,
                                            colIndex,
                                            lessons
                                        );
                                        return (
                                            <TableCell
                                                key={colIndex}
                                                className={
                                                    (colIndex === 5
                                                        ? ""
                                                        : "border-r-solid border-r-2 border-r-black") +
                                                    (colIndex === 0
                                                        ? " w-1/10"
                                                        : " w-1/5")
                                                }>
                                                <div className="flex flex-col justify-center items-center width ">
                                                    {colIndex === 0 ? (
                                                        <div className="text-black">
                                                            {rowIndex + 1}
                                                        </div>
                                                    ) : (
                                                        <Card
                                                            className={
                                                                lesson == null
                                                                    ? "invisible"
                                                                    : ""
                                                            }
                                                            fullWidth
                                                            style={{
                                                                backgroundColor:
                                                                    getColorForLesson(
                                                                        lesson?.Subject.name ??
                                                                            ""
                                                                    ),
                                                            }}>
                                                            <CardHeader className="flex gap-3">
                                                                <div className="flex flex-col">
                                                                    <p className="text-default-500 text-xl text-white">
                                                                        {lesson?.Subject.name ??
                                                                            ""}
                                                                    </p>
                                                                </div>
                                                            </CardHeader>

                                                            <CardBody>
                                                                <p className="text-small text-default-500 text-xs text-white">
                                                                    Frau Meier
                                                                </p>
                                                                <p className="text-small text-default-500 text-xs text-white">
                                                                    A263
                                                                </p>
                                                            </CardBody>
                                                        </Card>
                                                    )}
                                                </div>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
