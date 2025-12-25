import { Select, Table, Badge, Title, Stack, Text, SegmentedControl } from '@mantine/core';
import { useState } from 'react';
import { Player, ACHIEVEMENT_NAMES, ACHIEVEMENT_ORDER } from '../types';

interface PlayerAchievementsProps {
  players: Player[];
}

export function PlayerAchievements({ players }: PlayerAchievementsProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(
    players.length > 0 ? players[0].id : ''
  );
  const [filter, setFilter] = useState<'all' | 'completed' | 'available'>('all');

  const selectedPlayer = players.find(p => p.id === selectedPlayerId);

  if (!selectedPlayer) {
    return <Text>Nie znaleziono gracza</Text>;
  }

  // Calculate bonuses
  const numberAchievements = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
  const allNumbersComplete = numberAchievements.every(
    achievement => selectedPlayer.achievements[achievement as keyof typeof selectedPlayer.achievements] !== null
  );
  const hasPokerBonus = selectedPlayer.achievements.poker !== null;

  // Filter achievements based on selected filter
  const filteredAchievements = ACHIEVEMENT_ORDER.filter(achievementType => {
    const isCompleted = selectedPlayer.achievements[achievementType] !== null;
    if (filter === 'completed') return isCompleted;
    if (filter === 'available') return !isCompleted;
    return true; // 'all'
  });

  // Calculate number sum for bonus display
  const numberSum = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].reduce((sum, achievement) => {
    return sum + (selectedPlayer.achievements[achievement as keyof typeof selectedPlayer.achievements] || 0);
  }, 0);

  return (
    <Stack>
      <Title order={3}>Osiągnięcia gracza</Title>
      <Select
        label="Wybierz gracza"
        value={selectedPlayerId}
        onChange={(value) => setSelectedPlayerId(value || '')}
        data={players.map(p => ({ value: p.id, label: p.name }))}
      />

      <SegmentedControl
        value={filter}
        onChange={(value) => setFilter(value as 'all' | 'completed' | 'available')}
        data={[
          { label: 'Wszystkie', value: 'all' },
          { label: 'Zdobyte', value: 'completed' },
          { label: 'Do zdobycia', value: 'available' }
        ]}
      />

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Osiągnięcie</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Punkty</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredAchievements.map(achievementType => {
            const score = selectedPlayer.achievements[achievementType];
            const isCompleted = score !== null;

            return (
              <Table.Tr key={achievementType}>
                <Table.Td>{ACHIEVEMENT_NAMES[achievementType]}</Table.Td>
                <Table.Td>
                  {isCompleted ? (
                    <Badge color="green">Zdobyte ✓</Badge>
                  ) : (
                    <Badge color="gray">Do zdobycia</Badge>
                  )}
                </Table.Td>
                <Table.Td style={{ fontWeight: 'bold' }}>
                  {isCompleted ? score : '-'}
                </Table.Td>
              </Table.Tr>
            );
          })}

          {/* Bonuses */}
          <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
            <Table.Td colSpan={3} style={{ fontWeight: 'bold' }}>
              Premie
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>
              Premia za szkółkę ({numberSum}/63)
              {allNumbersComplete && numberSum >= 63 && ' ✓'}
            </Table.Td>
            <Table.Td>
              {allNumbersComplete && numberSum >= 63 ? (
                <Badge color="green">Zdobyte ✓</Badge>
              ) : allNumbersComplete && numberSum < 63 ? (
                <Badge color="orange">Komplet, ale &lt;63 pkt</Badge>
              ) : (
                <Badge color="gray">Do zdobycia</Badge>
              )}
            </Table.Td>
            <Table.Td style={{ fontWeight: 'bold' }}>
              {allNumbersComplete && numberSum >= 63 ? '+50' : '-'}
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Premia za pokera</Table.Td>
            <Table.Td>
              {hasPokerBonus ? (
                <Badge color="green">Zdobyte ✓</Badge>
              ) : (
                <Badge color="gray">Do zdobycia</Badge>
              )}
            </Table.Td>
            <Table.Td style={{ fontWeight: 'bold' }}>
              {hasPokerBonus ? '+50' : '-'}
            </Table.Td>
          </Table.Tr>

          {/* Total */}
          <Table.Tr style={{ backgroundColor: '#228be6', color: 'white' }}>
            <Table.Td style={{ fontWeight: 'bold', color: 'white' }}>
              Suma punktów
            </Table.Td>
            <Table.Td></Table.Td>
            <Table.Td style={{ fontWeight: 'bold', fontSize: '1.3em', color: 'white' }}>
              {selectedPlayer.totalScore}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
