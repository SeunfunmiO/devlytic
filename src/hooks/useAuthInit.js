import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials, logout, setInitialized } from '../store/authSlice';
import { fetchDeveloper, fetchCompany } from '../services/fetchService';
import { refreshTokenService } from '../services/authService';
import api from '../services/api';

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

                // Manually set the token in axios headers before fetching user
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

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
            } catch (error) {
                console.error('Auth init error:', error);
                dispatch(logout());
                localStorage.removeItem('refreshToken');
                dispatch(setInitialized());
            }
        };

        init();
    }, [dispatch]);
};

export default useAuthInit;