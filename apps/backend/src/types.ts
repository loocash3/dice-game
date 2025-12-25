export type AchievementType = 
  | 'ones' | 'twos' | 'threes' | 'fours' | 'fives' | 'sixes'
  | 'pair' | 'two-pairs' | 'three-of-kind' | 'four-of-kind'
  | 'small-straight' | 'large-straight' | 'poker' | 'full-house' | 'chance';

export interface Achievement {
  type: AchievementType;
  name: string;
  points: number | null;
}

export interface Player {
  id: string;
  name: string;
  achievements: Record<AchievementType, number | null>;
  totalScore: number;
}

export interface Game {
  id: string;
  adminId: string;
  players: Player[];
  currentRound: number;
  currentPlayerIndex: number;
  createdAt: number;
}

export interface GameState {
  games: Record<string, Game>;
}

export type MessageType = 
  | 'create-game'
  | 'join-game'
  | 'add-score'
  | 'game-update'
  | 'error';

export interface WebSocketMessage {
  type: MessageType;
  payload?: any;
}

export interface CreateGamePayload {
  playerNames: string[];
}

export interface JoinGamePayload {
  gameId: string;
}

export interface AddScorePayload {
  gameId: string;
  playerId: string;
  achievementType: AchievementType;
  score: number;
}
