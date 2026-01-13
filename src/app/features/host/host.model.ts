export interface Host {
  id: number;
  userPublicId: string;
  name: string;
  photo: string | null;
  isSuperhost: boolean;
  responseRate: number;
  responseTime: string | null;
  totalReviews: number;
}
