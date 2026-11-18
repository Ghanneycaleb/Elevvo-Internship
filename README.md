# Elevvo Frontend Internship Projects

A collection of frontend projects built during the Elevvo internship. Each task is self-contained and has its own setup instructions.

| Task | Level | Project | Technologies | Folder |
|---|---|---|---|---|
| 01 | Level 1 | SlideBar — responsive collapsible sidebar | HTML, CSS, JavaScript | [Task-01](./Task-01/) |
| 04 | Level 2 | The Curious Journal — searchable, filterable Blog Homepage | HTML, CSS, JavaScript | [Task-04](./Task-04/) |
| 06 | Level 3 | StudioDesk — freelance admin dashboard | React, React Router, Tailwind CSS, Recharts | [Task-06](./Task-06/) |
| 07 | Level 3 | Weather Sight — real-time weather dashboard | HTML, CSS, JavaScript, OpenWeatherMap API | [Task-07](./Task-07/) |

## Getting started

Open a task folder for its README and run instructions:

- [Task-01 README](./Task-01/README.md)
- [Task-04 README](./Task-04/README.md)
- [Task-06 README](./Task-06/README.md)
- [Task-07 README](./Task-07/README.md)

The static HTML projects do not require package installation. Task-06 uses npm and Vite. Task-07 needs a local OpenWeatherMap API key for live weather and should be served from localhost or HTTPS for browser geolocation.

## Notes

- Task-04 uses fictional sample journal posts; its external Unsplash images need an internet connection.
- Task-06 uses fictional, local-only dashboard data and does not connect to a backend.
- Task-07 uses a local `config.js` file for the API key. That file is Git-ignored; see its README before configuring or publishing the project.
