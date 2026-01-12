let musicPlaying = false;
let currentSongIndex = 0;
let playlist = [];
let currentAudio = null;

// Cargar playlist al iniciar
document.addEventListener('DOMContentLoaded', function() {
    loadPlaylist();
});

function loadPlaylist() {
    // Lista de canciones que probablemente están en la carpeta musica/
    // Agrega aquí todos los nombres de archivos que tengas
    
    playlist = [
        // Tus canciones agregadas (excluyendo yupi.mp3 que es solo para el inicio):
        'musica/505 [qU9mHegkTc4].mp3',
        'musica/As It Was [nujn6wbr-e8].mp3',
        'musica/c.mp3',
        'musica/Cafuné - Tek It (I Watch The Moon) [Official Video] [7RWbq-lbBlk].mp3',
        'musica/cha.mp3',
        'musica/flores.mp3',
        'musica/jeje.mp3',
        'musica/MAGIC_ - Rude (Official Video) [PIh2xe4jnpk].mp3',
        'musica/nana.mp3',
        'musica/Química Mayor [e23BTGIJcq8].mp3',
        'musica/Samba Paixão - Murart ft.mp3',
        'musica/Tyler, The Creator & Kali Uchis - See You Again (Sub. Español + Lyrics) [-7a49quIQQc].mp3'
    ];
    
    // Filtrar solo las canciones que existen (opcional)
    // playlist = playlist.filter(song => song.includes('.mp3'));
    
    console.log('Playlist cargada:', playlist);
    console.log('Total de canciones:', playlist.length);
}

function startExperience() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const messageScreen = document.getElementById('messageScreen');
    
    // Reproducir audio yupi.mp3
    playYupiAudio();
    
    welcomeScreen.style.opacity = '0';
    welcomeScreen.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        messageScreen.classList.add('active');
        createCelebrationConfetti();
        showNotification('🎉 ¡Bienvenido a tu mensaje especial! 🎂', 3000);
    }, 600);
}

function playYupiAudio() {
    console.log('Intentando reproducir yupi.mp3 desde la raíz...');
    const audio = new Audio('./yupi.mp3');
    audio.play().then(() => {
        console.log('✅ Audio yupi.mp3 reproduciéndose');
    }).catch(error => {
        console.log('❌ Error al reproducir yupi.mp3:', error);
        showNotification('📁 No se encontró yupi.mp3', 2000);
    });
}

function toggleMusic() {
    console.log('=== INICIANDO MÚSICA ===');
    console.log('Playlist:', playlist);
    console.log('Índice actual:', currentSongIndex);
    console.log('Reproduciendo:', musicPlaying);
    
    if (playlist.length === 0) {
        console.log('ERROR: Playlist vacía');
        showNotification('📁 No hay canciones en la playlist', 2000);
        return;
    }
    
    if (!musicPlaying) {
        console.log('INTENTANDO REPRODUCIR:', playlist[currentSongIndex]);
        playCurrentSong();
        showPlaylistInfo();
    } else {
        console.log('PAUSANDO MÚSICA');
        pauseMusic();
    }
}

function showPlaylistInfo() {
    const songNames = playlist.map(song => song.split('/').pop());
    const message = `🎵 Playlist (${playlist.length} canciones):\n${songNames.map((name, index) => `${index + 1}. ${name}`).join('\n')}`;
    console.log(message);
    showNotification(`🎵 Playlist: ${playlist.length} canciones disponibles`, 3000);
}

function playCurrentSong() {
    console.log('=== REPRODUCIENDO CANCIÓN ACTUAL ===');
    console.log('Índice:', currentSongIndex);
    console.log('Canción:', playlist[currentSongIndex]);
    
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    const songPath = playlist[currentSongIndex];
    console.log('Ruta completa:', songPath);
    
    currentAudio = new Audio(songPath);
    
    currentAudio.addEventListener('loadstart', () => {
        console.log('CARGANDO AUDIO...');
    });
    
    currentAudio.addEventListener('canplay', () => {
        console.log('AUDIO LISTO PARA REPRODUCIR');
    });
    
    currentAudio.addEventListener('error', (e) => {
        console.log('ERROR AL CARGAR AUDIO:', e);
        console.log('Error details:', currentAudio.error);
        showNotification(`📁 Error al cargar: ${songPath}`, 3000);
        // Intentar siguiente canción
        setTimeout(() => nextSong(), 1000);
    });
    
    currentAudio.play().then(() => {
        musicPlaying = true;
        const songName = playlist[currentSongIndex].split('/').pop();
        console.log('✅ REPRODUCIENDO:', songName);
        showNotification(`🎵 Reproduciendo: ${songName}`, 2000);
        updateMusicButton();
    }).catch(error => {
        console.log('ERROR AL REPRODUCIR:', error);
        showNotification(`📁 No se pudo reproducir: ${songPath}`, 3000);
    });
    
    // Pasar a la siguiente canción cuando termine
    currentAudio.addEventListener('ended', () => {
        console.log('CANCIÓN TERMINADA, PASANDO A SIGUIENTE');
        nextSong();
    });
}

function pauseMusic() {
    if (currentAudio) {
        currentAudio.pause();
        musicPlaying = false;
        showNotification('🔇 Música pausada', 2000);
        updateMusicButton();
    }
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    if (musicPlaying) {
        playCurrentSong();
    }
}

function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    if (musicPlaying) {
        playCurrentSong();
    }
}

function togglePlaylist() {
    const modal = document.getElementById('playlistModal');
    if (modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'flex';
        displayPlaylist();
    } else {
        modal.style.display = 'none';
    }
}

function displayPlaylist() {
    const playlistSongs = document.getElementById('playlistSongs');
    playlistSongs.innerHTML = '';
    
    playlist.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        if (index === currentSongIndex) {
            songItem.classList.add('current');
        }
        
        songItem.innerHTML = `
            <span class="song-number">${index + 1}</span>
            <span class="song-name">${song.split('/').pop()}</span>
        `;
        
        songItem.onclick = () => {
            currentSongIndex = index;
            playCurrentSong();
            updatePlaylistDisplay();
        };
        
        playlistSongs.appendChild(songItem);
    });
}

function updatePlaylistDisplay() {
    const songItems = document.querySelectorAll('.song-item');
    songItems.forEach((item, index) => {
        if (index === currentSongIndex) {
            item.classList.add('current');
        } else {
            item.classList.remove('current');
        }
    });
}

function moveSongUp() {
    if (currentSongIndex > 0) {
        currentSongIndex--;
        if (musicPlaying) {
            playCurrentSong();
        }
        updatePlaylistDisplay();
    }
}

function moveSongDown() {
    if (currentSongIndex < playlist.length - 1) {
        currentSongIndex++;
        if (musicPlaying) {
            playCurrentSong();
        }
        updatePlaylistDisplay();
    }
}

function shufflePlaylist() {
    for (let i = playlist.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
    }
    currentSongIndex = 0;
    if (musicPlaying) {
        playCurrentSong();
    }
    updatePlaylistDisplay();
    showNotification('🔀 Playlist mezclada', 2000);
}

function backToWelcome() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const messageScreen = document.getElementById('messageScreen');
    
    messageScreen.classList.remove('active');
    
    setTimeout(() => {
        welcomeScreen.style.display = 'flex';
        welcomeScreen.style.opacity = '1';
        welcomeScreen.style.transform = 'scale(1)';
        
        if (musicPlaying) {
            toggleMusic();
        }
    }, 600);
}

function toggleMusic() {
    console.log('=== INICIANDO MÚSICA ===');
    console.log('Playlist:', playlist);
    console.log('Índice actual:', currentSongIndex);
    console.log('Reproduciendo:', musicPlaying);
    
    if (playlist.length === 0) {
        console.log('ERROR: Playlist vacía');
        showNotification('📁 No hay canciones en la playlist', 2000);
        return;
    }
    
    if (!musicPlaying) {
        console.log('INTENTANDO REPRODUCIR:', playlist[currentSongIndex]);
        playCurrentSong();
        showPlaylistInfo();
    } else {
        console.log('PAUSANDO MÚSICA');
        pauseMusic();
    }
}

function playModernMelody() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const melody = [
        523, 523, 587, 523, 659, 587,
        523, 523, 587, 523, 698, 659,
        523, 523, 784, 698, 659, 587, 587,
        698, 698, 698, 659, 587, 523
    ];
    
    melody.forEach((frequency, index) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'triangle';
            
            gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.4);
        }, index * 200);
    });
    
    musicPlaying = true;
    showNotification('🎵 Melodía moderna activada');
}

function celebrate() {
    createCelebrationConfetti();
    createFloatingHearts();
    showModernMessage();
    
    if (!musicPlaying) {
        toggleMusic();
    }
}

function createCelebrationConfetti() {
    const confettiOverlay = document.getElementById('confettiOverlay');
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#667eea', '#764ba2', '#00b894', '#fdcb6e'];
    
    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            const confettiPiece = document.createElement('div');
            confettiPiece.className = 'confetti-piece';
            confettiPiece.style.left = Math.random() * 100 + '%';
            confettiPiece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confettiPiece.style.animationDuration = (Math.random() * 4 + 2) + 's';
            confettiPiece.style.animationDelay = Math.random() * 0.5 + 's';
            confettiPiece.style.width = (Math.random() * 12 + 6) + 'px';
            confettiPiece.style.height = confettiPiece.style.width;
            
            if (Math.random() > 0.5) {
                confettiPiece.style.borderRadius = '50%';
            }
            
            confettiOverlay.appendChild(confettiPiece);
            
            setTimeout(() => {
                confettiPiece.remove();
            }, 6000);
        }, i * 20);
    }
}

function createFloatingHearts() {
    const confettiOverlay = document.getElementById('confettiOverlay');
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = '❤️';
            heart.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 20 + 15}px;
                left: ${Math.random() * 100}%;
                top: 100%;
                animation: floatUp 4s ease-out forwards;
                pointer-events: none;
                z-index: 10000;
            `;
            confettiOverlay.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 4000);
        }, i * 200);
    }
}

function showModernMessage() {
    const messages = [
        '🌟 ¡Eres una persona increíble! 🌟',
        '✨ Tu luz brilla más que el sol ✨',
        '🎆 Celebramos la maravillosa persona que eres 🎆',
        '💫 Gracias por existir en este mundo 💫',
        '🎊 Hoy eres la estrella principal 🎊'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showNotification(randomMessage, 4000);
}

function showNotification(message, duration = 2000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.6s ease-out;
        font-weight: 600;
        font-family: 'Montserrat', sans-serif;
        font-size: 1rem;
        max-width: 300px;
        text-align: center;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.6s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 600);
    }, duration);
}

// Agregar animación flotante para corazones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
    
    @keyframes floatUp {
        0% { 
            opacity: 1; 
            transform: translateY(0) rotate(0deg); 
        }
        100% { 
            opacity: 0; 
            transform: translateY(-100vh) rotate(360deg); 
        }
    }
`;
document.head.appendChild(style);
