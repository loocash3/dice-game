import { useState, useEffect, useCallback, useRef } from 'react';
import { Game, WebSocketMessage, AchievementType } from '../types';

// https://dice-game-o7up.onrender.com

// WebSocket URL - automatically uses production URL when deployed
const WS_URL = import.meta.env.PROD 
  ? 'wss://dice-game-o7up.onrender.com'  // ⬅️ Twój URL z Render (wss://)
  : 'ws://localhost:3001';

const GAME_ID_KEY = 'dices_game_id';

export function useWebSocket() {
  const [game, setGame] = useState<Game | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const autoJoinAttempted = useRef(false);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      setError(null);
      
      // Auto-join saved game after connection
      if (!autoJoinAttempted.current) {
        autoJoinAttempted.current = true;
        const savedGameId = localStorage.getItem(GAME_ID_KEY);
        if (savedGameId) {
          console.log('Auto-joining game:', savedGameId);
          ws.send(JSON.stringify({
            type: 'join-game',
            payload: { gameId: savedGameId }
          }));
        }
      }
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        if (message.type === 'game-update') {
          const gameData = message.payload;
          setGame(gameData);
          // Save game ID to localStorage
          localStorage.setItem(GAME_ID_KEY, gameData.id);
        } else if (message.type === 'error') {
          setError(message.payload.message);
          // Clear saved game ID if error joining
          const errorMessage = message.payload.message;
          if (errorMessage.includes('nie istnieje')) {
            localStorage.removeItem(GAME_ID_KEY);
          }
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Błąd połączenia z serwerem');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      setError('Brak połączenia z serwerem');
    }
  }, []);

  const createGame = useCallback((playerNames: string[]) => {
    sendMessage({
      type: 'create-game',
      payload: { playerNames }
    });
  }, [sendMessage]);

  const joinGame = useCallback((gameId: string) => {
    sendMessage({
      type: 'join-game',
      payload: { gameId }
    });
  }, [sendMessage]);

  const addScore = useCallback((playerId: string, achievementType: AchievementType, score: number) => {
    if (!game) return;
    
    sendMessage({
      type: 'add-score',
      payload: {
        gameId: game.id,
        playerId,
        achievementType,
        score
      }
    });
  }, [game, sendMessage]);

  return {
    game,
    connected,
    error,
    createGame,
    joinGame,
    addScore
  };
}
