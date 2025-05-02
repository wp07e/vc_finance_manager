import { db } from '@/lib/firebase-config';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

interface Notification {
  id?: string;
  userId: string;
  message: string;
  read: boolean;
  timestamp: Date;
}

async function addNotification(notification: Omit<Notification, 'timestamp' | 'read'>) {
  try {
    await addDoc(collection(db, 'notifications'), {
      ...notification,
      read: false,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error adding notification:', error);
    throw new Error('Failed to add notification');
  }
}

async function getNotifications(userId: string) {
  try {
    const q = query(collection(db, 'notifications'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const notifications: Notification[] = [];
    querySnapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() as Notification });
    });
    return notifications;
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw new Error('Failed to get notifications');
  }
}

async function markNotificationAsRead(notificationId: string) {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw new Error('Failed to mark notification as read');
  }
}

// TODO: Add functions for deleting notifications, etc.

export { addNotification, getNotifications, markNotificationAsRead };
