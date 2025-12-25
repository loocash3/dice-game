import { useState } from 'react';
import { Container, TextInput, Button, Stack, Title, Paper, Group } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';

interface GameSetupProps {
  onCreateGame: (playerNames: string[]) => void;
  onJoinGame: (gameId: string) => void;
}

export function GameSetup({ onCreateGame, onJoinGame }: GameSetupProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(['', '']);
  const [gameId, setGameId] = useState('');
  const [mode, setMode] = useState<'create' | 'join'>('create');

  const handleAddPlayer = () => {
    setPlayerNames([...playerNames, '']);
  };

  const handleRemovePlayer = (index: number) => {
    setPlayerNames(playerNames.filter((_, i) => i !== index));
  };

  const handlePlayerNameChange = (index: number, value: string) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const handleCreateGame = () => {
    const validPlayers = playerNames.filter(name => name.trim() !== '');
    if (validPlayers.length > 0) {
      onCreateGame(validPlayers);
    }
  };

  const handleJoinGame = () => {
    if (gameId.trim()) {
      // Normalize game ID: uppercase and remove spaces
      const normalizedId = gameId.trim().toUpperCase().replace(/\s/g, '');
      onJoinGame(normalizedId);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Title order={1} ta="center" mb="xl">
        Gra w Kości
      </Title>

      <Paper shadow="md" p="xl" radius="md">
        <Group mb="lg" justify="center">
          <Button
            variant={mode === 'create' ? 'filled' : 'light'}
            onClick={() => setMode('create')}
          >
            Stwórz grę
          </Button>
          <Button
            variant={mode === 'join' ? 'filled' : 'light'}
            onClick={() => setMode('join')}
          >
            Dołącz do gry
          </Button>
        </Group>

        {mode === 'create' ? (
          <Stack>
            <Title order={3}>Nowa gra</Title>
            <Title order={4}>Gracze</Title>

            {playerNames.map((name, index) => (
              <Group key={index}>
                <TextInput
                  placeholder={`Gracz ${index + 1}`}
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.currentTarget.value)}
                  style={{ flex: 1 }}
                />
                <Button
                  color="red"
                  variant="light"
                  onClick={() => handleRemovePlayer(index)}
                  disabled={playerNames.length === 1}
                >
                  <IconTrash size={16} />
                </Button>
              </Group>
            ))}

            <Button
              leftSection={<IconPlus size={16} />}
              variant="light"
              onClick={handleAddPlayer}
            >
              Dodaj gracza
            </Button>

            <Button
              fullWidth
              mt="md"
              size="lg"
              onClick={handleCreateGame}
              disabled={playerNames.every(name => !name.trim())}
            >
              Rozpocznij grę
            </Button>
          </Stack>
        ) : (
          <Stack>
            <Title order={3}>Dołącz do gry</Title>
            <TextInput
              label="ID gry"
              placeholder="Wklej ID gry"
              value={gameId}
              onChange={(e) => setGameId(e.currentTarget.value)}
              required
            />
            <Button
              fullWidth
              mt="md"
              size="lg"
              onClick={handleJoinGame}
              disabled={!gameId.trim()}
            >
              Dołącz
            </Button>
          </Stack>
        )}
      </Paper>
    </Container>
  );
}
