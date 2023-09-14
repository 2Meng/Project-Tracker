const dateTime = document.querySelector(".date-time");

function updateDateTime() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();
  dateTime.textContent = `${formattedDate} ${formattedTime}`;
}

// Update the date-time initially
updateDateTime();

const intervalId = setInterval(updateDateTime, 1000);

document.addEventListener("beforeunload", function () {
  clearInterval(intervalId); // Clear the interval when the page is unloaded
});
