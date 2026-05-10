import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials, logout, setInitialized } from '../store/authSlice';
import { fetchDeveloper, fetchCompany } from '../services/fetchService';
import { refreshTokenService } from '../services/authService';

const useAuthInit = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const init = async () => {
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                dispatch(setInitialized());
                return;
            }

            try {
                // Get fresh access token + role from backend
                const { accessToken, role } = await refreshTokenService(refreshToken);

                // Fetch full user data based on role
                let data;
                if (role === 'developer') {
                    data = await fetchDeveloper();
                } else {
                    data = await fetchCompany();
                }

                dispatch(setCredentials({
                    user: data.user,
                    role: data.user.role,
                    accessToken,
                }));
            } catch {
                dispatch(logout());
                localStorage.removeItem('refreshToken');
                dispatch(setInitialized());
            }
        };

        init();
    }, [dispatch]);
};

export default useAuthInit;