export const Main = () => '/';
export const SignIn = () => '/signin';
export const SignUp = () => '/signup';
export const SearchResult = () => '/search';
export const CreateSong = () => '/song/create';
export const Song = (id: number | string) => `/song/${id}`;
export const CreateCover = (id: number | string) => `/cover/create/${id}`;
export const Cover = (id: number | string) => `/cover/${id}`;
export const Profile = (id: number | string) => `/profile/${id}`;
