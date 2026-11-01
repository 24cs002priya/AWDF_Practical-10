# nexTrip — Cumulative Practical 10

This is a **standalone snapshot** of nexTrip with the requirements from Week 2 through Week 10. The college's portfolio/task-management examples are adapted into car marketplace functionality while preserving their technical concepts.

## Run frontend
`cd frontend && npm install && npm run dev` → http://localhost:5173

## Run backend
`cd backend && npm install`
Copy `.env.example` to `.env`, then run `npm run dev` → http://localhost:5000.
Set `MONGO_URI` to your own running MongoDB or Atlas URI. The backend waits for a successful connection before listening.
Set a long random `JWT_SECRET`. Register/login to manage car listings; users may edit/delete only their own cars (admin override supported in API).

## Practical progression
- Week 2: React Router, controlled contact form, useState theme and visibility, 404
- Week 3: public REST API, useEffect, spinner, errors, retry and filtering
- Week 4: Express in-memory car CRUD, logging, JSON validation, centralized errors
- Week 5: Mongoose Car schema, validation, database persistence
- Week 6: React-to-backend CRUD, loading/error handling, delete confirmation
- Week 7: bcrypt password hashing, JWT, auth middleware, /me and logout
- Week 8: React.lazy/Suspense route chunks and performance worksheet
- Week 9: node-cache TTL, hit/miss metrics and write invalidation
- Week 10: EventEmitter async car-created/deleted notifications

No credentials or fabricated screenshots are included.
