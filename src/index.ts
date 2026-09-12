// Sound Bits / Sound Library — High Performance Procedural Micro-UX Audio
// Zero external runtime dependencies. Synthesized natively via Web Audio API.

export {
  SOUND_NAMES,
  type SoundName,
  playSound,
  useSound,
  setSoundEnabled,
  isSoundEnabled,
  getAudioContext,
  getAudioAnalyser,
  masterGain,
} from '../lib/sounds';

export { synthesize, getMasterOutput } from '../lib/synthesis';
export { SOUNDS_METADATA, type SoundMeta } from '../lib/sounds-metadata';

// Individual sound trigger convenience exports
import { playSound, type SoundName } from '../lib/sounds';

export const playTap = () => playSound('tap');
export const playThud = () => playSound('thud');
export const playSnap = () => playSound('snap');
export const playPop = () => playSound('pop');
export const playBlip = () => playSound('blip');
export const playHoverSoft = () => playSound('hover-soft');
export const playChime = () => playSound('chime');
export const playBell = () => playSound('bell');
export const playPing = () => playSound('ping');
export const playTick = () => playSound('tick');
export const playToggleOn = () => playSound('toggle-on');
export const playToggleOff = () => playSound('toggle-off');
export const playLock = () => playSound('lock');
export const playUnlock = () => playSound('unlock');
export const playSwish = () => playSound('swish');
export const playWhoosh = () => playSound('whoosh');
export const playShutter = () => playSound('shutter');
export const playKeystroke = () => playSound('keystroke');
export const playPulse = () => playSound('pulse');
export const playError = () => playSound('error');
export const playGlissando = () => playSound('glissando');
export const playShimmer = () => playSound('shimmer');
export const playBloop = () => playSound('bloop');
export const playSubKick = () => playSound('sub-kick');
export const playCrystal = () => playSound('crystal');
export const playWooshDeep = () => playSound('woosh-deep');
export const playZap = () => playSound('zap');
export const playSpring = () => playSound('spring');
export const playBubble = () => playSound('bubble');
export const playHapticPop = () => playSound('haptic-pop');
export const playCoin = () => playSound('coin');
export const playPowerUp = () => playSound('power-up');
export const playPowerDown = () => playSound('power-down');
export const playMagicSparkle = () => playSound('magic-sparkle');
export const playJumpBoing = () => playSound('jump-boing');
export const playArcadePew = () => playSound('arcade-pew');
export const playHeartbeat = () => playSound('heartbeat');
export const playSonarPing = () => playSound('sonar-ping');
export const playTypewriterKey = () => playSound('typewriter-key');
export const playTypewriterBell = () => playSound('typewriter-bell');
export const playSynthSweep = () => playSound('synth-sweep');
export const playGlitch = () => playSound('glitch');
export const playDeepImpact = () => playSound('deep-impact');
export const playHollowThock = () => playSound('hollow-thock');
export const playSuccessFanfare = () => playSound('success-fanfare');
export const playWarning = () => playSound('warning');
export const playSuccess = () => playSound('success');
export const playDelete = () => playSound('delete');
export const playSend = () => playSound('send');
export const playSelect = () => playSound('select');
export const playDrop = () => playSound('drop');
export const playSwipe = () => playSound('swipe');
export const playNotification = () => playSound('notification');

// Default export
export default {
  playSound,
  playTap,
  playThud,
  playSnap,
  playPop,
  playBlip,
  playChime,
  playBell,
  playPing,
  playTick,
  playToggleOn,
  playToggleOff,
  playLock,
  playUnlock,
  playSwish,
  playWhoosh,
  playShutter,
  playKeystroke,
  playPulse,
  playError,
  playGlissando,
  playShimmer,
  playBloop,
  playSubKick,
  playCrystal,
  playWooshDeep,
  playZap,
  playSpring,
  playBubble,
  playHapticPop,
  playCoin,
  playPowerUp,
  playPowerDown,
  playMagicSparkle,
  playJumpBoing,
  playArcadePew,
  playHeartbeat,
  playSonarPing,
  playTypewriterKey,
  playTypewriterBell,
  playSynthSweep,
  playGlitch,
  playDeepImpact,
  playHollowThock,
  playSuccessFanfare,
  playWarning,
};
