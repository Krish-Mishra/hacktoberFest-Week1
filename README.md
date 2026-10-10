# ZenStep 🌿

ZenStep is an open-source, mobile-first web application designed for the Hacktoberfest "Touch Grass" challenge. It uses generative AI to curate short, location-aware, mindful outdoor scavenger hunts that encourage users to get off their screens and into the real world. 

Crucially, once a mission begins, ZenStep enters a strict "Zen Timer" mode. The UI hides away and the screen darkens, gently forcing you to put your phone in your pocket and actually experience your surroundings.

## 🚀 Features

* **AI-Curated Missions**: Dynamically generates unique, sensory-based scavenger hunts based on your environment, available time, and desired vibe.
* **Zen Mode**: Distraction-free, darkened UI during active missions.
* **Powered by Gemini**: Orchestrated using [LangChain.js](https://js.langchain.com/) and Google's Gemini Flash models via the AI Studio API.
* **Lightweight**: Pure HTML5, CSS3, and Vanilla JavaScript. No build steps, no heavy frontend frameworks.

## 🛠 Setup & Installation

Since ZenStep is built with Vanilla JS, getting it running locally is incredibly simple.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Krish-Mishra/hacktoberFest-Week1.git
   cd hacktoberFest-Week1
   ```

2. **Configure your API Key:**
   This project requires a Google Gemini API Key. 
   - Copy the example configuration file:
     ```bash
     cp config.example.js config.js
     ```
   - Open `config.js` and replace `"YOUR_API_KEY_HERE"` with your actual API key from [Google AI Studio](https://aistudio.google.com/).

3. **Run a local server:**
   You can serve the static files using Python, Node, or any simple HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
   
4. **Open the app:**
   Navigate to `http://localhost:8000` in your browser.

## 🤝 Contributing (Hacktoberfest)

Contributions are welcome! This repository is part of Hacktoberfest. Feel free to open issues, submit pull requests, and help improve the app. 

Please remember to **never commit your `config.js` API key** to the repository! (It is already included in the `.gitignore`).

## 📜 License

Distributed under the MIT License.
