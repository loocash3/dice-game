import { useState } from 'react';
import { Select, NumberInput, Button, Stack, Title, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { Game, AchievementType, ACHIEVEMENT_NAMES, ACHIEVEMENT_ORDER } from '../types';

interface AddScoreProps {
  game: Game;
  onAddScore: (playerId: string, achievementType: AchievementType, score: number) => void;
}

export function AddScore({ game, onAddScore }: AddScoreProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementType | ''>('');
  const [score, setScore] = useState<number>(0);
  const [localError, setLocalError] = useState<string | null>(null);

  const selectedPlayer = game.players.find(p => p.id === selectedPlayerId);

  // Get available achievements for selected player
  const availableAchievements = selectedPlayer
    ? ACHIEVEMENT_ORDER.filter(
        achievement => selectedPlayer.achievements[achievement] === null
      )
    : [];

  const handleSubmit = () => {
    setLocalError(null);

    if (!selectedPlayerId) {
      setLocalError('Wybierz gracza');
      return;
    }

    if (!selectedAchievement) {
      setLocalError('Wybierz osiągnięcie');
      return;
    }

    if (score < 0) {
      setLocalError('Wynik nie może być ujemny');
      return;
    }

    onAddScore(selectedPlayerId, selectedAchievement, score);
    
    // Reset form
    setScore(0);
    setSelectedAchievement('');
    setLocalError(null);
  };

  return (
    <Stack>
      <Title order={3}>Dodaj wynik</Title>

      {localError && (
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          {localError}
        </Alert>
      )}

      <Select
        label="Wybierz gracza"
        placeholder="Wybierz gracza"
        value={selectedPlayerId}
        onChange={(value) => {
          setSelectedPlayerId(value || '');
          setSelectedAchievement('');
        }}
        data={game.players.map(p => ({ value: p.id, label: p.name }))}
        required
      />

      {selectedPlayerId && (
        <>
          <Select
            label="Wybierz osiągnięcie"
            placeholder="Wybierz osiągnięcie"
            value={selectedAchievement}
            onChange={(value) => setSelectedAchievement(value as AchievementType || '')}
            data={availableAchievements.map(achievement => ({
              value: achievement,
              label: ACHIEVEMENT_NAMES[achievement]
            }))}
            required
            disabled={availableAchievements.length === 0}
          />

          {availableAchievements.length === 0 && (
            <Alert color="blue">
              Ten gracz zdobył już wszystkie osiągnięcia!
            </Alert>
          )}

          {selectedAchievement && (
            <>
              <NumberInput
                label="Wynik"
                placeholder="Wprowadź wynik"
                value={score}
                onChange={(value) => setScore(typeof value === 'number' ? value : 0)}
                min={0}
                required
              />

              <Button
                onClick={handleSubmit}
                size="lg"
                fullWidth
              >
                Zapisz wynik
              </Button>
            </>
          )}
        </>
      )}
    </Stack>
  );
}
