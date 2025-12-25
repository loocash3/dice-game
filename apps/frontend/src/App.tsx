import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { useWebSocket } from './hooks/useWebSocket';
import { GameSetup } from './components/GameSetup';
import { GameView } from './components/GameView';

function App() {
  const { game, connected, error, createGame, joinGame, addScore } = useWebSocket();

  return (
    <MantineProvider defaultColorScheme="light">
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        {!game ? (
          <GameSetup onCreateGame={createGame} onJoinGame={joinGame} />
        ) : (
          <GameView game={game} onAddScore={addScore} error={error} />
        )}

        {!connected && !game && (
          <div style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            padding: '10px 20px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}>
            Łączenie z serwerem...
          </div>
        )}
      </div>
    </MantineProvider>
  );
}

export default App;
