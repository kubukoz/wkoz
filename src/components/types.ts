export type Track = {
  id: number;
  ordr: number;
  catId: number;
  name: string;
  filename: string;
};

export type Category = {
  id: number;
  ordr: number;
  songs: readonly Track[];
  name: string;
};
