export type BalloonData = {
    hour: number;
    lat: number;
    lng: number;
    alt: number;
};

export type BalloonPath = {
    id: number;
    color: string;
    coordinates: Array<{
        lat: number;
        lng: number;
        alt: number;
        hour: number;
  }>;
};
