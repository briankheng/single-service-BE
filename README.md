# Single Service BE

## Identitas Diri
- Nama: Brian Kheng
- NIM: 13521049

## Cara Menjalankan
Projek telah di-deploy di: https://labpro-single-service-be.vercel.app/ <br>
Atau, jika ingin menjalankan di lokal (http://localhost:3000/):
1. ```sh
    git clone https://github.com/briankheng/single-service-be.git
   ```
2. ```sh
    npm install
   ```
3. ```sh
    npm run dev
   ```
### Credential:
- Username: admin
- Password: admin

## Design Pattern
- Singleton Pattern
- Repository Pattern
- MVC Pattern

## Technology Stack
- TypeScript 5.1.6
- Next.js 13.4
- PostgreSQL 15.2
- Prisma ORM 5.0.0

## Endpoint
- GET /self
- GET /barang
- GET /barang/:id
- GET /perusahaan
- GET /perusahaan/:id
- POST /barang
- POST /login
- POST /perusahaan
- UPDATE /barang/:id
- UPDATE /perusahaan/:id
- DELETE /barang/:id
- DELETE /perusahaan/:id

## Bonus
- B02 - Deployment
- B03 - Single Service Implementation
