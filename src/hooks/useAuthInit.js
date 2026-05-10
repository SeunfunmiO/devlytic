import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials, logout } from '../store/authSlice';
import { fetchDeveloper, fetchCompany } from '../services/fetchService';
import { refreshTokenService } from '../services/authService';

const useAuthInit = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const init = async () => {
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) return;

            try {
                // Get a fresh access token — role is inside the JWT payload
                const { accessToken, role } = await refreshTokenService(refreshToken);

                // Fetch user data from backend based on role from token
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
            }
        };

        init();
    }, [dispatch]);
};

export default useAuthInit;