/**
 * Modèle représentant l'utilisateur actuellement connecté.
 * Extrait du JWT et de l'API /api/users/me.
 */
export interface CurrentUser {
  publicId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  pictureUrl?: string;
  roles: string[];
  isHost: boolean;
}

