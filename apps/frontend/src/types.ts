export type AchievementType = 
  | 'ones' | 'twos' | 'threes' | 'fours' | 'fives' | 'sixes'
  | 'pair' | 'two-pairs' | 'three-of-kind' | 'four-of-kind'
  | 'small-straight' | 'large-straight' | 'poker' | 'full-house' | 'chance';

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

export const ACHIEVEMENT_NAMES: Record<AchievementType, string> = {
  'ones': 'Jedynki',
  'twos': 'Dwójki',
  'threes': 'Trójki',
  'fours': 'Czwórki',
  'fives': 'Piątki',
  'sixes': 'Szóstki',
  'pair': 'Para',
  'two-pairs': 'Dwie pary',
  'three-of-kind': 'Trójka',
  'four-of-kind': 'Kareta',
  'small-straight': 'Mały street',
  'large-straight': 'Duży street',
  'poker': 'Poker',
  'full-house': 'Full',
  'chance': 'Szansa'
};

export const ACHIEVEMENT_ORDER: AchievementType[] = [
  'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
  'pair', 'two-pairs', 'three-of-kind', 'four-of-kind',
  'small-straight', 'large-straight', 'poker', 'full-house', 'chance'
];
