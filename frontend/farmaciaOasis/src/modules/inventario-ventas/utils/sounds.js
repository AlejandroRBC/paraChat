// Versión con archivo de audio MP3
export const saleSound = {
    play: () => {
      try {
        // Crear elemento de audio
        const audio = new Audio();
        
        // Usar un sonido base64 como fallback si no hay archivo MP3
        const fallbackSound = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
        
        // Si tienes un archivo MP3 en la carpeta public
        audio.src = '/sounds/sale-success.mp3'; // Archivo en public/sounds/
        audio.volume = 0.3; // Volumen al 30%
        
        audio.play().catch(error => {
          console.log('Error reproduciendo sonido MP3, usando fallback:', error);
          // Fallback a sonido base64
          playFallbackSound();
        });
        
      } catch (error) {
        console.log('Error con el sistema de audio:', error);
        playFallbackSound();
      }
    }
  };
  
  // Sonido de fallback (beep simple)
  const playFallbackSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.log('No se pudo reproducir ningún sonido');
    }
  };