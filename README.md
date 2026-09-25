# Cordoval Mood Tracker

Private, local-first daily mood log for [Cordoval](https://cordoval.co.uk).

**Live URL (planned):** https://mood-tracker.cordoval.co.uk

Log how you feel each day, skim your recent history, and take your data with you as a backup file. No account. No cloud storage of your entries.

## Features

- Mood score from 1 to 5 with clear British English labels (Very low through Great)
- Optional short note per day
- Add entries for today or a past date, edit, or delete
- Week strip for the last 7 days at a glance
- Scrollable list of the last 30 days
- IndexedDB storage on your device, with `navigator.storage.persist()` on first visit when supported
- Download and load a JSON backup file (`formatVersion` 1, `productSlug` `mood-tracker`). Files stay on your device unless you copy them elsewhere

## Tech stack

- Vite + React + TypeScript
- Static site suitable for Vercel or any static host

## Development

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Privacy

Your mood entries never leave this browser except when you choose to download a backup file. See the in-app links to Cordoval [Privacy](https://scrub.cordoval.co.uk/privacy) and [Terms](https://scrub.cordoval.co.uk/terms).

## Licence

Copyright Cordoval. All rights reserved unless otherwise stated in the repository.
