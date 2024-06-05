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

import { Lesson } from "./LessonType";
import { fetchLessons, getLesson } from "./LessonHandler";
import LessonCard from "./LessonCard";
const columns = [
    "Stunde",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
];
const timeslots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


function convertToWeekFormat(m: moment.Moment) {
    const weekend = moment(m);
    weekend.add(4, "days");
    return m.format("D[.] M[.]") + " - " + weekend.format("D[.] M[.]");
}

export default function Timetable() {
    const [weekstart] = useState(moment().startOf("isoWeek"));
    const [week, setWeek] = useState(convertToWeekFormat(weekstart));
    const [lessons, setLessons] = useState({} as Lesson[][]);

    useEffect(() => {
        columns.forEach((column, index) => {
            if (column !== "Stunde") {
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
    },[week]);

    useEffect(() => {
        fetchLessons(1, weekstart.toISOString(), setLessons);
        console.log("test")
    },[]);

    return (
        <div>
            <div className="flex py-6 justify-center">
                <div
                    id="center"
                    className="flex justify-center items-center text-black">
                    <button
                        onClick={() => {
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
                                                        <LessonCard
                                                            lesson={lesson}
                                                        />
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
