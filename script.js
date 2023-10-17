const dateTime = document.querySelector(".date-time");
const addProject = document.querySelector(".add-project");
const closeModal = document.querySelector(".close-modal");
const submitProject = document.querySelector(".submit-project");
const modal = document.querySelector("[data-modal]");

const projectsArrayInStorage = [];

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

addProject.addEventListener("click", () => {
  modal.showModal();
});

closeModal.addEventListener("click", () => {
  modal.close();
});

modal.addEventListener("click", (e) => {
  const dialogDimensions = modal.getBoundingClientRect();
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    modal.close();
  }
});

function addProjectToTable(name, type, dueDate) {
  const projectList = document.getElementById("project-list");

  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${name}</td>
    <td>${type}</td>
    <td>${dueDate}</td>
    <td><button class="remove-project">Remove</button></td>
  `;

  projectsArrayInStorage.push({
    name,
    type,
    dueDate,
  });

  localStorage.setItem("projects", JSON.stringify(projectsArrayInStorage));

  // Add an event listener to the remove button
  const removeButton = newRow.querySelector(".remove-project");
  removeButton.addEventListener("click", () => {
    const index = projectsArrayInStorage.findIndex(
      (project) =>
        project.name === newRow.children[0].textContent &&
        project.type === newRow.children[1].textContent &&
        project.dueDate === newRow.children[2].textContent
    );

    if (index > -1) {
      projectsArrayInStorage.splice(index, 1);
      localStorage.setItem("projects", JSON.stringify(projectsArrayInStorage));
    }

    newRow.remove();
  });

  projectList.appendChild(newRow);
}

submitProject.addEventListener("click", () => {
  const projectName = document.getElementById("project-name").value;
  const projectType = document.getElementById("project-type").value;
  const dueDate = document.querySelector("input[name='dueDate']").value;

  // Check if any of the fields are empty before adding the project
  if (projectName && projectType && dueDate) {
    addProjectToTable(projectName, projectType, dueDate);
    modal.close();

    // Clear the input fields
    document.getElementById("project-name").value = "";
    document.getElementById("project-type").value = "";
    document.querySelector("input[name='dueDate']").value = "";
  } else {
    alert("Please fill in all fields.");
  }
});

function populateTableFromLocalStorage() {
  const projectList = document.getElementById("project-list");

  // Clear any existing rows in the table
  projectList.innerHTML = "";

  // Clear the projects array before adding stored projects
  projectsArrayInStorage.length = 0;

  // Retrieve the array of projects from localStorage
  const storedProjects = JSON.parse(localStorage.getItem("projects"));

  if (storedProjects) {
    // Iterate through the array and add each project to the table
    storedProjects.forEach((projectData) => {
      addProjectToTable(
        projectData.name,
        projectData.type,
        projectData.dueDate
      );
    });
  }
}

// Call the function to populate table data from localStorage when the page loads
window.addEventListener("load", populateTableFromLocalStorage);
