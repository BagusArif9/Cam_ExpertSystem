let cameraData = [];
let rules = [];

document.addEventListener("DOMContentLoaded", (event) => {
  fetch("camera_data.json")
    .then((response) => response.json())
    .then((data) => {
      cameraData = data;
      console.log("Camera data loaded:", cameraData); // Debug statement
    })
    .catch((error) => console.error("Error fetching the camera data:", error));

  fetch("rules.json")
    .then((response) => response.json())
    .then((data) => {
      rules = data.rules;
      console.log("Rules data loaded:", rules); // Debug statement
    })
    .catch((error) => console.error("Error fetching the rules data:", error));
});

function filterCameras() {
  const input = document.getElementById("userInput").value.toLowerCase().trim();
  console.log("User input:", input); // Debug statement
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  // Tokenize the input
  const inputKeywords = input.split(" ").filter((keyword) => keyword !== "");

  // Extract relevant values from camera data and rules to use for matching
  const relevantValues = new Set();
  cameraData.forEach((camera) => {
    Object.values(camera).forEach((value) => relevantValues.add(value.toString().toLowerCase()));
  });

  rules.forEach((rule) => {
    Object.values(rule.condition).forEach((value) => relevantValues.add(value.toLowerCase()));
  });

  // Filter out irrelevant keywords
  const filteredKeywords = inputKeywords.filter((keyword) => relevantValues.has(keyword));

  // Check each rule to see if it matches the filtered input
  let matchingCameras = [];
  rules.forEach((rule) => {
    const { condition, cameras } = rule;
    const conditionValues = Object.values(condition).map((value) => value.toLowerCase());

    const allKeywordsMatch = filteredKeywords.every((keyword) =>
      conditionValues.some((value) => value.includes(keyword))
    );

    if (allKeywordsMatch) {
      matchingCameras = matchingCameras.concat(cameras);
    }
  });

  // Remove duplicates
  matchingCameras = [...new Set(matchingCameras)];

  if (matchingCameras.length > 0) {
    matchingCameras.forEach((cameraModel) => {
      const camera = cameraData.find((cam) => cam.Model.toLowerCase() === cameraModel.toLowerCase());
      if (camera) {
        const cameraDiv = document.createElement("div");
        cameraDiv.className = "camera";
        cameraDiv.innerHTML = `
          <h3>${camera.Model}</h3>
          <p>Release Year: ${camera["Release Year"]}</p>
          <p>Sensor Type: ${camera["Sensor Type"]}</p>
          <p>Sensor Size: ${camera["Sensor Size"]}</p>
          <p>Resolution: ${camera.Resolution}</p>
          <p>ISO Range: ${camera["ISO Range"]}</p>
          <p>Focus Points: ${camera["Focus Points"]}</p>
          <p>Video Resolution: ${camera["Video Resolution"]}</p>
          <p>Burst Rate: ${camera["Burst Rate"]}</p>
          <p>Viewfinder: ${camera.Viewfinder}</p>
          <p>LCD Type: ${camera["LCD Type"]}</p>
          <p>Battery Life: ${camera["Battery Life"]}</p>
          <p>Release Price: ${camera["Release Price"]}</p>
        `;
        resultsDiv.appendChild(cameraDiv);
      }
    });
  } else {
    resultsDiv.innerHTML = "<p>No cameras found matching your criteria.</p>";
  }
}
