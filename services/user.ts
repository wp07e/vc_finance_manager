import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import type { UserSettings } from "@/types";

const db = getFirestore();

export async function getUserSettings(): Promise<UserSettings> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User must be logged in to fetch settings");
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Return default settings if not found
      return {
        theme: "system",
        currency: "USD",
        notifications: {
          email: false,
          push: false,
        },
      };
    }

    const data = userDoc.data();
    return {
      theme: data.settings?.theme || "system",
      currency: data.settings?.currency || "USD",
      notifications: {
        email: data.settings?.notifications?.email || false,
        push: data.settings?.notifications?.push || false,
      },
    };
  } catch (error) {
    console.error("Error fetching user settings:", error);
    throw new Error("Failed to fetch user settings");
  }
}

export async function updateUserSettings(
  settings: UserSettings,
): Promise<void> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User must be logged in to update settings");
  }

  try {
    const updateData: {
      settings: UserSettings;
      updatedAt: Date;
    } = {
      settings,
      updatedAt: new Date(),
    };
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, updateData);
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw new Error("Failed to update user settings");
  }
}
