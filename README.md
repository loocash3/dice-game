# Gra w Kości (Dice Game)

Aplikacja do zarządzania grą w kości w czasie rzeczywistym, gdzie uczestnicy używają fizycznych kości, a stan gry jest zarządzany przez aplikację webową.

## Technologie

- **Monorepo**: npm workspaces
- **Backend**: Node.js, Express, WebSocket (ws)
- **Frontend**: React, TypeScript, Vite, Mantine UI
- **Komunikacja**: WebSocket (real-time)

## Struktura projektu

```
dices/
├── apps/
│   ├── backend/        # Serwer Node.js z WebSocket
│   └── frontend/       # Aplikacja React
└── package.json        # Root package.json
```

## Funkcjonalności

### Osiągnięcia (Achievements)
- **Szkółka**: Jedynki, Dwójki, Trójki, Czwórki, Piątki, Szóstki
- **Kombinacje**: Para, Dwie pary, Trójka, Kareta, Full
- **Streety**: Mały street, Duży street
- **Specjalne**: Poker, Szansa

### Premie
- **Premia za szkółkę**: +50 punktów jeśli suma punktów z Jedynki do Szóstki wynosi ≥63 punktów
- **Premia za pokera**: +50 punktów za zdobycie pokera

### Funkcje aplikacji
1. Tworzenie nowej gry z listą uczestników
2. Dołączanie do gry przez link (ID gry)
3. Dodawanie wyników przez prowadzącego grę
4. Podgląd rankingu na żywo
5. Śledzenie osiągnięć dla każdego gracza
6. Real-time synchronizacja między wszystkimi klientami

## Instalacja

### Wymagania
- Node.js (v18 lub nowszy)
- npm

### Kroki instalacji

1. Zainstaluj zależności:
```bash
npm install
```

2. Zainstaluj zależności dla wszystkich workspace'ów:
```bash
cd apps/backend && npm install
cd ../frontend && npm install
cd ../..
```

## Uruchomienie

### Tryb deweloperski

1. Uruchom backend (w jednym terminalu):
```bash
cd apps/backend
npm run dev
```
Serwer uruchomi się na porcie 3001.

2. Uruchom frontend (w drugim terminalu):
```bash
cd apps/frontend
npm run dev
```
Frontend uruchomi się na porcie 3000.

3. Otwórz przeglądarkę i przejdź do `http://localhost:3000`

### Tryb produkcyjny

1. Zbuduj aplikacje:
```bash
cd apps/backend && npm run build
cd ../frontend && npm run build
```

2. Uruchom serwer:
```bash
cd apps/backend && npm start
```

## Jak używać

### Rozpoczęcie nowej gry

1. Otwórz aplikację w przeglądarce
2. Wybierz "Stwórz grę"
3. Podaj swoją nazwę (będziesz administratorem)
4. Dodaj nazwy pozostałych graczy
5. Kliknij "Rozpocznij grę"
6. Skopiuj ID gry i udostępnij innym uczestnikom

### Dołączanie do gry

1. Otwórz aplikację w przeglądarce
2. Wybierz "Dołącz do gry"
3. Wklej ID gry otrzymane od administratora
4. Kliknij "Dołącz"

### Dodawanie wyników

1. Przejdź do zakładki "Dodaj wynik"
2. Wybierz gracza z listy
3. Wybierz osiągnięcie
4. Wprowadź wynik (punkty)
5. Kliknij "Zapisz wynik"

### Podgląd osiągnięć

1. Przejdź do zakładki "Osiągnięcia"
2. Wybierz gracza z listy
3. Zobacz jakie osiągnięcia zostały zdobyte i jakie są jeszcze dostępne

### Podgląd rankingu

1. Przejdź do zakładki "Ranking"
2. Zobacz aktualny ranking wszystkich graczy
3. Ranking aktualizuje się automatycznie po dodaniu każdego wyniku

## Architektura

### Backend
- Express serwer z WebSocket
- In-memory przechowywanie stanu gry
- Broadcast aktualizacji do wszystkich połączonych klientów

### Frontend
- React z TypeScript
- Mantine UI (open-source biblioteca komponentów)
- Custom WebSocket hook dla komunikacji real-time
- Responsywny interfejs

### Komunikacja
- WebSocket dla real-time updates
- Typy wiadomości: create-game, join-game, add-score, game-update, error

## Rozwój

### Dodawanie nowych funkcji
- Backend logic: `apps/backend/src/gameLogic.ts`
- Backend server: `apps/backend/src/index.ts`
- Frontend components: `apps/frontend/src/components/`
- WebSocket hook: `apps/frontend/src/hooks/useWebSocket.ts`

### Typy
- Backend: `apps/backend/src/types.ts`
- Frontend: `apps/frontend/src/types.ts`

## Deployment do Internetu

### 🚀 Szybki Start (30 minut)
Chcesz wrzucić grę do Internetu? **Zobacz [QUICK_DEPLOY.md](QUICK_DEPLOY.md)**

**Render.com - ZALECANE:**
- ✅ Darmowe
- ✅ Bez konfiguracji serwera
- ✅ Automatyczne aktualizacje z GitHub
- ✅ SSL/HTTPS automatycznie

### 📚 Zaawansowane Opcje
Potrzebujesz więcej? **Zobacz [DEPLOYMENT.md](DEPLOYMENT.md)**
- Railway.app
- Vercel + Backend
- VPS (DigitalOcean, Linode)
- Docker + Kubernetes
- Własna domena
- Baza danych (trwałe przechowywanie)

## Licencja

MIT
