import {
  faDrum,
  faGuitar,
  faMicrophoneAlt,
  faMusic,
} from '@fortawesome/free-solid-svg-icons';

// get icon from instrument name
export const getIcon = (name: string) => {
  switch (name) {
    case 'Vocal':
      return faMicrophoneAlt;
    case 'Guitar':
      return faGuitar;
    case 'Drum':
      return faDrum;
    default:
      return faMusic;
  }
};

// get thumbnail link from youtube link
export const getThumbnail = (link: string) => {
  // https://www.youtube.com/watch?v=<videoId>
  let found = link.match(/\?v=([a-zA-Z\d-_]*)/);
  if (!found) {
    // https://youtu.be/<videoId>
    found = link.match(/youtu.be\/([a-zA-Z\d-_]*)/);
  }
  if (!found) {
    // error: not a youtube link
    return '';
  }

  const videoId = found[1];
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};
