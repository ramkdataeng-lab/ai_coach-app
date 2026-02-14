# Nirvan - Your AI Life Coach 🧘‍♂️

![Nirvan Banner](./public/Nirvan-ai/assets/logo.jpg)

> **RevenueCat Shipyard 2026 Hackathon Submission**

**Nirvan** is an advanced AI coaching platform designed to democratize access to personal development. Unlike generic chatbots, Nirvan offers specialized "Persona Coaches" that understand your unique context, goals, and history.

Whether you need a tough-love fitness instructor, a minimalist chef, or a compassionate therapist, Nirvan has a coach for you.

---

## 🚀 Key Features

### 🧠 specialized Persona Coaches
Choose from 6 pre-built expert personas, each with a unique voice and expertise:
*   **Life Strategist:** Holistic life planning and goal setting.
*   **Fitness Drill Sergeant:** No-nonsense workout and health advice.
*   **Zen Master:** Mindfulness, stress reduction, and philosophy.
*   **Financial Advisor:** Budgeting, investing, and wealth management.
*   **Relationship Counselor:** Navigating social and romantic dynamics.
*   **Career Mentor:** Professional growth and workplace navigation.

### ✨ Create Your Own Coach
Don't see what you need? Use our **AI Coach Crafter** to generate a custom coach in seconds. Just describe the persona (e.g., "A sarcastic Python tutor"), and Nirvan will generate the system prompt and icon automatically.

### 📝 Context-Aware Engine
Nirvan doesn't just chat; it *remembers*. The **Personal Context Engine** allows you to store key facts about your life (e.g., "I'm vegetarian," "I'm training for a marathon") which every coach automatically respects.

### 🔒 Privacy First
Your data belongs to you. Conversations and personal context are stored locally on your device. We never use your data to train public AI models.

### 💎 Premium Experience (RevenueCat Integration)
*   **Freemium Model:** Users get limited daily interactions.
*   **Nirvan Pro:** Unlocks unlimited messages, all coach personas, and advanced GPT-4 models.
*   **Powered by RevenueCat:** Seamless cross-platform subscription management.

---

## 🛠️ Tech Stack

*   **Framework:** [React Native](https://reactnative.dev/) (via [Expo](https://expo.dev/))
*   **Language:** TypeScript
*   **AI Engine:** OpenAI GPT-4 Turbo
*   **Monetization:** [RevenueCat](https://www.revenuecat.com/) (Subscription Management)
*   **Navigation:** Expo Router
*   **Storage:** AsyncStorage (Local Presistence)

---

## 📸 Screenshots

| Home Screen | Chat Interface | Coach Library | Profile |
|:---:|:---:|:---:|:---:|
| <img src="./path/to/screenshot1.png" width="200" /> | <img src="./path/to/screenshot2.png" width="200" /> | <img src="./path/to/screenshot3.png" width="200" /> | <img src="./path/to/screenshot4.png" width="200" /> |

---

## 🏁 Getting Started

### Prerequisites
*   Node.js (v18+)
*   RevenueCat API Keys (Public)
*   OpenAI API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ramkdataeng-lab/ai_coach-app.git
    cd ai_coach-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    EXPO_PUBLIC_OPENAI_API_KEY=your_openai_key_here
    ```

4.  **Run the App**
    ```bash
    npx expo start
    ```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements
*   Built for the **RevenueCat Shipyard** Hackathon.
*   Icons by [Lucide React Native](https://lucide.dev/).
*   Fonts by [Google Fonts](https://fonts.google.com/) (Outfit & Inter).
