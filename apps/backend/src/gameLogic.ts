import { Player, AchievementType } from './types';

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

export function createEmptyPlayer(id: string, name: string): Player {
  return {
    id,
    name,
    achievements: {
      'ones': null,
      'twos': null,
      'threes': null,
      'fours': null,
      'fives': null,
      'sixes': null,
      'pair': null,
      'two-pairs': null,
      'three-of-kind': null,
      'four-of-kind': null,
      'small-straight': null,
      'large-straight': null,
      'poker': null,
      'full-house': null,
      'chance': null
    },
    totalScore: 0
  };
}

export function calculateTotalScore(player: Player): number {
  let total = 0;
  
  // Sum all achievement scores
  Object.values(player.achievements).forEach(score => {
    if (score !== null) {
      total += score;
    }
  });
  
  // Check for number collection bonus (50 points if sum of ones through sixes >= 63)
  const numberAchievements: AchievementType[] = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
  const allNumbersComplete = numberAchievements.every(
    achievement => player.achievements[achievement] !== null
  );
  
  if (allNumbersComplete) {
    const numberSum = numberAchievements.reduce((sum, achievement) => {
      return sum + (player.achievements[achievement] || 0);
    }, 0);
    
    if (numberSum >= 63) {
      total += 50;
    }
  }
  
  // Check for poker bonus (50 points)
  if (player.achievements.poker !== null) {
    total += 50;
  }
  
  return total;
}

export function updatePlayerScore(
  player: Player,
  achievementType: AchievementType,
  score: number
): Player {
  // Check if achievement is already claimed
  if (player.achievements[achievementType] !== null) {
    throw new Error('Osiągnięcie zostało już zdobyte');
  }
  
  // Update achievement
  const updatedPlayer = {
    ...player,
    achievements: {
      ...player.achievements,
      [achievementType]: score
    }
  };
  
  // Recalculate total score
  updatedPlayer.totalScore = calculateTotalScore(updatedPlayer);
  
  return updatedPlayer;
}

export function getAvailableAchievements(player: Player): AchievementType[] {
  return Object.keys(player.achievements).filter(
    key => player.achievements[key as AchievementType] === null
  ) as AchievementType[];
}

export function getRanking(players: Player[]): Player[] {
  return [...players].sort((a, b) => b.totalScore - a.totalScore);
}
