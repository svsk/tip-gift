export const useAuth = () => useSupabaseUser();
export const logout = async () => {
    await useSupabaseClient().auth.signOut();
    const accessToken = useCookie('sb-access-token');
    const refreshToken = useCookie('sb-refresh-token');

    accessToken.value = null;
    refreshToken.value = null;
};
