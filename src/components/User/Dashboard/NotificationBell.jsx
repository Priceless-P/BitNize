import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { fetchPendingTransfers, fetchPendingSettle } from '../../../functions/api';

const NotificationBell = ({ count, setNotificationCount }) => {
    const navigate = useNavigate();
    const [pendingSettles, setPendingSettles] = useState([]);

    useEffect(() => {
        const fetchNotificationsData = async () => {
            const userString = sessionStorage.getItem("user");
            if (userString) {
                const userObject = JSON.parse(userString);
                const userId = userObject._id;

                const [pendingTransfers, pendingSettles] = await Promise.all([
                    fetchPendingTransfers(userId),
                    fetchPendingSettle(userId),
                ]);
                //console.log(pendingSettles)

                if (pendingTransfers.success && pendingSettles.success) {
                    setNotificationCount(pendingTransfers.result.length + pendingSettles.result.length);
                    setPendingSettles(pendingSettles.result);
                }
            }
        };

        fetchNotificationsData();
    }, [setNotificationCount]);

    const handleNotificationClick = () => {
        if (pendingSettles.length > 0) {
            navigate(`/settle/${pendingSettles[0]._id}`);
        } else {
            navigate('/pending/approval');
        }
    };

    return (
        <div style={{ position: 'relative' }} className='mr-5'>
            <Button icon="pi pi-bell" className="p-button-rounded p-button-primary mr-5" onClick={handleNotificationClick} />
            {count > 0 && (
                <span
                    style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        backgroundColor: 'red',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '0.3em 0.4em',
                        fontSize: '0.8em',
                    }}
                >
                    {count}
                </span>
            )}
        </div>
    );
};

export default NotificationBell;
