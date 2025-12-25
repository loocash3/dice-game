import { useState } from 'react';
import { Container, Title, Paper, Tabs, Alert, Group, CopyButton, Button, Text } from '@mantine/core';
import { IconAlertCircle, IconCopy, IconCheck } from '@tabler/icons-react';
import { Game } from '../types';
import { CurrentPlayer } from './CurrentPlayer';
import { PlayerAchievements } from './PlayerAchievements';
import { Ranking } from './Ranking';
import { AddScore } from './AddScore';

interface GameViewProps {
  game: Game;
  onAddScore: (playerId: string, achievementType: any, score: number) => void;
  error: string | null;
}

export function GameView({ game, onAddScore, error }: GameViewProps) {
  const [activeTab, setActiveTab] = useState<string | null>('current-player');

  return (
    <Container size="xl" py="xl">
      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
          {error}
        </Alert>
      )}

      <CurrentPlayer game={game} onAddScore={onAddScore} />

      <Paper shadow="md" p="xl" radius="md" mt="lg">
        <Group justify="space-between" mb="md">
          <Title order={2}>Gra w Kości</Title>
          <Group>
            <Text size="sm" c="dimmed">ID gry: {game.id}</Text>
            <CopyButton value={game.id}>
              {({ copied, copy }) => (
                <Button
                  size="xs"
                  color={copied ? 'teal' : 'blue'}
                  onClick={copy}
                  leftSection={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                >
                  {copied ? 'Skopiowano' : 'Kopiuj'}
                </Button>
              )}
            </CopyButton>
          </Group>
        </Group>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="current-player">Teraz gra</Tabs.Tab>
            <Tabs.Tab value="ranking">Ranking</Tabs.Tab>
            <Tabs.Tab value="add-score">Dodaj wynik (admin)</Tabs.Tab>
            <Tabs.Tab value="achievements">Osiągnięcia</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="current-player" pt="md">
            <Text c="dimmed" ta="center">
              Widok aktualnie grającego znajduje się powyżej ↑
            </Text>
          </Tabs.Panel>

          <Tabs.Panel value="ranking" pt="md">
            <Ranking players={game.players} />
          </Tabs.Panel>

          <Tabs.Panel value="add-score" pt="md">
            <AddScore
              game={game}
              onAddScore={onAddScore}
            />
          </Tabs.Panel>

          <Tabs.Panel value="achievements" pt="md">
            <PlayerAchievements players={game.players} />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
}
