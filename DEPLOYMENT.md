# Instrukcja Deploymentu - Gra w Kości

## Opcje deploymentu aplikacji do Internetu

### Opcja 1: Railway.app (Zalecane - Najprostsze)

Railway oferuje darmowy hosting dla aplikacji full-stack z prostym deploymentem.

#### Kroki:

1. **Przygotowanie kodu**
   - Utwórz repozytorium Git i wypchnij kod na GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <TWÓJ_URL_REPO>
   git push -u origin main
   ```

2. **Deployment na Railway**
   - Zarejestruj się na [railway.app](https://railway.app)
   - Kliknij "New Project" → "Deploy from GitHub repo"
   - Wybierz swoje repozytorium
   - Railway automatycznie wykryje monorepo

3. **Konfiguracja Backend**
   - Dodaj zmienną środowiskową `PORT` (Railway automatycznie ustawi)
   - Railway przygotuje publiczny URL dla backendu

4. **Konfiguracja Frontend**
   - Zaktualizuj `apps/frontend/src/hooks/useWebSocket.ts`:
   ```typescript
   const WS_URL = import.meta.env.PROD 
     ? 'wss://twoj-backend.railway.app' 
     : 'ws://localhost:3001';
   ```
   - Dodaj zmienną środowiskową w Railway dla frontendu

5. **Deployment**
   - Railway automatycznie zbuduje i wdroży obie aplikacje
   - Otrzymasz URL: `https://twoj-frontend.railway.app`

---

### Opcja 2: Render.com

Render oferuje darmowy hosting z automatycznym SSL.

#### Backend:

1. Zarejestruj się na [render.com](https://render.com)
2. Utwórz nowy "Web Service"
3. Połącz repozytorium GitHub
4. Konfiguracja:
   - **Root Directory**: `apps/backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Otrzymasz URL backendu (np. `https://dices-backend.onrender.com`)

#### Frontend:

1. Utwórz nowy "Static Site"
2. Połącz to samo repozytorium
3. Konfiguracja:
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Dodaj zmienną środowiskową:
   - `VITE_WS_URL`: `wss://dices-backend.onrender.com`
5. Zaktualizuj `useWebSocket.ts`:
   ```typescript
   const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
   ```

---

### Opcja 3: Vercel (Frontend) + Railway/Render (Backend)

#### Backend na Railway/Render (jak wyżej)

#### Frontend na Vercel:

1. Zainstaluj Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy frontendu:
   ```bash
   cd apps/frontend
   vercel
   ```

3. Podczas konfiguracji:
   - Root Directory: pozostaw puste lub `apps/frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Dodaj zmienną: `VITE_WS_URL=wss://twoj-backend.railway.app`

---

### Opcja 4: VPS (np. DigitalOcean, Linode)

Dla większej kontroli możesz użyć własnego serwera VPS.

#### Wymagania:
- Ubuntu 22.04 LTS
- Node.js 18+
- Nginx
- PM2 (process manager)
- Let's Encrypt (darmowy SSL)

#### Kroki:

1. **Połącz się z serwerem**
   ```bash
   ssh root@twoj-serwer-ip
   ```

2. **Zainstaluj zależności**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs nginx
   sudo npm install -g pm2
   ```

3. **Sklonuj repozytorium**
   ```bash
   cd /var/www
   git clone <TWÓJ_REPO_URL> dices
   cd dices
   ```

4. **Zainstaluj i zbuduj backend**
   ```bash
   cd apps/backend
   npm install
   npm run build
   pm2 start dist/index.js --name dices-backend
   pm2 save
   pm2 startup
   ```

5. **Zainstaluj i zbuduj frontend**
   ```bash
   cd ../frontend
   npm install
   # Zaktualizuj WS_URL w .env.production
   echo "VITE_WS_URL=wss://twoj-domena.com" > .env.production
   npm run build
   ```

6. **Konfiguracja Nginx**
   Utwórz `/etc/nginx/sites-available/dices`:
   ```nginx
   server {
       listen 80;
       server_name twoj-domena.com;

       # Frontend
       location / {
           root /var/www/dices/apps/frontend/dist;
           try_files $uri $uri/ /index.html;
       }

       # WebSocket Backend
       location /ws {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
       }

       # REST API Backend
       location /api {
           proxy_pass http://localhost:3001;
           proxy_set_header Host $host;
       }
   }
   ```

7. **Włącz konfigurację**
   ```bash
   sudo ln -s /etc/nginx/sites-available/dices /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Zainstaluj SSL (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d twoj-domena.com
   ```

9. **Aktualizacja kodu**
   ```bash
   cd /var/www/dices
   git pull
   cd apps/backend && npm install && npm run build
   pm2 restart dices-backend
   cd ../frontend && npm install && npm run build
   ```

---

### Opcja 5: Docker + dowolny hosting

#### Dockerfile dla backendu:
```dockerfile
# apps/backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

#### Dockerfile dla frontendu:
```dockerfile
# apps/frontend/Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml:
```yaml
version: '3.8'
services:
  backend:
    build: ./apps/backend
    ports:
      - "3001:3001"
    restart: always

  frontend:
    build: ./apps/frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: always
```

Uruchom:
```bash
docker-compose up -d
```

---

## Ważne uwagi

### WebSocket URL
Zawsze pamiętaj o aktualizacji URL WebSocket:
- Lokalne: `ws://localhost:3001`
- Produkcja HTTP: `ws://twoja-domena.com`
- Produkcja HTTPS: `wss://twoja-domena.com` (zawsze używaj wss z https!)

### CORS
Backend ma włączone CORS dla wszystkich domen. W produkcji możesz to ograniczyć w `apps/backend/src/index.ts`:
```typescript
app.use(cors({
  origin: 'https://twoja-domena.com'
}));
```

### Zmienne środowiskowe
Utwórz pliki `.env`:

**Backend (.env)**:
```
PORT=3001
NODE_ENV=production
```

**Frontend (.env.production)**:
```
VITE_WS_URL=wss://twoj-backend-url.com
```

---

## Rekomendacje

- **Dla szybkiego testu**: Railway.app (za darmo, automatycznie)
- **Dla produkcji**: Vercel (frontend) + Railway (backend)
- **Dla profesjonalnego projektu**: VPS z Nginx + PM2 + SSL
- **Dla skalowalności**: Docker + Kubernetes

---

## Monitoring i Konserwacja

### Logi na Railway/Render
- Dostępne w panelu webowym
- Automatyczne backupy

### Logi na VPS
```bash
# Backend logs
pm2 logs dices-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Monitoring wydajności
```bash
pm2 monit
```

---

## Koszty (przybliżone)

- **Railway**: $0 (500 godz/mies) → $5-20/mies w zależności od użycia
- **Render**: $0 (plan darmowy z limitem) → $7/mies dla płatnego planu
- **Vercel + Railway**: $0-10/mies
- **DigitalOcean VPS**: $6-12/mies
- **AWS/Google Cloud**: $5-50+/mies (zależnie od konfiguracji)

---

## Troubleshooting

### WebSocket nie działa
- Sprawdź czy używasz `wss://` z HTTPS
- Sprawdź konfigurację proxy (Nginx/CloudFlare)
- Upewnij się że port 3001 jest otwarty

### Aplikacja nie startuje
- Sprawdź logi: `pm2 logs` lub w panelu Railway/Render
- Zweryfikuj zmienne środowiskowe
- Sprawdź czy wszystkie zależności są zainstalowane

### Błędy CORS
- Zaktualizuj konfigurację CORS w backendzie
- Sprawdź czy frontend wysyła requesty na prawidłowy URL
