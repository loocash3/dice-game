import { useState } from 'react';
import { Paper, Title, Text, Select, NumberInput, Button, Stack, Badge, Group } from '@mantine/core';
import { IconUser, IconDice } from '@tabler/icons-react';
import { Game, AchievementType, ACHIEVEMENT_NAMES } from '../types';

interface CurrentPlayerProps {
  game: Game;
  onAddScore: (playerId: string, achievementType: AchievementType, score: number) => void;
}

export function CurrentPlayer({ game, onAddScore }: CurrentPlayerProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementType | ''>('');
  const [score, setScore] = useState<number>(0);

  const currentPlayer = game.players[game.currentPlayerIndex];
  
  if (!currentPlayer) {
    return (
      <Paper shadow="md" p="xl" radius="md" bg="gray.1">
        <Text>Brak graczy w grze</Text>
      </Paper>
    );
  }

  // Get available achievements for current player
  const availableAchievements = Object.keys(currentPlayer.achievements).filter(
    key => currentPlayer.achievements[key as AchievementType] === null
  ) as AchievementType[];

  const handleSubmit = () => {
    if (selectedAchievement && score >= 0) {
      onAddScore(currentPlayer.id, selectedAchievement, score);
      setScore(0);
      setSelectedAchievement('');
    }
  };

  const allCompleted = availableAchievements.length === 0;

  return (
    <Paper 
      shadow="lg" 
      p="xl" 
      radius="md" 
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}
    >
      <Stack>
        <Group justify="space-between" align="center">
          <Group>
            <IconUser size={32} />
            <div>
              <Text size="sm" opacity={0.9}>Teraz gra</Text>
              <Title order={2} style={{ color: 'white' }}>
                {currentPlayer.name}
              </Title>
            </div>
          </Group>
          <Badge size="xl" color="yellow" variant="filled">
            <Group gap="xs">
              <IconDice size={16} />
              Twoja kolej!
            </Group>
          </Badge>
        </Group>

        {allCompleted ? (
          <Paper p="md" radius="md" bg="rgba(255,255,255,0.2)">
            <Text size="lg" ta="center" fw={600}>
              🎉 {currentPlayer.name} ukończył wszystkie osiągnięcia!
            </Text>
            <Text size="sm" ta="center" mt="xs">
              Punkty: {currentPlayer.totalScore}
            </Text>
          </Paper>
        ) : (
          <Paper p="lg" radius="md" bg="white" style={{ color: '#333' }}>
            <Stack gap="md">
              <Text fw={600} size="lg">Wprowadź wynik:</Text>
              
              <Select
                label="Wybierz osiągnięcie"
                placeholder="Wybierz osiągnięcie do zapisania"
                value={selectedAchievement}
                onChange={(value) => setSelectedAchievement(value as AchievementType || '')}
                data={availableAchievements.map(achievement => ({
                  value: achievement,
                  label: ACHIEVEMENT_NAMES[achievement]
                }))}
                size="lg"
                required
              />

              {selectedAchievement && (
                <>
                  <NumberInput
                    label="Liczba punktów"
                    placeholder="Wprowadź liczbę punktów"
                    value={score}
                    onChange={(value) => setScore(typeof value === 'number' ? value : 0)}
                    min={0}
                    size="lg"
                    required
                  />

                  <Button
                    onClick={handleSubmit}
                    size="xl"
                    fullWidth
                    color="violet"
                  >
                    Zapisz wynik
                  </Button>
                </>
              )}

              <Text size="sm" c="dimmed" ta="center">
                Pozostało osiągnięć: {availableAchievements.length}
              </Text>
            </Stack>
          </Paper>
        )}

        <Text size="sm" ta="center" opacity={0.8}>
          Kolejka graczy: {game.players.map((p, i) => 
            i === game.currentPlayerIndex ? `→ ${p.name} ←` : p.name
          ).join(' • ')}
        </Text>
      </Stack>
    </Paper>
  );
}
