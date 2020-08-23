window.addEventListener("load", () => {
    let lat;
    let long;
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;

            fetch(`${api.base}weather?lat=${lat}&lon=${long}&appid=${api.key}`)
            .then(weather => {
                return weather.json();
            }).then(displayResults);
        })
    }
})

const api = {
    key: "725325ca5bf6d323f4e4a135080629b0",
    base: "https://api.openweathermap.org/data/2.5/",
    imageURL: "http://openweathermap.org/img/wn/"
}

let outsideWeather = undefined;

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

const tempChanger = document.querySelector(".current .temperature");
let tempSpan = document.querySelector('.current span');
tempChanger.addEventListener('click', () => {
    if(tempSpan.textContent === "°c") {
        let f = (outsideWeather.main.temp * (9/5)) + 32;
        tempChanger.innerHTML = `${Math.round(f)}°F`;
        tempSpan.innerHTML = "°F"
    }
    else {
        tempChanger.innerHTML = `${Math.round(outsideWeather.main.temp)}°c`;
        tempSpan.innerHTML = "°c"
    }
})

function setQuery(evt) {
    if(evt.keyCode == 13) {
        getResults(searchbox.value);
    }
}

function getResults(query) {
    fetch(`${api.base}weather?q=${query}&units=metric&appid=${api.key}`)
    .then(weather => {
        return weather.json();
    }).then(displayResults);
}

function displayResults (weather) {
    outsideWeather = weather;
    
    if(weather.cod === "404") {
        alert("No such place found! Please enter a correct location.");
        return;
    }
    
    if(weather.cod === "400") {
        alert("No place entered! Please enter a valid location.");
        return;
    }
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(new Date());

    let temp = document.querySelector('.current .temperature');
    temp.innerHTML = `${Math.round(weather.main.temp)}°c`;
    
    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;

    let hi_low = document.querySelector('.hi-low');
    hi_low.innerText = `Min:${Math.round(weather.main.temp_min)}°c / Max:${Math.round(weather.main.temp_max)}°c`;

    let weatherImg = document.querySelector('.image');
    weatherImg.src = `${api.imageURL}${weather.weather[0].icon}@2x.png`;
    weatherImg.alt = weather.weather[0].description;
}

function dateBuilder(d) {
    let months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
    "Saturday"];

    let date = d.getDate();

    if(date === 1 || date === 21 || date === 31) {
        date += ' st';
    } else if(date == 2 || date == 22) {
        date += ' nd'
    } else if(date === 23) {
        date += ' rd';
    } else {
        date += ' th'
    }
    return `${days[d.getDay()]} ${date} ${months[d.getMonth()]} ${d.getFullYear()}`
}