import { useEffect, useRef } from 'react';

export function useBackgroundMusic(volume: number = 0.3) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio('/sounds/background-music.wav');
    audio.loop = true;
    audio.volume = volume;
    
    // Store reference
    audioRef.current = audio;

    // Play music when component mounts
    const playPromise = audio.play();
    
    // Handle autoplay policies
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Autoplay was prevented. Please interact with the page first.');
      });
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [volume]);

  // Function to manually control the music
  const toggleMusic = (play: boolean) => {
    if (!audioRef.current) return;
    
    if (play) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Play was prevented.');
        });
      }
    } else {
      audioRef.current.pause();
    }
  };

  return { toggleMusic };
}
