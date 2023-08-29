# Ordo

**Ordo** is a web application for managing gig work.

It allows managers to post new gigs and workers to sign up for them. Workers can also submit their work hours via the app.

Managers have the ability to add new workers to the system. When a worker is added, they will get an email with a link to set their own password. Currently, managers can only be added through an admin API.

If an user's email is linked to a valid Google account, they can sign in with Google.

The project is implemented using **React, ASP.NET Core** (with **EF Core**) and **Postgresql**. It can be installed as a PWA, which is especially convenient for Android users wanting to log in through Google.

_Due to various reasons regarding the original client, development of the project has halted. However, the project is still being hosted and can be found [here](https://ordo.radiak.fi/)._

## Development

- Clone the repository and navigate to it

```
git clone https://github.com/radiak-oy/ordo.git
```
```
cd ordo
```
#### Frontend
```
cd frontend
```
```
npm i
```
```
npm run dev
```
#### Backend
* First, in one console window, start the Postgres instance
```
cd backend
```
```
docker compose up
```
* Then, in another console window, run the API
```
cd backend/Ordo.Api/
```
```
dotnet run
```
