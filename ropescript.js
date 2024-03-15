document.addEventListener("DOMContentLoaded", function () {
  paper.setup(document.getElementById("canvas"));
  const canvas = document.getElementById("canvas");
  const canvasOffset = canvas.getBoundingClientRect();
  const connectables = document.querySelectorAll(".connectable");

  let globalWobbleStrength = 1.6; // Initialize wobble strength
  const decay = 0.99; // Decay factor for the wobble strength

  function getAttachmentPoint(element, attachment) {
    const rect = element.getBoundingClientRect();
    switch (attachment) {
      case "top-left":
        return new paper.Point(
          rect.left - canvasOffset.left,
          rect.top - canvasOffset.top
        );
      case "top-right":
        return new paper.Point(
          rect.right - canvasOffset.left,
          rect.top - canvasOffset.top
        );
      case "bottom-left":
        return new paper.Point(
          rect.left - canvasOffset.left,
          rect.bottom - canvasOffset.top
        );
      case "bottom-right":
        return new paper.Point(
          rect.right - canvasOffset.left,
          rect.bottom - canvasOffset.top
        );
      case "center":
      default:
        return new paper.Point(
          rect.left - canvasOffset.left + rect.width / 2,
          rect.top - canvasOffset.top + rect.height / 2
        );
    }
  }

  let lastUpdateTime = Date.now();

  function drawRope(from, to, segments = 12, sag = 40) {
    let path = new paper.Path();
    path.strokeColor = "darkred";
    path.strokeWidth = 5;
    path.strokeCap = "round";

    const deltaTime = (Date.now() - lastUpdateTime) / 1000;
    lastUpdateTime = Date.now();

    globalWobbleStrength *= Math.pow(decay, (deltaTime * 1000) / 16); // Adjust decay based on actual frame rate

    for (let i = 0; i <= segments; i++) {
      let t = i / segments;
      let x = from.x * (1 - t) + to.x * t;
      let sagAmount =
        i === 0 || i === segments
          ? 0
          : Math.sin(t * Math.PI) *
            sag *
            (1 + Math.sin(Date.now() * 0.015) * globalWobbleStrength);
      let y = from.y * (1 - t) + to.y * t + sagAmount;
      path.add(new paper.Point(x, y));
    }
    path.smooth({ type: "continuous" });
  }

  function updateConnections() {
    paper.project.clear();
    connectables.forEach((element) => {
      const connections = element.getAttribute("data-connections").split(",");
      connections.forEach((connection) => {
        const [connectionId, attachment] = connection.split(":");
        const toElement = document.getElementById(connectionId.trim());
        if (toElement) {
          const from = getAttachmentPoint(
            element,
            element.getAttribute("data-attachment") || "center"
          );
          const to = getAttachmentPoint(toElement, attachment || "center");
          drawRope(from, to);
        }
      });
    });
  }

  function animate() {
    updateConnections();
    requestAnimationFrame(animate);
  }

  animate(); // Start the animation loop
});
// Continuous update loop
function animate() {
  requestAnimationFrame(animate);
}

animate(); // Start the animation loop

document.addEventListener("DOMContentLoaded", function () {
  const button5 = document.getElementById("button5");

  // Set the image URLs
  const staticImage = "Stuff to host/0 (2).png";
  const animatedGif = "Stuff to host/Test4.gif";

  // Change to GIF on hover
  button5.addEventListener("mouseenter", function () {
    button5.src = animatedGif;
  });

  // Change back to static image on mouse leave
  button5.addEventListener("mouseleave", function () {
    button5.src = staticImage;
  });
});

// Pop-Up Configurator

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("commandPopup");
  document.getElementById("commandButton").onclick = () =>
    (popup.style.display = "block");
  document.querySelector(".close").onclick = () =>
    (popup.style.display = "none");

  window.onclick = (event) => {
    if (event.target == popup) {
      popup.style.display = "none";
    }
  };

  document.getElementById("mainCommandSelect").onchange = function () {
    updateSubCommandSection(this.value);
    document.getElementById("sendCommand").style.display = "block";
  };
});

function updateSubCommandSection(mainCommand) {
  const section = document.getElementById("subCommandSection");
  section.innerHTML = ""; // Clear previous content

  switch (mainCommand) {
    case "add":
      createTextInput(section, "name", "Name (lowercase)");
      createTextInput(section, "link", "YouTube Link (optional)", true);
      createTextInput(section, "start", "Start Time (00:00)");
      createTextInput(section, "end", "End Time (00:00, optional)", true);
      createFileInput(section, "soundFile", "Upload MP3 File");
      break;
    case "misc":
      createSubCommandSelect(section, "Misc Command", ["combo", "repeat"]);
      section
        .appendChild(document.createElement("div"))
        .setAttribute("id", "miscOptions");
      document.getElementById("subCommandSelect").onchange = function () {
        updateMiscOptions(this.value);
      };
      break;
    case "modify":
      createSelectInput(section, "sound", "Select Sound", entries);
      createSubCommandSelect(section, "Modify Command", [
        "rename",
        "remove",
        "download",
        "modify volume",
        "modify clip",
      ]);
      section
        .appendChild(document.createElement("div"))
        .setAttribute("id", "modifyOptions");
      document.getElementById("subCommandSelect").onchange = function () {
        updateModifyOptions(this.value);
      };
      break;
  }
}

function createTextInput(container, name, placeholder, optional = false) {
  const input = document.createElement("input");
  input.type = "text";
  input.name = name;
  input.placeholder = placeholder;
  if (!optional) input.required = true;
  container.appendChild(input);
}

function createSubCommandSelect(container, placeholder, options) {
  const select = document.createElement("select");
  select.setAttribute("id", "subCommandSelect");
  const placeholderOption = document.createElement("option");
  placeholderOption.textContent = placeholder;
  placeholderOption.disabled = true;
  placeholderOption.selected = true;
  select.appendChild(placeholderOption);

  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });
  container.appendChild(select);
}

function updateMiscOptions(subCommand) {
  const optionsContainer = document.getElementById("miscOptions");
  optionsContainer.innerHTML = ""; // Clear previous options

  // Assuming 'entries' is accessible
  switch (subCommand) {
    case "combo":
      // For "combo", you might allow selection of multiple sounds
      createSelectInput(
        optionsContainer,
        "sound1",
        "Select First Sound",
        entries
      );
      createSelectInput(
        optionsContainer,
        "sound2",
        "Select Second Sound",
        entries
      );
      // Add more sounds as needed
      break;
    case "repeat":
      createSelectInput(optionsContainer, "sound", "Select Sound", entries);
      createTextInput(optionsContainer, "count", "Count (optional)", true);
      break;
  }
}

function updateModifyOptions(subCommand) {
  const optionsContainer = document.getElementById("modifyOptions");
  optionsContainer.innerHTML = ""; // Clear previous options

  switch (subCommand) {
    case "rename":
      createTextInput(optionsContainer, "newName", "New Name");
      break;
    case "modify volume":
      createTextInput(
        optionsContainer,
        "volume",
        "Volume (1 is Original Volume, 0 is Off)"
      );
      break;
    case "modify clip":
      createTextInput(optionsContainer, "clipStart", "Clip Start (00:00)");
      createTextInput(
        optionsContainer,
        "clipEnd",
        "Clip End (00:00, optional)",
        true
      );
      break;
    // Implement other modify sub-commands as needed
  }
}

function createSelectInput(container, name, placeholder, options) {
  const label = document.createElement("label");
  label.textContent = placeholder;
  const select = document.createElement("select");
  select.name = name;
  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });
  container.appendChild(label);
  container.appendChild(select);
}

function createFileInput(container, name, placeholder) {
  const label = document.createElement("label");
  label.textContent = placeholder;
  const input = document.createElement("input");
  input.type = "file";
  input.name = name;
  input.accept = ".mp3"; // Restrict files to .mp3
  container.appendChild(label);
  container.appendChild(input);
}

function clearFormData() {
  document.querySelector("#commandForm").reset();
  // Additional logic to reset any dynamic UI elements or selections
}

document.getElementById("sendCommand").onclick = function () {
  sendCommandData();
};

function sendCommandData() {
  const formData = new FormData();
  const mainCommand = document.getElementById("mainCommandSelect").value;
  let commandString = "";

  // Logic to construct the command string
  switch (mainCommand) {
    case "add":
      const name = document.getElementsByName("name")[0].value;
      const link = document.getElementsByName("link")[0].value || "";
      const start = document.getElementsByName("start")[0].value || "";
      const end = document.getElementsByName("end")[0].value || "";
      commandString = `!add ${name}`;
      if (link) commandString += ` ${link}`;
      if (start) commandString += ` ${start}`;
      if (end) commandString += ` ${end}`;
      break;
    case "misc":
      const subCommandMisc = document.getElementById("subCommandSelect").value;
      const sounds = document.querySelectorAll("#miscOptions select");
      const soundValues = Array.from(sounds)
        .map((s) => s.value)
        .join(" ");
      commandString = `!${subCommandMisc} ${soundValues}`;
      const count = document.getElementsByName("count")[0]?.value || "";
      if (count) commandString += ` ${count}`;
      break;
    case "modify":
      const subCommandModify =
        document.getElementById("subCommandSelect").value;
      const soundModify = document.getElementsByName("sound")[0].value;
      const newValue =
        document.querySelectorAll("#modifyOptions input")[0]?.value || "";
      commandString = `!${subCommandModify} ${soundModify} ${newValue}`;
      break;
  }

  // Log the constructed command for verification
  console.log("Constructed Command:", commandString);

  // Appending command and file (if exists) to FormData
  formData.append("command", commandString);
  const fileInput = document.querySelector(
    '#subCommandSection > input[type="file"]'
  );
  if (fileInput && fileInput.files.length > 0) {
    formData.append("soundFile", fileInput.files[0]);
  }

  // Assuming webhookURL is defined in your HTML or JavaScript
  const webhookURL = "YOUR_WEBHOOK_URL_HERE";
  fetch(webhookURL, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      clearFormData();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function clearFormData() {
  document.querySelector("#commandForm").reset();
  // Additional logic to reset any dynamic UI elements or selections
}
