let cameraData = [];

document.addEventListener("DOMContentLoaded", (event) => {
  fetch("camera_data.json")
    .then((response) => response.json())
    .then((data) => {
      cameraData = data;
      console.log("Camera data loaded:", cameraData); // Debug statement
    })
    .catch((error) => console.error("Error fetching the camera data:", error));
});

function filterCameras() {
  const input = document.getElementById("userInput").value.toLowerCase().trim();
  console.log("User input:", input); // Debug statement
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  // Tokenize the input and remove common words that don't help in filtering
  const inputKeywords = input
    .split(" ")
    .filter((keyword) => keyword !== " ");

  // Function to check if a keyword matches any value in a camera object
  function matchesAnyValue(keyword, camera) {
    return Object.values(camera).some((value) =>
      value.toString().toLowerCase().includes(keyword)
    );
  }

  // Filter keywords that match any value in the camera data
  const relevantKeywords = inputKeywords.filter((keyword) =>
    cameraData.some((camera) => matchesAnyValue(keyword, camera))
  );

  const filteredCameras = cameraData.filter((camera) => {
    const model = camera.Model.toLowerCase();
    const releaseYear = camera["Release Year"].toString().toLowerCase();
    const sensorType = camera["Sensor Type"].toLowerCase();
    const sensorSize = camera["Sensor Size"];
    const resolution = camera.Resolution;
    const isoRange = camera["ISO Range"];
    const focusPoints = camera["Focus Points"].toString(); // Convert to string
    const videoResolution = camera["Video Resolution"].toLowerCase();
    const burstRate = camera["Burst Rate"];
    const viewfinder = camera.Viewfinder.toLowerCase();
    const lcdType = camera["LCD Type"];
    const batteryLife = camera["Battery Life"];
    const releasePrice = camera["Release Price"];

    const matchingKeywords = relevantKeywords.filter((keyword) => {
      return (
        model.includes(keyword) ||
        releaseYear.includes(keyword) ||
        sensorType.includes(keyword) ||
        sensorSize.includes(keyword) ||
        resolution.includes(keyword) ||
        isoRange.includes(keyword) ||
        focusPoints.includes(keyword) ||
        videoResolution.includes(keyword) ||
        burstRate.includes(keyword) ||
        viewfinder.includes(keyword) ||
        lcdType.includes(keyword) ||
        batteryLife.includes(keyword) ||
        releasePrice.includes(keyword)
      );
    });

    return matchingKeywords.length === relevantKeywords.length;
  });

  console.log("Filtered cameras:", filteredCameras); // Debug statement

  if (filteredCameras.length > 0) {
    filteredCameras.forEach((camera) => {
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
    });
  } else {
    resultsDiv.innerHTML = "<p>No cameras found matching your criteria.</p>";
  }
}