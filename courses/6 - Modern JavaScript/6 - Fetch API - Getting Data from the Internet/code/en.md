---
version: 1
---

```javascript
// Fetch API - getting data from the internet!

printData("=== Learning About the Fetch API ===");

// Simple example: Getting a random fact
async function getRandomFact() {
  try {
    printData("🔄 Fetching a random fact...");
    
    const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
    const data = await response.json();
    
    printData("📝 Random fact: " + data.text);
  } catch (error) {
    printData("😞 Couldn't get the fact: " + error.message);
  }
}

// Example: Getting weather data (simulated)
async function getWeatherData() {
  try {
    printData("🌤️ Fetching weather data...");
    
    // We'll simulate weather data since we can't access real weather APIs easily
    const simulatedWeather = {
      city: "Fun City",
      temperature: 22,
      weather: "sunny",
      emoji: "☀️"
    };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    printData(`${simulatedWeather.emoji} Weather in ${simulatedWeather.city}: ${simulatedWeather.temperature}°C and ${simulatedWeather.weather}!`);
  } catch (error) {
    printData("😞 Couldn't get weather: " + error.message);
  }
}

// Example: Getting information about a Pokemon
async function getPokemonInfo(pokemonName) {
  try {
    printData(`🔄 Fetching info about ${pokemonName}...`);
    
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    
    if (!response.ok) {
      throw new Error(`Pokemon ${pokemonName} not found!`);
    }
    
    const pokemon = await response.json();
    
    printData(`🎮 Pokemon: ${pokemon.name}`);
    printData(`📊 Height: ${pokemon.height / 10} meters`);
    printData(`⚖️ Weight: ${pokemon.weight / 10} kg`);
    printData(`🎯 Type: ${pokemon.types[0].type.name}`);
    
  } catch (error) {
    printData("😞 Couldn't get Pokemon info: " + error.message);
  }
}

// Example: Error handling with fetch
async function handleFetchErrors() {
  try {
    printData("🧪 Testing error handling...");
    
    // This URL doesn't exist, so it will cause an error
    const response = await fetch('https://this-website-does-not-exist.com/api/data');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    printData("Data received: " + data);
    
  } catch (error) {
    printData("✅ Caught error successfully: " + error.message);
    printData("💡 This is how we handle fetch errors!");
  }
}

// Running the examples
getRandomFact();
getWeatherData();
getPokemonInfo("pikachu");
handleFetchErrors();

printData("📋 All fetch examples are running...");
printData("⏰ Some examples might take a moment to load!");
```