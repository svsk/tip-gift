import { AuthContext } from '~~/lib/AuthContext';

export const useAuth = () => useState<AuthContext | null>('auth');
