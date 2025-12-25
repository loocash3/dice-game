import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import {
  Game,
  GameState,
  WebSocketMessage,
  CreateGamePayload,
  JoinGamePayload,
  AddScorePayload
} from './types';
import {
  createEmptyPlayer,
  updatePlayerScore
} from './gameLogic';

// Generate short game ID (6 characters: letters and numbers)
function generateGameId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar looking chars
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// Generate unique player ID
function generatePlayerId(): string {
  return Math.random().toString(36).substring(2, 15);
}

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

// In-memory game state
const gameState: GameState = {
  games: {}
};

// Map to track WebSocket connections per game
const gameConnections = new Map<string, Set<WebSocket>>();

// Broadcast game update to all connected clients for a specific game
function broadcastGameUpdate(gameId: string) {
  const game = gameState.games[gameId];
  if (!game) return;

  const connections = gameConnections.get(gameId);
  if (!connections) return;

  const message: WebSocketMessage = {
    type: 'game-update',
    payload: game
  };

  const messageStr = JSON.stringify(message);
  connections.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(messageStr);
    }
  });
}

// WebSocket connection handler
wss.on('connection', (ws: WebSocket) => {
  console.log('New WebSocket connection');

  ws.on('message', (data: string) => {
    try {
      const message: WebSocketMessage = JSON.parse(data.toString());

      switch (message.type) {
        case 'create-game': {
          const payload = message.payload as CreateGamePayload;
          const gameId = generateGameId();
          const adminId = generatePlayerId();

          // Create players (admin is not a player, just manages the game)
          const players = payload.playerNames.map(name => createEmptyPlayer(generatePlayerId(), name));

          const game: Game = {
            id: gameId,
            adminId,
            players,
            currentRound: 1,
            currentPlayerIndex: 0,
            createdAt: Date.now()
          };

          gameState.games[gameId] = game;

          // Add connection to game
          if (!gameConnections.has(gameId)) {
            gameConnections.set(gameId, new Set());
          }
          gameConnections.get(gameId)!.add(ws);

          // Send response
          ws.send(JSON.stringify({
            type: 'game-update',
            payload: game
          }));

          console.log(`Game created: ${gameId}`);
          break;
        }

        case 'join-game': {
          const payload = message.payload as JoinGamePayload;
          const game = gameState.games[payload.gameId];

          if (!game) {
            ws.send(JSON.stringify({
              type: 'error',
              payload: { message: 'Gra nie istnieje' }
            }));
            return;
          }

          // Add connection to game
          if (!gameConnections.has(payload.gameId)) {
            gameConnections.set(payload.gameId, new Set());
          }
          gameConnections.get(payload.gameId)!.add(ws);

          // Send current game state
          ws.send(JSON.stringify({
            type: 'game-update',
            payload: game
          }));

          console.log(`Client joined game: ${payload.gameId}`);
          break;
        }

        case 'add-score': {
          const payload = message.payload as AddScorePayload;
          const game = gameState.games[payload.gameId];

          if (!game) {
            ws.send(JSON.stringify({
              type: 'error',
              payload: { message: 'Gra nie istnieje' }
            }));
            return;
          }

          // Find and update player
          const playerIndex = game.players.findIndex(p => p.id === payload.playerId);
          if (playerIndex === -1) {
            ws.send(JSON.stringify({
              type: 'error',
              payload: { message: 'Gracz nie istnieje' }
            }));
            return;
          }

          try {
            game.players[playerIndex] = updatePlayerScore(
              game.players[playerIndex],
              payload.achievementType,
              payload.score
            );

            // Move to next player
            game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
            
            // Check if all players have completed all achievements to increment round
            const allPlayersCompleted = game.players.every(player => 
              Object.values(player.achievements).every(score => score !== null)
            );
            if (allPlayersCompleted) {
              game.currentRound += 1;
            }

            // Broadcast update to all connected clients
            broadcastGameUpdate(payload.gameId);

            console.log(`Score added for player ${payload.playerId} in game ${payload.gameId}`);
          } catch (error) {
            ws.send(JSON.stringify({
              type: 'error',
              payload: { message: (error as Error).message }
            }));
          }
          break;
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        payload: { message: 'Błąd przetwarzania wiadomości' }
      }));
    }
  });

  ws.on('close', () => {
    // Remove connection from all games
    gameConnections.forEach((connections, gameId) => {
      connections.delete(ws);
      if (connections.size === 0) {
        gameConnections.delete(gameId);
      }
    });
    console.log('WebSocket connection closed');
  });
});

// REST API endpoints (optional, for debugging)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', games: Object.keys(gameState.games).length });
});

app.get('/api/games/:id', (req, res) => {
  const game = gameState.games[req.params.id];
  if (!game) {
    res.status(404).json({ error: 'Gra nie istnieje' });
    return;
  }
  res.json(game);
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready`);
});
