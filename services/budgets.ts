import { type Budget } from "@/types";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();

interface CreateBudgetInput {
  category: string;
  amount: number;
  period: "weekly" | "monthly";
  startDate: Date;
}

export async function getBudgets(): Promise<Budget[]> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in to fetch budgets");

  try {
    const budgetsRef = collection(db, "budgets");
    const q = query(budgetsRef, where("userId", "==", user.uid));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        category: data.category,
        amount: data.amount,
        period: data.period,
        startDate: data.startDate.toDate(),
      };
    });
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw new Error("Failed to fetch budgets");
  }
}

export async function createBudget({
  category,
  amount,
  period,
  startDate,
}: CreateBudgetInput) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in to create a budget");

  try {
    const budgetRef = await addDoc(collection(db, "budgets"), {
      userId: user.uid,
      category,
      amount,
      period,
      startDate: Timestamp.fromDate(startDate),
      createdAt: Timestamp.now(),
    });

    return {
      id: budgetRef.id,
      userId: user.uid,
      category,
      amount,
      period,
      startDate,
    };
  } catch (error) {
    console.error("Error creating budget:", error);
    throw new Error("Failed to create budget");
  }
}

export async function getCurrentMonthBudgets(): Promise<Budget[]> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in to fetch budgets");

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  try {
    const budgetsRef = collection(db, "budgets");
    const q = query(
      budgetsRef,
      where("userId", "==", user.uid),
      where("startDate", ">=", Timestamp.fromDate(startOfMonth)),
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        category: data.category,
        amount: data.amount,
        period: data.period,
        startDate: data.startDate.toDate(),
      };
    });
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw new Error("Failed to fetch budgets");
  }
}
