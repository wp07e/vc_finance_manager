'use client';

import { useEffect, useState } from 'react';
import { getNotifications, markNotificationAsRead } from '@/services/notifications';
import { useAuth } from '@/lib/auth/auth-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { BellIcon } from '@radix-ui/react-icons';

interface Notification {
  id?: string;
  userId: string;
  message: string;
  read: boolean;
  timestamp: Date;
}

function NotificationsList() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      if (user) {
        try {
          const userNotifications = await getNotifications(user.uid);
          setNotifications(userNotifications);
        } catch (error) {
          console.error('Error fetching notifications:', error);
          // TODO: Display a user-friendly error message
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [user]);

  if (loading) {
    return <div>Loading notifications...</div>; // TODO: Replace with a skeleton loader
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <BellIcon className="h-5 w-5" />
          <span className="sr-only">View notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <DropdownMenuItem>No new notifications</DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id)}
              disabled={notification.read} // Disable if already read
              className={notification.read ? 'text-muted-foreground' : ''} // Style read notifications
            >
              {notification.message}
              {/* TODO: Add timestamp */}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  async function handleNotificationClick(notificationId?: string) {
    if (!notificationId) return;

    try {
      await markNotificationAsRead(notificationId);
      // Update local state to mark as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // TODO: Display a user-friendly error message
    }
  }
}

export { NotificationsList };
