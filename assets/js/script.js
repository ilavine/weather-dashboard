const apiKey = "1cc5f13701379e65bc7fdab33e6888cd";
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");
let resultDiv = document.querySelector(".col-8");
const searchesEl = document.querySelector(".saved-searches");
const cardEl = document.querySelector(".weatherCont");
let searchResults = [];
function saveSearchResults() {
  const searchValue = searchInput.value;
  const currentDate = new Date();
  const searchResult = {
    date: currentDate.toLocaleDateString(),
    city: searchValue,
  };
  searchResults.push(searchResult);
  localStorage.setItem("searchResults", JSON.stringify(searchResults));
}

function displaySavedSearchResults() {
  searchesEl.innerHTML = "<h2> Past Searches: </h2>";
  const savedSearchResults = JSON.parse(localStorage.getItem("searchResults"));
  if (savedSearchResults) {
    for (let i = 0; i < savedSearchResults.length; i++) {
      searchesEl.innerHTML += `<a href="#" class="list-group-item list-group-item-action city">${savedSearchResults[i].city}</a>`;
    }
    const cityLinks = document.querySelectorAll(".city");
    cityLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const city = link.textContent;
        console.log(city);
        searchWeather(city);
      });
    });
  }
}

function searchWeather(city) {
  saveSearchResults();

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const date = new Date();
      const dayOfWeek = date.toLocaleDateString();
      const cityName = data.name;
      const tempFahrenheit = data.main.temp;
      const weatherDesc = data.weather[0].description;
      const iconCode = data.weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

      resultDiv.innerHTML = `
        <div class="card result">
            <div class="card-body">
                <h3>${cityName}</h3>
                <h4>${date}</h4>
                <h5>${dayOfWeek}</h5>
              <img src="${iconUrl}" alt="${weatherDesc}">
              <p>${weatherDesc}</p>
              <p>Temperature: ${tempFahrenheit} °F</p>
            </div>
      </div>
      <hr class="hr" />
        `;

      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const forecastList = data.list;
          console.log(forecastList);
          const forecastDiv = document.createElement("div");
          forecastDiv.classList.add("row");

          for (let i = 0; i < 6; i++) {
            const forecastDate = Date(forecastList[i].dt);
            const forecastTemp = forecastList[i].main.temp;
            const forecastIconCode = forecastList[i].weather[0].icon;
            const forecastIconUrl = `http://openweathermap.org/img/w/${forecastIconCode}.png`;

            resultDiv.innerHTML += `
            <div class="col-12">
              <div class="card forecast-card">
                <div class="card-body">
                  <h5>${forecastDate}</h5>
                  <img src="${forecastIconUrl}" alt="${forecastTemp}">
                  <p>Temperature: ${forecastTemp} °F</p>
                </div>
              </div>
              </div>
            `;
          }
        })
        .catch((error) => console.log(error));
    })

    .catch((error) => console.log(error));
}

displaySavedSearchResults();
searchBtn.addEventListener("click", () => {
  const city = searchInput.value;
  searchWeather(city);
});
