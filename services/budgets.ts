import { type Budget } from "@/types";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  addDoc,
  FirestoreError,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();

interface CreateBudgetInput {
  category: string;
  amount: number;
  period: "weekly" | "monthly";
  startDate: Date;
}

class BudgetServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = "BudgetServiceError";
  }
}

function handleFirebaseError(error: unknown): never {
  if (error instanceof FirestoreError) {
    switch (error.code) {
      case "permission-denied":
        throw new BudgetServiceError(
          "You don't have permission to perform this action",
          "PERMISSION_DENIED",
          error,
        );
      case "not-found":
        throw new BudgetServiceError(
          "The requested budget was not found",
          "NOT_FOUND",
          error,
        );
      case "resource-exhausted":
        throw new BudgetServiceError(
          "You've reached your budget limit",
          "QUOTA_EXCEEDED",
          error,
        );
      default:
        throw new BudgetServiceError(
          "An error occurred while managing your budget",
          "UNKNOWN_ERROR",
          error,
        );
    }
  }

  throw new BudgetServiceError(
    "An unexpected error occurred",
    "UNKNOWN_ERROR",
    error,
  );
}

export async function getBudgets(): Promise<Budget[]> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new BudgetServiceError(
      "You must be logged in to fetch budgets",
      "UNAUTHENTICATED",
    );
  }

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
    handleFirebaseError(error);
  }
}

export async function createBudget({
  category,
  amount,
  period,
  startDate,
}: CreateBudgetInput): Promise<Budget> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new BudgetServiceError(
      "You must be logged in to create a budget",
      "UNAUTHENTICATED",
    );
  }

  try {
    // Validate input
    if (amount <= 0) {
      throw new BudgetServiceError(
        "Budget amount must be greater than 0",
        "INVALID_AMOUNT",
      );
    }

    if (!category.trim()) {
      throw new BudgetServiceError("Category is required", "INVALID_CATEGORY");
    }

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
    handleFirebaseError(error);
  }
}

export async function getCurrentMonthBudgets(): Promise<Budget[]> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new BudgetServiceError(
      "You must be logged in to fetch budgets",
      "UNAUTHENTICATED",
    );
  }

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
    handleFirebaseError(error);
  }
}
