import ReactAudioPlayer from "react-audio-player";
function fixComponent<T>(component: T): T {
  return (component as any).default ?? component;
}

// Workaround for https://github.com/justinmc/react-audio-player/issues/135
export const ReactAudioPlayerComponent = fixComponent(ReactAudioPlayer);
