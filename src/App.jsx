//Imports
import { useState, useEffect} from 'react';
import { firestore } from './firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc} from "firebase/firestore";

//Expense Tracker
export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] =useState(null);

  const startEditingExpense = (expense) => {
    setDescription(expense.description);
    setAmount(expense.amount);
    setIsEditing(true);
    setCurrentExpenseId(expense.id);
  };

  // Fetching expenses from Firestore
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "expenses"));
        const expenseList = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Getting the unique id from Firestore
          ...doc.data(),
        }));
        setExpenses(expenseList);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  // Adding a new expense to Firestore
  const handleAddExpense = async () => {
    if (description && amount) {
      try {
        const docRef = await addDoc(collection(firestore, "expenses"), {
          description,
          amount: Number(amount),
        });
        setExpenses([...expenses, { id: docRef.id, description, amount: Number(amount) }]);
        setDescription('');
        setAmount('');
      } catch (error) {
        console.error("Error adding expense:", error);
      }
    }
  };

  //Deleting an expense from Firestore
  const deleteExpense = async (id) => {
    const expenseId = String(id);
    const expenseDocRef = doc(firestore, "expenses", expenseId);

    await deleteDoc(expenseDocRef)
      .then(() => {
        console.log("Document successfully deleted!" , expenseId);
        alert("Expense deleted successfully!");
        setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== expenseId));
      })
      .catch((error) => {
        console.error("Error deleting document: ", error);
        alert("Failed to delete expense. Please try again."); 
      });
  };

  // Updating an expense in Firestore
  const updateExpense = async () => {
    if (description && amount && currentExpenseId) {
      try {
        const expenseDocRef = doc(firestore, "expenses", currentExpenseId);
        await updateDoc(expenseDocRef, {
          description,
          amount: Number(amount),
        });

        console.log("Document successfully updated!", currentExpenseId);
        alert("Expense updated successfully!");

        setExpenses((prevExpenses) =>
          prevExpenses.map((expense) =>
            expense.id === currentExpenseId ? { ...expense, description, amount: Number(amount) } : expense
          )
        );

        // Resetting input fields and editing state
        setDescription('');
        setAmount('');
        setIsEditing(false);
        setCurrentExpenseId(null);
      } catch (error) {
        console.error("Error updating document: ", error);
        alert("Failed to update expense. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-600">PennyWise</h1>
        <div>
          <button className="text-sm text-gray-700 mr-4">Log In</button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded">Sign Up</button>
        </div>
      </header>

    <div className="max-w-xl mx-auto mt-10 p-5 bg-gray-100 rounded shadow">
      <h1 className="text-2xl font-bold mb-5">Your Expenses</h1>
      <div className="flex space-x-2 mb-5">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          className="w-24 p-2 border rounded"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className={`p-2 ${isEditing ? "bg-green-500" : "bg-purple-600"}  text-white rounded`} onClick={isEditing ? updateExpense : handleAddExpense}>
          {isEditing ? "Update Expense" : "Add Expense"}
          </button>
      </div>

      <div>
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex justify-between items-center p-3 mb-3 bg-white shadow rounded"
          >
            <div>
              <h2 className="font-bold">{expense.description}</h2>
              <p>${expense.amount}</p>
            </div>
            <div className="flex space-x-2">
            <button className="text-blue-500" onClick={() => startEditingExpense(expense)}>Edit</button>
              <button className="text-red-500" onClick={()=>{deleteExpense(expense.id)}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>

     {/* Footer Navigation */}
     <footer className="fixed bottom-0 left-0 right-0 bg-gray-200 p-4 flex justify-center space-x-8">
        <button className="text-gray-700">Welcome</button>
        <button className="text-gray-700">Auth</button>
        <button className="text-gray-700">Dashboard</button>
      </footer>
    </div>
  );
}
