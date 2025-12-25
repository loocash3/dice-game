import { Table, Badge, Title } from '@mantine/core';
import { Player } from '../types';

interface RankingProps {
  players: Player[];
}

export function Ranking({ players }: RankingProps) {
  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div>
      <Title order={3} mb="md">Ranking graczy</Title>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Miejsce</Table.Th>
            <Table.Th>Gracz</Table.Th>
            <Table.Th>Punkty</Table.Th>
            <Table.Th>Zdobyte osiągnięcia</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedPlayers.map((player, index) => {
            const achievementCount = Object.values(player.achievements).filter(
              score => score !== null
            ).length;
            const totalAchievements = Object.keys(player.achievements).length;

            return (
              <Table.Tr key={player.id}>
                <Table.Td>
                  {index === 0 ? (
                    <Badge color="yellow" size="lg">🥇 {index + 1}</Badge>
                  ) : index === 1 ? (
                    <Badge color="gray" size="lg">🥈 {index + 1}</Badge>
                  ) : index === 2 ? (
                    <Badge color="orange" size="lg">🥉 {index + 1}</Badge>
                  ) : (
                    <Badge color="blue">{index + 1}</Badge>
                  )}
                </Table.Td>
                <Table.Td style={{ fontWeight: 'bold' }}>{player.name}</Table.Td>
                <Table.Td style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                  {player.totalScore}
                </Table.Td>
                <Table.Td>
                  {achievementCount} / {totalAchievements}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </div>
  );
}
