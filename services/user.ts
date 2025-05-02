import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import type { UserSettings } from "@/types";
import { UserSettingsInput } from "@/lib/validations/schema";

const db = getFirestore();

export async function getUserSettings(): Promise<UserSettingsInput> {
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
        displayName: undefined,
        photoURL: undefined,
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
      displayName: data.displayName,
      photoURL: data.photoURL,
    };
  } catch (error) {
    console.error("Error fetching user settings:", error);
    throw new Error("Failed to fetch user settings");
  }
}

export async function updateUserSettings(
  settings: UserSettingsInput,
): Promise<void> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User must be logged in to update settings");
  }

  try {
    const updateData: any = {
      settings: {
        theme: settings.theme,
        currency: settings.currency,
        notifications: settings.notifications,
      },
      updatedAt: new Date(),
    };

    if (settings.displayName !== undefined) {
      updateData.displayName = settings.displayName;
    }
    if (settings.photoURL !== undefined) {
      updateData.photoURL = settings.photoURL;
    }

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, updateData, { merge: true }); // Use merge to avoid overwriting other user fields
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw new Error("Failed to update user settings");
  }
}
