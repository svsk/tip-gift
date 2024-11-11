export const useAuth = () => {
    const { user } = useUserSession();
    return user;
};

export const logout = async () => {
    await useUserSession().clear();
};

export const useAuthentication = () => {
    const cookie = useRequestHeaders(['cookie'])?.cookie || '';
    return { headers: { cookie } };
};
