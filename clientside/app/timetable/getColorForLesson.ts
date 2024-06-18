
export default function getColorForLesson(label: string): string {
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
  if (label === "Software Engineering") {
    color = "#896022"; // braun
}
  return color;
}