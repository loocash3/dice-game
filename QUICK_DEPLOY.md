# 🚀 Szybki Deployment - Render.com (ZALECANE)

## Dlaczego Render.com?
- ✅ **Darmowy tier** (wystarczający dla gry)
- ✅ **Automatyczny SSL** (HTTPS)
- ✅ **Zero konfiguracji** serwera
- ✅ **Automatyczny deployment** z GitHub
- ✅ **Nie wymaga karty kredytowej** na start
- ✅ **Działa od razu** - bez Docker, bez VPS, bez komplikacji

---

## Krok 1: Przygotowanie kodu (5 min)

### 1.1 Inicjalizuj git (jeśli jeszcze nie zrobiłeś)
```bash
cd /Users/loocash3/Projects/dices
git init
git add .
git commit -m "Initial commit - Dice game"
```

### 1.2 Utwórz repozytorium na GitHub
1. Wejdź na https://github.com/new
2. Nazwa: `dices-game` (lub dowolna)
3. **Public** (dla darmowego tieru Render)
4. Kliknij "Create repository"

### 1.3 Wypchnij kod na GitHub
```bash
git remote add origin https://github.com/TWOJA_NAZWA/dices-game.git
git branch -M main
git push -u origin main
```

---

## Krok 2: Deploy Backend (10 min)

### 2.1 Utwórz konto na Render.com
1. Wejdź na https://render.com
2. Kliknij "Get Started" 
3. Zaloguj się przez GitHub (najszybsze)

### 2.2 Utwórz nowy Web Service dla backendu
1. Kliknij "New +" → "Web Service"
2. Połącz repozytorium GitHub `dices-game`
3. Konfiguracja:
   - **Name**: `dices-backend` (lub dowolna nazwa)
   - **Root Directory**: `apps/backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/index.js`
   - **Instance Type**: **Free**

4. **Environment Variables** (dodaj zmienną):
   - Key: `PORT`
   - Value: `3001`

5. Kliknij **"Create Web Service"**

6. Poczekaj 3-5 minut na deployment

7. **Zapisz URL backendu**: będzie wyglądać jak `https://dices-backend-xxx.onrender.com`

---

## Krok 3: Zaktualizuj Frontend (2 min)

### 3.1 Zmień URL WebSocket w kodzie

Edytuj plik `apps/frontend/src/hooks/useWebSocket.ts`:

```typescript
// BEFORE:
const WS_URL = 'ws://localhost:3001';

// AFTER (zamień na swój URL z Render):
const WS_URL = import.meta.env.PROD 
  ? 'wss://dices-backend-xxx.onrender.com'  // ⬅️ Twój URL z Render (wss://)
  : 'ws://localhost:3001';
```

**WAŻNE**: Zamień `http://` na `wss://` (WebSocket Secure)!

### 3.2 Commit i push zmian
```bash
git add apps/frontend/src/hooks/useWebSocket.ts
git commit -m "Update WebSocket URL for production"
git push
```

---

## Krok 4: Deploy Frontend (10 min)

### 4.1 Utwórz Static Site dla frontendu
1. W Render: Kliknij "New +" → "Static Site"
2. Wybierz to samo repozytorium
3. Konfiguracja:
   - **Name**: `dices-frontend`
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Kliknij **"Create Static Site"**

5. Poczekaj 3-5 minut

6. **Twoja gra jest LIVE!** URL: `https://dices-frontend-xxx.onrender.com`

---

## Krok 5: Testowanie (5 min)

1. Otwórz URL frontendu w przeglądarce
2. Utwórz nową grę
3. Skopiuj krótkie ID (np. `H4UX4T`)
4. Otwórz w drugim oknie/urządzeniu
5. Dołącz używając ID
6. Sprawdź czy gra synchronizuje się w czasie rzeczywistym! ✅

---

## 🎉 Gotowe!

Twoja gra działa na:
- **Frontend**: `https://dices-frontend-xxx.onrender.com`
- **Backend**: `https://dices-backend-xxx.onrender.com`

### Udostępnianie:
Po prostu wyślij link do frontendu znajomym! 🎲

---

## ⚙️ Automatyczne Aktualizacje

Render automatycznie wdroży zmiany po każdym push do GitHub:

```bash
# Zrób zmiany w kodzie
git add .
git commit -m "Opis zmian"
git push

# Render automatycznie zbuduje i wdroży! 🚀
```

---

## 💡 Wskazówki

### Darmowy tier Render:
- Backend może "zasnąć" po 15 min bezczynności
- Pierwsze połączenie po "uśpieniu" zajmie ~30 sekund
- Wystarczające dla gier towarzyskich!

### Upgrade do płatnego ($7/mies):
- Backend zawsze aktywny (bez "usypiania")
- Szybszy
- Tylko jeśli używasz intensywnie

---

## 🆘 Troubleshooting

### Problem: WebSocket nie działa
**Rozwiązanie**: Sprawdź czy użyłeś `wss://` (nie `ws://`) w URL produkcyjnym

### Problem: Backend nie startuje
**Rozwiązanie**: 
1. Sprawdź logi w Render Dashboard
2. Upewnij się że Build Command i Start Command są poprawne
3. Sprawdź czy zmienna `PORT` jest ustawiona

### Problem: Frontend pokazuje błąd CORS
**Rozwiązanie**: Backend już ma CORS włączony (`app.use(cors())`), powinno działać

### Problem: Gra nie zapisuje się po odświeżeniu
**Rozwiązanie**: 
- To normalne - backend używa in-memory storage
- Gry są zachowane dopóki backend działa
- Po restarcie backendu (raz na 24h na free tier) gry są czyszczone
- Dla trwałego storage - potrzebujesz bazy danych (zobacz DEPLOYMENT.md)

---

## 📚 Więcej opcji

Jeśli chcesz:
- **Własną domenę** (np. gra.twojadomena.pl) - zobacz DEPLOYMENT.md
- **Bazę danych** (trwałe przechowywanie) - zobacz DEPLOYMENT.md
- **Inne platformy** (Railway, Vercel, VPS) - zobacz DEPLOYMENT.md

---

## 🎯 Podsumowanie

**Czas: ~30 minut**  
**Koszt: DARMOWE**  
**Wynik: Działająca gra online z automatycznymi aktualizacjami!** 🎉
