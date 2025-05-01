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
  doc,
  updateDoc,
  deleteDoc,
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

interface UpdateBudgetInput {
  id: string;
  category?: string;
  amount?: number;
  period?: "weekly" | "monthly";
  startDate?: Date;
}

export async function updateBudget({
  id,
  category,
  amount,
  period,
  startDate,
}: UpdateBudgetInput) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new BudgetServiceError(
      "You must be logged in to update a budget",
      "UNAUTHENTICATED",
    );
  }

  try {
    const budgetRef = doc(db, "budgets", id);
    const updateData: any = {};
    if (category !== undefined) updateData.category = category;
    if (amount !== undefined) updateData.amount = amount;
    if (period !== undefined) updateData.period = period;
    if (startDate !== undefined)
      updateData.startDate = Timestamp.fromDate(startDate);

    await updateDoc(budgetRef, updateData);

    return { success: true, id };
  } catch (error) {
    handleFirebaseError(error);
  }
}

export async function deleteBudget(id: string) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new BudgetServiceError(
      "You must be logged in to delete a budget",
      "UNAUTHENTICATED",
    );
  }

  try {
    const budgetRef = doc(db, "budgets", id);
    await deleteDoc(budgetRef);

    return { success: true, id };
  } catch (error) {
    handleFirebaseError(error);
  }
}
