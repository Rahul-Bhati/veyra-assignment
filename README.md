## Project Setup

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI: `npm install -g expo-cli`
- Expo Go app or iOS/Android simulator
- Firebase account and project

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/instagram-clone.git
   cd instagram-clone

2. **Install Dependancy**
   ```bash
   npm install
3. **Configure Firebase**
   ```bash
     const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID",
    };
4. **Set Firestore security rules**
  ```bash
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /messages/{messageId} { allow read, write: if request.auth != null; }
          match /posts/{postId} { allow read: if true; allow write: if request.auth != null; }
          match /users/{userId} { allow read: if true; allow write: if request.auth != null && request.auth.uid == userId; }
          match /chats/{chatId} { allow read, write: if request.auth != null; }
        }
      }
  ```

5. **Set Up Expo Notifications**
   ```bash
   expo install expo-notifications

6. **Update app.json**
   ```bash
     {
      "expo": {
        "plugins": ["expo-notifications"]
      }
    }
7. **Run the App**
   ```bash
   expo start or npm run dev

Scan QR code with Expo Go or use expo start --ios/--android for simulators.
  
