# Add Car Rental, Mechanic Services & $25 Provider Signup Fee

## Features

- **Car Rental service category** — Users can browse car rental providers across St. Maarten, see ratings, areas served, and contact them directly
- **Mechanic service category** — Users can find auto mechanics across the island, view their info, and reach out for repairs
- **$25 provider signup fee** — Service providers must pay a one-time $25 USD registration fee before their application is submitted. A new payment step is added to the registration flow explaining the fee

## Design

- **Car Rental** card uses a teal/blue color with a key icon, matching the existing card style
- **Mechanic** card uses an amber/orange-brown color with a settings/gear icon
- Both new categories appear in the services grid on the home screen alongside existing ones
- The signup fee step appears as a **Step 4** in the provider registration flow, shown after the payment info step
- The fee screen displays the amount ($25), a brief explanation, and a "Pay & Submit" button
- A fee badge/note is also shown on the intro section of the registration form so providers know upfront

## Changes

- **Services list** — Two new service categories added: "Car Rental" and "Mechanic"
- **Mock providers** — Sample car rental and mechanic providers added (2 each) with St. Maarten-specific details
- **Home screen** — Icon mapping updated to include the two new icons (CarFront for rentals, Settings for mechanic)
- **Provider registration** — Registration flow expanded from 3 steps to 4 steps, with the new final step collecting the $25 signup fee acknowledgment before submission
- **Provider context** — Registration type updated to track signup fee payment status
