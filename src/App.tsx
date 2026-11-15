import { useState } from 'react';
import MainMenu from './components/MainMenu';
import Game from './components/Game';

type AppState = 'menu' | 'playing';

export default function App() {
  const [appState, setAppState] = useState<AppState>('menu');
  const [playerName, setPlayerName] = useState<string>('');

  const handleNewGame = (name: string) => {
    setPlayerName(name);
    setAppState('playing');
  };

  const handleReturnToMenu = () => {
    setAppState('menu');
  };

  return (
    <>
      {appState === 'menu' && <MainMenu onNewGame={handleNewGame} defaultName={playerName} />}
      {appState === 'playing' && <Game onReturnToMenu={handleReturnToMenu} playerName={playerName} />}
    </>
  );
}
