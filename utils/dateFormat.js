module.exports = (timestamp) => {
  const date = new Date(timestamp);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  // Extract the date and time parts using toLocaleString with options
  const formattedDate = date.toLocaleString("en-US", options);

  return formattedDate;
};
