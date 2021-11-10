import {
  faDrum,
  faGuitar,
  faMicrophoneAlt,
  faMusic,
} from '@fortawesome/free-solid-svg-icons';

export const getIcon = (icon: string) => {
  switch (icon) {
    case 'mic':
      return faMicrophoneAlt;
    case 'guitar':
      return faGuitar;
    case 'drum':
      return faDrum;
    default:
      return faMusic;
  }
};
