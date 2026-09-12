import type { SoundName } from './sound-names';

export interface SoundMeta {
  name: SoundName;
  title: string;
  category: 'Interaction' | 'Feedback' | 'Navigation' | 'Notification' | 'System' | 'Essentials';
  description: string;
  synthesisType: string;
  duration: string;
  frequencies: string;
}

export const SOUNDS_METADATA: Record<SoundName, SoundMeta> = {
  tap: { name: 'tap', title: 'Capacitive Tap', category: 'Interaction', description: 'Ultra-clean micro capacitive tap for buttons and list selections.', synthesisType: 'Sine wave exponential pitch ramp (1800Hz to 700Hz)', duration: '35ms', frequencies: '1800Hz → 700Hz' },
  thud: { name: 'thud', title: 'Tactile Thud', category: 'Interaction', description: 'Deep dampened low-frequency thock for solid primary actions.', synthesisType: 'Filtered sine oscillator with lowpass cutoff', duration: '50ms', frequencies: '95Hz → 36Hz (280Hz Lowpass)' },
  snap: { name: 'snap', title: 'Haptic Snap', category: 'Interaction', description: 'Tight square-wave burst mimicking physical toggle engagement.', synthesisType: 'Square wave with hard envelope cutoff', duration: '25ms', frequencies: '240Hz' },
  pop: { name: 'pop', title: 'Bubbly Pop', category: 'Interaction', description: 'Hollow resonant pitch-drop for pill selections and toast pop-ins.', synthesisType: 'Sine with resonant frequency drop', duration: '70ms', frequencies: '880Hz → 140Hz' },
  blip: { name: 'blip', title: 'Hover Blip', category: 'Feedback', description: 'Quick ascending chirp for hover and focus transitions.', synthesisType: 'Sine ascending chirp', duration: '45ms', frequencies: '1150Hz → 2300Hz' },
  'hover-soft': { name: 'hover-soft', title: 'Soft Pulse', category: 'Feedback', description: 'Gentle low-energy sine pulse for hover states.', synthesisType: 'Single sine wave pulse', duration: '50ms', frequencies: '820Hz' },
  chime: { name: 'chime', title: 'Ascending Chime', category: 'Notification', description: 'Dual-tone ascending interval for task completion.', synthesisType: 'Stacked sine oscillators', duration: '280ms', frequencies: '660Hz → 990Hz' },
  bell: { name: 'bell', title: 'Triad Bell', category: 'Notification', description: 'Three-note major arpeggio for achievements and celebrations.', synthesisType: 'Triad sine arpeggio', duration: '300ms', frequencies: '880Hz + 1100Hz + 1320Hz' },
  ping: { name: 'ping', title: 'Resonant Ping', category: 'Notification', description: 'Curved frequency resonance for push notifications.', synthesisType: 'Frequency resonance sweep', duration: '140ms', frequencies: '1050Hz → 1750Hz' },
  tick: { name: 'tick', title: 'Dial Tick', category: 'Interaction', description: 'Precision micro-detent tick for rotary encoders.', synthesisType: 'Square wave fast decay', duration: '8ms', frequencies: '4800Hz → 1100Hz' },
  'toggle-on': { name: 'toggle-on', title: 'Toggle Activate', category: 'Interaction', description: 'Ascending sine glide for toggle-on states.', synthesisType: 'Sine frequency glide up', duration: '75ms', frequencies: '520Hz → 820Hz' },
  'toggle-off': { name: 'toggle-off', title: 'Toggle Deactivate', category: 'Interaction', description: 'Descending sine glide for toggle-off states.', synthesisType: 'Sine frequency glide down', duration: '75ms', frequencies: '820Hz → 520Hz' },
  lock: { name: 'lock', title: 'Mechanical Lock', category: 'System', description: 'Dual-frequency mechanical latch for security actions.', synthesisType: 'Stacked oscillators with mechanical filter', duration: '60ms', frequencies: '200Hz + 600Hz' },
  unlock: { name: 'unlock', title: 'Mechanical Unlock', category: 'System', description: 'Rising triangle sweep for authentication success.', synthesisType: 'Triangle pitch rise', duration: '50ms', frequencies: '600Hz → 1400Hz' },
  swish: { name: 'swish', title: 'Filtered Swish', category: 'Navigation', description: 'Noise sweep for drawer reveals and sheet transitions.', synthesisType: 'Filtered noise sweep', duration: '200ms', frequencies: '3200Hz → 350Hz' },
  whoosh: { name: 'whoosh', title: 'Atmospheric Whoosh', category: 'Navigation', description: 'Spatial air rush for page navigations.', synthesisType: 'Bandpass noise sweep', duration: '380ms', frequencies: '450Hz → 2400Hz → 280Hz' },
  shutter: { name: 'shutter', title: 'Camera Shutter', category: 'Interaction', description: 'Dual mechanical transient for screenshot capture.', synthesisType: 'Dual noise + sine transient', duration: '80ms', frequencies: '3800Hz + 1400Hz' },
  keystroke: { name: 'keystroke', title: 'Mechanical Key', category: 'Interaction', description: 'Cherry MX Red linear switch bottom-out clack.', synthesisType: 'Bandpass noise clack', duration: '60ms', frequencies: '4200Hz (Bandpass)' },
  pulse: { name: 'pulse', title: 'Haptic Pulse', category: 'System', description: 'Sub-bass tactile pulse for haptic feedback.', synthesisType: 'Sub-bass sine with fast decay', duration: '95ms', frequencies: '65Hz' },
  error: { name: 'error', title: 'Dissonant Alert', category: 'System', description: 'Dissonant square-wave alert for validation errors.', synthesisType: 'Square wave with dissonant interval', duration: '180ms', frequencies: '380Hz → 280Hz' },
  warning: { name: 'warning', title: 'Soft Warning', category: 'System', description: 'Gentle two-tone caution for non-fatal alerts and risk confirmation.', synthesisType: 'Triangle two-tone', duration: '250ms', frequencies: '520Hz, 390Hz' },
  success: { name: 'success', title: 'Short Success', category: 'System', description: 'Brief major-interval confirm for saves, submits, and completed actions.', synthesisType: 'Sine major third', duration: '220ms', frequencies: 'C5, E5' },
  delete: { name: 'delete', title: 'Delete Confirm', category: 'System', description: 'Descending destructive confirm for trash, remove, and discard actions.', synthesisType: 'Filtered saw + highpass noise', duration: '150ms', frequencies: '220Hz → 70Hz' },
  send: { name: 'send', title: 'Send Whoosh', category: 'Interaction', description: 'Quick rising whoosh with soft landing blip for message send and submit.', synthesisType: 'Bandpass noise sweep + sine blip', duration: '240ms', frequencies: '500Hz → 2800Hz + 880Hz' },
  select: { name: 'select', title: 'Item Select', category: 'Interaction', description: 'Crisp ascending micro-tone for radio, checkbox, and list selection.', synthesisType: 'Triangle pitch tick', duration: '55ms', frequencies: '1400Hz → 2100Hz' },
  drop: { name: 'drop', title: 'Drop Land', category: 'Interaction', description: 'Soft thud with muted tick for drag-and-drop landings.', synthesisType: 'Sine thud + square tick', duration: '110ms', frequencies: '180Hz → 55Hz + 900Hz' },
  swipe: { name: 'swipe', title: 'Swipe Gesture', category: 'Navigation', description: 'Horizontal bandpass sweep for carousel and gesture swipes.', synthesisType: 'Bandpass noise arc', duration: '220ms', frequencies: '900Hz → 3200Hz → 600Hz' },
  notification: { name: 'notification', title: 'Soft Notification', category: 'Notification', description: 'Two gentle pips for push alerts and inbox arrivals.', synthesisType: 'Dual sine pips', duration: '400ms', frequencies: 'A5, D6' },


  // Distributed from former premium category
  glissando: { name: 'glissando', title: 'Elegant Glissando', category: 'Navigation', description: 'Smooth ascending pitch sweep for reveals and luxury menu interactions.', synthesisType: 'Sine exponential pitch sweep', duration: '170ms', frequencies: '400Hz → 1200Hz' },
  shimmer: { name: 'shimmer', title: 'Magical Shimmer', category: 'Notification', description: 'Mystical multi-layered chord shimmer for rewards and special feature unlocks.', synthesisType: 'Multi-layered triangle chord', duration: '250ms', frequencies: '1200Hz / 1600Hz / 2100Hz / 2800Hz' },
  bloop: { name: 'bloop', title: 'Cute Bloop', category: 'Interaction', description: 'Hollow, satisfying liquid drop sound for playful micro-interactions.', synthesisType: 'Sine wave pitch drop', duration: '90ms', frequencies: '600Hz → 150Hz' },
  'sub-kick': { name: 'sub-kick', title: 'Deep Sub-Kick', category: 'Interaction', description: 'Heavy low-frequency kick for confirming major primary actions.', synthesisType: 'Sub-bass sine pitch drop', duration: '160ms', frequencies: '150Hz → 40Hz' },
  crystal: { name: 'crystal', title: 'Glassy Crystal', category: 'Notification', description: 'Long, resonant pure tone perfect for notifications and success states.', synthesisType: 'Pure sine frequency drop', duration: '450ms', frequencies: '2400Hz → 1800Hz' },
  'woosh-deep': { name: 'woosh-deep', title: 'Heavy Woosh', category: 'Navigation', description: 'Cinematic filtered bandpass noise sweep for sheet reveals and page transitions.', synthesisType: 'Bandpass filtered noise sweep', duration: '450ms', frequencies: '100Hz → 800Hz → 100Hz' },
  zap: { name: 'zap', title: 'Laser Zap', category: 'Feedback', description: 'Sharp, futuristic lowpass sawtooth zap for rapid selections and retro cues.', synthesisType: 'Sawtooth pitch drop with lowpass filter', duration: '110ms', frequencies: '1200Hz → 100Hz' },
  spring: { name: 'spring', title: 'Bouncy Spring', category: 'Feedback', description: 'Multi-bounce decaying oscillation for elastic gestures and pull-to-refresh.', synthesisType: 'Sine frequency modulation', duration: '250ms', frequencies: '500Hz - 1100Hz' },
  bubble: { name: 'bubble', title: 'Liquid Bubbles', category: 'Feedback', description: 'Rapid sequence of organic liquid pops for likes and reactions.', synthesisType: 'Multi-stage sine pitch ramps', duration: '100ms', frequencies: '400Hz - 800Hz' },
  'haptic-pop': { name: 'haptic-pop', title: 'Haptic Pop', category: 'Interaction', description: 'Sharp, immediate micro-interaction sound mimicking phone haptic tap motors.', synthesisType: 'Fast-decay square wave pulse', duration: '35ms', frequencies: '120Hz → 40Hz' },

  // Fun & Essentials
  coin: { name: 'coin', title: '8-bit Coin', category: 'Essentials', description: 'Classic 8-bit coin collect sound.', synthesisType: 'Square wave arpeggio', duration: '350ms', frequencies: 'B5 → E6' },
  'power-up': { name: 'power-up', title: 'Power Up', category: 'Essentials', description: 'Ascending major arpeggio for leveling up.', synthesisType: 'Triangle wave chord', duration: '400ms', frequencies: '440Hz → 880Hz' },
  'power-down': { name: 'power-down', title: 'Power Down', category: 'Essentials', description: 'Descending minor sweep for deactivation.', synthesisType: 'Sawtooth sweep', duration: '450ms', frequencies: '300Hz → 40Hz' },
  'magic-sparkle': { name: 'magic-sparkle', title: 'Magic Sparkle', category: 'Essentials', description: 'Shimmering randomized high-frequency fairy dust.', synthesisType: 'Random sine bursts', duration: '500ms', frequencies: '1500Hz - 3500Hz' },
  'jump-boing': { name: 'jump-boing', title: 'Jump Boing', category: 'Essentials', description: 'Comical pitch-bent bouncy jump.', synthesisType: 'Triangle pitch envelope', duration: '350ms', frequencies: '150Hz → 600Hz → 200Hz' },
  'arcade-pew': { name: 'arcade-pew', title: 'Arcade Laser', category: 'Essentials', description: 'Classic retro 8-bit laser shot.', synthesisType: 'Square wave pitch drop', duration: '200ms', frequencies: '880Hz → 110Hz' },
  heartbeat: { name: 'heartbeat', title: 'Heartbeat Pulse', category: 'Essentials', description: 'Deep, dual-stage low-frequency pulse.', synthesisType: 'Sine wave pulse', duration: '500ms', frequencies: '50Hz → 30Hz' },
  'sonar-ping': { name: 'sonar-ping', title: 'Sonar Ping', category: 'Essentials', description: 'High-pitched ping with a long echoing decay.', synthesisType: 'High sine with slow decay', duration: '1250ms', frequencies: '1200Hz' },
  'typewriter-key': { name: 'typewriter-key', title: 'Typewriter Key', category: 'Essentials', description: 'Crisp, vintage mechanical typewriter clack.', synthesisType: 'Bandpassed noise', duration: '40ms', frequencies: '2500Hz' },
  'typewriter-bell': { name: 'typewriter-bell', title: 'Typewriter Bell', category: 'Essentials', description: 'Bright, resonant carriage-return ding.', synthesisType: 'Dual sine ring', duration: '850ms', frequencies: '1600Hz, 1620Hz' },
  'synth-sweep': { name: 'synth-sweep', title: 'Synth Sweep', category: 'Essentials', description: 'Dramatic, resonant low-pass filter sweep.', synthesisType: 'Sawtooth + Lowpass filter sweep', duration: '650ms', frequencies: '100Hz → 4000Hz → 100Hz' },
  glitch: { name: 'glitch', title: 'Digital Glitch', category: 'Essentials', description: 'Deterministic digital dropouts, square wave jumps, and static bursts.', synthesisType: 'Square dropouts + Bandpass Noise', duration: '130ms', frequencies: '60Hz / 3000Hz' },
  'deep-impact': { name: 'deep-impact', title: 'Deep Impact', category: 'Essentials', description: 'Cinematic low-frequency boom with a noise tail.', synthesisType: 'Sine drop + Noise lowpass', duration: '850ms', frequencies: '120Hz → 30Hz' },
  'hollow-thock': { name: 'hollow-thock', title: 'Hollow Thock', category: 'Essentials', description: 'Resonant wooden block percussion sound.', synthesisType: 'Triangle + Sine fast decay', duration: '60ms', frequencies: '600Hz / 300Hz' },
  'success-fanfare': { name: 'success-fanfare', title: 'Success Fanfare', category: 'Essentials', description: 'Short, triumphant multi-tone chord sequence.', synthesisType: 'Triangle major chord', duration: '650ms', frequencies: 'G4, C5, E5' },

  // Immersive site-wide sounds
  'ethereal-reveal': { name: 'ethereal-reveal', title: 'Cinematic Text Reveal', category: 'Navigation', description: 'Multi-layered video-editing sound: airy whoosh riser + glass chime transient + warm sub-bass landing.', synthesisType: 'Layered filtered noise sweep + sine triad + sub-bass bloom', duration: '400ms', frequencies: '250Hz → 1800Hz + F#6/A#6/C#7 + 90Hz → 38Hz' },
  'cinematic-reveal': { name: 'cinematic-reveal', title: 'Cinematic Reveal', category: 'Navigation', description: 'Multi-layer whoosh sweep with glass harmonic transient and sub-bass resonance.', synthesisType: 'Triple layer noise sweep + glass chime + sub bloom', duration: '400ms', frequencies: '250Hz → 1800Hz + F#6/A#6/C#7 + 90Hz → 38Hz' },
  'whoosh-shimmer': { name: 'whoosh-shimmer', title: 'Kinetic Whoosh Shimmer', category: 'Navigation', description: 'Fast silk whoosh with multi-tap crystal sparkle for kinetic letter-by-letter reveals.', synthesisType: 'Highpass noise sweep + 4-tap triangle chime cascade', duration: '350ms', frequencies: '1200Hz HP + E6/A6/E7/A7' },
  'tactile-reveal': { name: 'tactile-reveal', title: 'Tactile Shutter Reveal', category: 'Navigation', description: 'Mechanical precision camera shutter click with spatial air sweep.', synthesisType: 'Bandpass noise sweep + dual sine click transient', duration: '260ms', frequencies: '800Hz → 2400Hz + 1600Hz / 900Hz' },
  'ambient-wash': { name: 'ambient-wash', title: 'Ambient Wash', category: 'System', description: 'Gentle evolving ambient pad for background atmosphere.', synthesisType: 'Multi-voice filtered chord pad (C3-G3-C4-E4)', duration: '3500ms', frequencies: '130Hz / 196Hz / 261Hz / 329Hz' },
  'button-click': { name: 'button-click', title: 'Tactile Button Click', category: 'Interaction', description: 'Refined micro-mechanical switch click for tactile UI button interactions.', synthesisType: 'Bandpass noise transient + damped sine body', duration: '20ms', frequencies: '3400Hz + 380Hz → 120Hz' },
  'button-hover': { name: 'button-hover', title: 'Button Hover', category: 'Feedback', description: 'Muted hover feedback state.', synthesisType: 'Silent', duration: '0ms', frequencies: 'None' },
  'bg-click': { name: 'bg-click', title: 'Background Cushion Tap', category: 'System', description: 'Deep subtle acoustic cushion tap for background canvas clicks.', synthesisType: 'Sub-bass sine with 140Hz lowpass filter', duration: '40ms', frequencies: '70Hz → 32Hz' },
  'soothing-tone': { name: 'soothing-tone', title: 'Soothing Brand Tone', category: 'Notification', description: 'Calming, velvety harmonic glass chime chord (Cmaj9) for signature brand identity and ambient tone.', synthesisType: 'Cascaded multi-voice sine/triangle chord with 1400Hz warm lowpass filter', duration: '2200ms', frequencies: '261Hz / 392Hz / 493Hz / 587Hz / 783Hz' },
};

export function generateSoundLLMPrompt(meta: SoundMeta): string {
  const pascal = meta.name
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
  const playFn = `play${pascal}`;

  return `Add the "${meta.title}" sound (\`${meta.name}\`) from the npm package \`sound-library\` to my project.

## Goal
Wire this sound into the UI where I asked (button / form / toast / nav / whatever I described). Do not invent a custom Web Audio synthesizer — use the published package or its CLI.

## Sound
- id: \`${meta.name}\`
- title: ${meta.title}
- category: ${meta.category}
- description: ${meta.description}
- duration: ${meta.duration}

## Preferred path (runtime package)
1. Install:
\`\`\`bash
npm i sound-library
# or: pnpm add sound-library / yarn add sound-library / bun add sound-library
\`\`\`
2. Play it from a user gesture only (click / pointerdown / keydown — never on mount):
\`\`\`ts
import { playSound, ${playFn} } from 'sound-library';

playSound('${meta.name}');
// or
${playFn}();
\`\`\`
3. React / Next.js App Router — keep audio in a \`'use client'\` file:
\`\`\`tsx
'use client';
import { playSound } from 'sound-library';
import { SoundButton, useSound } from 'sound-library/react';

<button onClick={() => playSound('${meta.name}')}>…</button>
<SoundButton sound="${meta.name}">…</SoundButton>

const { play } = useSound('${meta.name}');
\`\`\`

## Alternate path (scaffold files, no runtime dep)
If I prefer copy-paste files instead of a dependency:
\`\`\`bash
npx sound-library add ${meta.name}
# aliases: pnpm dlx sound-library add ${meta.name} | bunx sound-library add ${meta.name}
\`\`\`
Then import the generated helper from the scaffolded path the CLI prints and call it from the same UI events.

## Rules
- Call audio only from user gestures; resume AudioContext if suspended (the package handles this).
- Respect mute / \`prefers-reduced-motion\` (package auto-mutes when reduced motion is on).
- Place the trigger on the exact control(s) I named in my request — do not add a demo page unless I asked.
- Prefer \`playSound('${meta.name}')\` or \`<SoundButton sound="${meta.name}" />\` over rewriting synthesis.
`;
}
