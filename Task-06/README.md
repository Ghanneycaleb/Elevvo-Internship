# StudioDesk

**Elevvo Internship · Task 06 · Level 3**

A responsive freelance dashboard built with React, React Router, Tailwind CSS, and Recharts. All client, project, earnings, and activity data is fictional mock data; there is no backend.

## Requirements

- Node.js and npm.

## Run locally

From this folder, install dependencies and start the Vite development server:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite in your browser.

## Pages and behavior

- **Overview:** summary cards, recent activity, active projects, and a monthly earnings chart.
- **Projects:** mock projects with status filters and responsive table/card layouts.
- **Profile settings:** locally editable name, email, and password fields with basic validation.

Money values use Ghana cedis (GHS). Profile edits and dashboard data are local demo state; they are not saved to an account or server.

## Checks and production build

```sh
npm run lint
npm run build
```

To serve the production build locally after building:

```sh
npm run preview
```
