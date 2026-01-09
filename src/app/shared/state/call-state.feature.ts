import { signalStoreFeature, withState, withMethods, patchState } from '@ngrx/signals';

// 1. Définir la structure de l'état pour un appel API
export type CallState = {
  loading: boolean;
  error: string | null;
};

export const initialState: CallState = {
  loading: false,
  error: null,
};

// 2. Créer la feature réutilisable
export function withCallState() {
  return signalStoreFeature(
    withState<CallState>(initialState),
    withMethods((store) => ({
      setLoading(): void { patchState(store, { loading: true, error: null }); },
      setLoaded(): void { patchState(store, { loading: false }); },
      setError(error: string): void { patchState(store, { loading: false, error }); },
    }))
  );
}