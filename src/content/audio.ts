import voiceAi from '../assets/audio/voice-ai.mp3';
import voiceArpanet from '../assets/audio/voice-arpanet.mp3';
import voiceEmail from '../assets/audio/voice-email.mp3';
import voiceFreeWeb from '../assets/audio/voice-free-web.mp3';
import voiceGoogle from '../assets/audio/voice-google.mp3';
import voiceNorsar from '../assets/audio/voice-norsar.mp3';
import voiceSmartphone from '../assets/audio/voice-smartphone.mp3';
import voiceSocial from '../assets/audio/voice-social.mp3';
import voiceTcpip from '../assets/audio/voice-tcpip.mp3';
import voiceWeb from '../assets/audio/voice-web.mp3';

/**
 * Narration, made with scripts/make-voice.ts and reviewed before commit. Referenced by
 * ID from mission structures, like art. The words spoken are the text on screen.
 */
export const audio: Record<string, string> = {
  'voice-arpanet': voiceArpanet,
  'voice-email': voiceEmail,
  'voice-norsar': voiceNorsar,
  'voice-tcpip': voiceTcpip,
  'voice-web': voiceWeb,
  'voice-free-web': voiceFreeWeb,
  'voice-google': voiceGoogle,
  'voice-social': voiceSocial,
  'voice-smartphone': voiceSmartphone,
  'voice-ai': voiceAi,
};

export function audioFor(id: string): string | undefined {
  return audio[id];
}
