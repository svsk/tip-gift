export const useAuth = () => useSupabaseUser();
export const logout = () => useSupabaseClient().auth.signOut();
