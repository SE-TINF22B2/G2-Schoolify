"use client";

import { Button } from "@nextui-org/react";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import React from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
} from "@nextui-org/react";

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
const columns = [
    "Stunde",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
];

const timeslots = [1, 2, 3, 4, 5, 6];

function getColorForLesson(label: string): string {
    let color = "black";
    if (label === "Deutsch") {
        color = "#800000"; // dunkelrot
    }
    if (label === "Mathe") {
        color = "#000080"; // dunkelblau
    }
    if (label === "Physik") {
        color = "#808000"; // dunkelgelb
    }
    if (label === "Chemie") {
        color = "#800080"; // dunkellila
    }
    if (label === "Biologie") {
        color = "#FF4500"; // dunkelorange
    }
    if (label === "Geschichte") {
        color = "#FF1493"; // dunkelpink
    }
    if (label === "Geografie") {
        color = "#8B4513"; // dunkelbraun
    }
    if (label === "Englisch") {
        color = "#008080"; // dunkeltürkis
    }
    if (label === "Kunst") {
        color = "#808080"; // dunkelgrau
    }
    if (label === "Musik") {
        color = "#00CED1"; // dunkelblaugrün
    }
    return color;
}
const lessons = [
    { timeslot: 1, day: 1, label: "Deutsch" },
    { timeslot: 1, day: 2, label: "Mathe" },
    { timeslot: 1, day: 3, label: "Physik" },
    { timeslot: 1, day: 4, label: "Chemie" },
    { timeslot: 1, day: 5, label: "Biologie" },
    { timeslot: 2, day: 1, label: "Geschichte" },
    { timeslot: 2, day: 2, label: "Geografie" },
    { timeslot: 2, day: 3, label: "Englisch" },
    { timeslot: 2, day: 4, label: "Kunst" },
    { timeslot: 2, day: 5, label: "Musik" },
];

function getLesson(
    timeslot: number,
    day: number
): { timeslot: number; day: number; label: string } | undefined {
    return lessons.find(
        (lesson) => lesson.timeslot === timeslot && lesson.day === day
    );
}

//@ts-nocheck
export default function Timetable() {
    let week = "Diese Woche";
    return (
        <div>
            <div className="flex py-6 justify-center">
                <div
                    id="center"
                    className="flex justify-center items-center text-black">
                    <button>
                        <ArrowBackIosNewOutlinedIcon />
                    </button>
                    <div className="px-5">{week}</div>
                    <button>
                        <ArrowForwardIosOutlinedIcon />
                    </button>
                </div>
            </div>
            <div>
                <Table
                    removeWrapper
                    aria-label="Example table with dynamic content">
                    <TableHeader>
                        {columns.map((column) => (
                            <TableColumn
                                align="center"
                                className="bg-transparent">
                                <div className="flex flex-col justify-center items-center text-sm font-normal leading-5 text-black">
                                    {column}
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
                                            colIndex
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
                                                            fullWidth
                                                            style={{
                                                                backgroundColor:
                                                                    getColorForLesson(
                                                                        lesson?.label ??
                                                                            ""
                                                                    ),
                                                            }}>
                                                            <CardHeader className="flex gap-3">
                                                                <div className="flex flex-col">
                                                                    <p className="text-default-500 text-xl text-white">
                                                                        {lesson?.label ??
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
