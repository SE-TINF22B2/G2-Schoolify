"use client";

import { Button } from "@nextui-org/react";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import mockdata from "./lessons.json";
import  moment from "moment";

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
import { Hidden } from "@mui/material";
const columns = [
    "Stunde",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
];
const timeslots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const lessons = mockdata.lessons;

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

function getLesson(
    timeslot: number,
    day: number
): { timeslot: number; day: number; label: string } | undefined {
    return lessons.find(
        (lesson) => lesson.timeslot === timeslot && lesson.day === day
    );
}
function convertToWeekFormat(m: moment.Moment){
    const weekend = moment(m);
    weekend.add(4, "days")
    return m.format("D[.] M[.]") + " - " + weekend.format("D[.] M[.]");
}

//@ts-nocheck
export default function Timetable() {
    const [weekstart] = useState(moment().startOf("isoWeek"));
    const [week, setWeek] = useState(convertToWeekFormat(weekstart));
    useEffect(() => {});

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
                        }}>
                        <ArrowBackIosNewOutlinedIcon />
                    </button>
                    <div className="px-5">{week}</div>
                    <button
                        onClick={() => {
                            weekstart.add(7, "days");
                            setWeek(convertToWeekFormat(weekstart));
                        }}>
                        <ArrowForwardIosOutlinedIcon />
                    </button>
                </div>
            </div>
            <p>{weekstart.toISOString()}</p>
            <div>
                <Table removeWrapper aria-label="Stundenplan">
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
                                                            className={
                                                                lesson == null
                                                                    ? "invisible"
                                                                    : ""
                                                            }
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
