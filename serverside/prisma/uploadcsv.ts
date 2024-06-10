/* eslint-disable @typescript-eslint/no-var-requires */
// CSV-Datei lesen und Daten hochladen
require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

function getStartOfWeek(date) {
  const day = date.getUTCDay();
  const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const startOfWeek = new Date(date.setUTCDate(diff));
  startOfWeek.setUTCHours(2, 0, 0, 0); // Set time to 00:00:00 UTC
  return startOfWeek;
}

// Pfad zur CSV-Datei (ersetze durch deinen eigenen Pfad)
const csvFilePath = 'csv/food.csv';

const updatedCsvFilePath = 'csv/food.csv';

// Funktion, um das Datum um eine bestimmte Anzahl von Tagen zu erhöhen
function addDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

// CSV-Datei lesen, Datum ändern und erneut speichern
function readAndModifyCsv(filePath, outputFilePath) {
  const data = [];
  const headers = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('headers', (headerList) => {
      headerList.forEach((header) => headers.push(header));
    })
    .on('data', (row) => {
      data.push(row);
    })
    .on('end', () => {
      console.log('CSV-Datei erfolgreich gelesen:', data);

      const modifiedData = [];
      let currentDate = getStartOfWeek(new Date());

      // Für zwei Wochen von Montag bis Freitag verteilen
      for (let week = 0; week < 2; week++) {
        for (let day = 0; day < 5; day++) {
          const mealIndex = day % data.length;
          const newRow = { ...data[mealIndex] };
          newRow.day = addDays(currentDate, day).toISOString();
          modifiedData.push(newRow);
        }
        currentDate = addDays(currentDate, 7); // Springe zu Montag der nächsten Woche
      }

      console.log('Geänderte Daten:', modifiedData);
      writeCsv(outputFilePath, headers, modifiedData);
    });
}

// Geänderte Daten in eine neue CSV-Datei schreiben
function writeCsv(filePath, headers, data) {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: headers.map((header) => ({ id: header, title: header })),
  });

  csvWriter
    .writeRecords(data)
    .then(() =>
      console.log(
        'Geänderte Daten erfolgreich in die neue CSV-Datei geschrieben:',
        filePath,
      ),
    )
    .catch((err) => console.error('Fehler beim Schreiben der CSV-Datei:', err));
}

// CSV-Datei lesen, ändern und erneut speichern
readAndModifyCsv(csvFilePath, updatedCsvFilePath);
