module.exports = (timestamp) => {
  const date = new Date(timestamp);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = date.toLocaleString("en-US", options);

  // Extract the date and time parts
  const [datePart, timePart] = formattedDate.split(", ");
  const [month, day, year] = datePart.split("/");

  return `${month}.${day}.${year} ${timePart}`;
};
