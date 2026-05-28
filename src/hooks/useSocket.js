import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { addNotification } from '../store/notificationSlice';
import { Bell } from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

let socket = null;

const useSocket = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated || !user?._id) return;

        socket = io(SOCKET_URL, {
            transports: ['websocket'],
            withCredentials: true,
        });

        socket.on('connect', () => {
            console.log('Socket connected');
            socket.emit('join', user._id);
        });

        socket.on('notification', (notification) => {
            dispatch(addNotification(notification));
            toast(notification.message, {
                icon: <Bell size={14} />,
                duration: 4000,
                style: {
                    background: '#1f2937',
                    color: '#fff',
                    border: '1px solid #374151',
                },
            });
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        return () => {
            if (socket) {
                socket.disconnect();
                socket = null;
            }
        };
    }, [isAuthenticated, user?._id,dispatch]);
};

export default useSocket;