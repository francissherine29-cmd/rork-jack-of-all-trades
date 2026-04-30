# Jack of all Trades

A mobile marketplace app for St. Maarten that connects locals and visitors with trusted local service providers — from car rentals and mechanics to handymen, cleaners, and more.

Built with **Expo** and **React Native**, the app runs on iOS, Android, and the web from a single codebase.

## Features

- **Browse service categories** — Discover providers across many categories including Car Rental, Mechanic, Cleaning, Handyman, and more.
- **Provider profiles** — View ratings, reviews, areas served, price ranges, and contact details.
- **Search & filter** — Quickly find the right provider by category or keyword.
- **Provider registration** — Service providers can sign up through a guided 4-step flow. A one-time **$25 USD signup fee** is collected before the application is submitted.
- **Offline support** — Core data is cached locally so the app remains usable without an internet connection.
- **Privacy details** — In-app privacy information is available to users on first launch and from settings.
- **Account & data deletion** — Users can request deletion of their account and personal data directly from within the app.
- **Localized for St. Maarten** — Categories, providers, and content are tailored to the island.

## Tech Stack

- [Expo](https://expo.dev) (SDK 54) + [Expo Router](https://docs.expo.dev/router/introduction/) for file-based routing
- [React Native](https://reactnative.dev) 0.81 with React 19
- [TypeScript](https://www.typescriptlang.org/) (strict)
- [@tanstack/react-query](https://tanstack.com/query) for server state
- [@nkzw/create-context-hook](https://github.com/nkzw-tech/create-context-hook) for shared client state
- [AsyncStorage](https://github.com/react-native-async-storage/async-storage) for persistence and offline cache
- [lucide-react-native](https://lucide.dev) for icons
- [expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/), [expo-blur](https://docs.expo.dev/versions/latest/sdk/blur-view/), [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) for polished UI

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- [Expo Go](https://expo.dev/client) on your iOS or Android device (for native testing)

### Install

```bash
bun install
```

### Run

```bash
# Start the dev server with a tunnel (scan the QR code in Expo Go)
bun run start

# Run in the browser
bun run start-web
```

### Lint

```bash
bun run lint
```

## Project Structure

```
expo/
├── app/                  # Expo Router routes (screens & layouts)
│   ├── (tabs)/           # Tab navigator
│   ├── provider/         # Provider registration flow
│   └── _layout.tsx       # Root layout
├── components/           # Reusable UI components
├── constants/            # Colors, mock providers, services list
├── hooks/                # Context hooks (providers, auth, etc.)
├── assets/               # Icons, splash, images
└── app.json              # Expo configuration
```

## Provider Registration Flow

Providers register through a 4-step process:

1. **Basic info** — Name, category, contact details
2. **Service details** — Areas served, price range, description
3. **Payment info** — Bank or payout details
4. **Signup fee** — One-time **$25 USD** fee acknowledgment, then submission

## Privacy & Account Deletion

- Users can read the in-app privacy details from the welcome/privacy screen.
- Account & data deletion can be requested from the settings screen.

## License

Proprietary — © Jack of all Trades. All rights reserved.
