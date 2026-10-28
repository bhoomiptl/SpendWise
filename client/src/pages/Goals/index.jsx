import { useEffect, useState } from "react";
import { api } from "../../api/api";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    savedAmount: "0",
    targetDate: "",
    description: "",
  });

  const [savedAmounts, setSavedAmounts] = useState({});
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    targetAmount: "",
    targetDate: "",
    description: "",
  });

  const formatCurrency = (amountInPaise = 0) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amountInPaise / 100);

  const formatDate = (date) => {
    if (!date) return "No target date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const toPaise = (rupees) => Math.round(Number(rupees) * 100);

  const getProgress = (goal) => {
    if (!goal.targetAmountInPaise) return 0;

    return Math.min(
      100,
      Math.round(
        (goal.savedAmountInPaise / goal.targetAmountInPaise) * 100
      )
    );
  };

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.get("/goals");
      setGoals(data.goals || []);
    } catch (err) {
      setError(err.message || "Unable to load goals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateGoal = async (event) => {
    event.preventDefault();

    const targetAmount = Number(form.targetAmount);
    const savedAmount = Number(form.savedAmount);

    if (
      !form.name.trim() ||
      !Number.isFinite(targetAmount) ||
      targetAmount <= 0 ||
      !Number.isFinite(savedAmount) ||
      savedAmount < 0
    ) {
      setError("Enter a valid name, target amount, and saved amount.");
      return;
    }

    if (
      !Number.isSafeInteger(toPaise(form.targetAmount)) ||
      !Number.isSafeInteger(toPaise(form.savedAmount))
    ) {
      setError("Please enter valid monetary amounts.");
      return;
    }

    if (savedAmount > targetAmount) {
      setError("The saved amount cannot exceed the target amount.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.post("/goals", {
        name: form.name.trim(),
        targetAmountInPaise: toPaise(form.targetAmount),
        savedAmountInPaise: toPaise(form.savedAmount),
        targetDate: form.targetDate || null,
        description: form.description.trim(),
      });

      setForm({
        name: "",
        targetAmount: "",
        savedAmount: "0",
        targetDate: "",
        description: "",
      });

      await loadGoals();
    } catch (err) {
      setError(err.message || "Unable to create goal.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProgress = async (goal) => {
    const amount = Number(savedAmounts[goal._id]);

    if (
      !Number.isFinite(amount) ||
      amount < 0 ||
      !Number.isSafeInteger(toPaise(amount))
    ) {
      setError("Enter a valid saved amount.");
      return;
    }

    if (amount > goal.targetAmountInPaise / 100) {
      setError("Saved amount cannot exceed the target amount.");
      return;
    }

    try {
      setError("");

      await api.put(`/goals/${goal._id}`, {
        savedAmountInPaise: toPaise(amount),
      });

      setSavedAmounts((previous) => {
        const updated = { ...previous };
        delete updated[goal._id];
        return updated;
      });

      await loadGoals();
    } catch (err) {
      setError(err.message || "Unable to update progress.");
    }
  };

  const startEditing = (goal) => {
    setEditingGoalId(goal._id);

    setEditForm({
      name: goal.name,
      targetAmount: String(goal.targetAmountInPaise / 100),
      targetDate: goal.targetDate
        ? new Date(goal.targetDate).toISOString().slice(0, 10)
        : "",
      description: goal.description || "",
    });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveEdit = async (event, goal) => {
    event.preventDefault();

    const targetAmount = Number(editForm.targetAmount);

    if (
      !editForm.name.trim() ||
      !Number.isFinite(targetAmount) ||
      targetAmount <= 0 ||
      !Number.isSafeInteger(toPaise(editForm.targetAmount))
    ) {
      setError("Enter a valid goal name and target amount.");
      return;
    }

    if (toPaise(editForm.targetAmount) < goal.savedAmountInPaise) {
      setError("The target amount cannot be lower than the amount already saved.");
      return;
    }

    try {
      setError("");

      await api.put(`/goals/${goal._id}`, {
        name: editForm.name.trim(),
        targetAmountInPaise: toPaise(editForm.targetAmount),
        targetDate: editForm.targetDate || null,
        description: editForm.description.trim(),
      });

      setEditingGoalId(null);
      await loadGoals();
    } catch (err) {
      setError(err.message || "Unable to update goal.");
    }
  };

  const handleDeleteGoal = async (goalId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this goal?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/goals/${goalId}`);
      await loadGoals();
    } catch (err) {
      setError(err.message || "Unable to delete goal.");
    }
  };

  const totalTarget = goals.reduce(
    (total, goal) => total + goal.targetAmountInPaise,
    0
  );

  const totalSaved = goals.reduce(
    (total, goal) => total + goal.savedAmountInPaise,
    0
  );

  const completedGoals = goals.filter(
    (goal) => goal.savedAmountInPaise >= goal.targetAmountInPaise
  ).length;

  return (
    <section className="page">
      <p className="page-eyebrow">Future planning</p>

      <h1>Goals</h1>

      <p className="page-description">
        Turn your plans into achievable savings goals.
      </p>

      {error && (
        <div className="goal-message" role="alert">
          {error}
          <button type="button" onClick={() => setError("")}>
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading your goals...</p>
      ) : (
        <>
          <div className="goals-summary">
            <article className="goal-card">
              <p>Total saved</p>
              <h2>{formatCurrency(totalSaved)}</h2>
            </article>

            <article className="goal-card">
              <p>Combined target</p>
              <h2>{formatCurrency(totalTarget)}</h2>
            </article>

            <article className="goal-card">
              <p>Completed goals</p>
              <h2>{completedGoals} / {goals.length}</h2>
            </article>
          </div>

          <div className="goal-section">
            <h2>Create a savings goal</h2>

            <form className="goal-form" onSubmit={handleCreateGoal}>
              <label>
                Goal name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Buy a laptop"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Target amount (₹)
                <input
                  type="number"
                  name="targetAmount"
                  value={form.targetAmount}
                  onChange={handleFormChange}
                  min="0.01"
                  step="0.01"
                  placeholder="50000"
                  required
                />
              </label>

              <label>
                Already saved (₹)
                <input
                  type="number"
                  name="savedAmount"
                  value={form.savedAmount}
                  onChange={handleFormChange}
                  min="0"
                  step="0.01"
                  required
                />
              </label>

              <label>
                Target date (optional)
                <input
                  type="date"
                  name="targetDate"
                  value={form.targetDate}
                  onChange={handleFormChange}
                />
              </label>

              <label className="goal-description-field">
                Description (optional)
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="What are you saving for?"
                  maxLength={300}
                  rows={3}
                />
              </label>

              <button type="submit" disabled={saving}>
                {saving ? "Creating..." : "Create goal"}
              </button>
            </form>
          </div>

          <div className="goal-section">
            <h2>Your savings goals</h2>

            {goals.length === 0 ? (
              <div className="goal-card">
                <p>You haven't created any goals yet.</p>
                <p>Create your first goal to start tracking your progress.</p>
              </div>
            ) : (
              <div className="goals-list">
                {goals.map((goal) => {
                  const progress = getProgress(goal);
                  const remaining = Math.max(
                    0,
                    goal.targetAmountInPaise - goal.savedAmountInPaise
                  );

                  return (
                    <article className="goal-card" key={goal._id}>
                      {editingGoalId === goal._id ? (
                        <form
                          className="goal-form"
                          onSubmit={(event) => handleSaveEdit(event, goal)}
                        >
                          <label>
                            Goal name
                            <input
                              name="name"
                              value={editForm.name}
                              onChange={handleEditChange}
                              maxLength={100}
                              required
                            />
                          </label>

                          <label>
                            Target amount (₹)
                            <input
                              type="number"
                              name="targetAmount"
                              value={editForm.targetAmount}
                              onChange={handleEditChange}
                              min="0.01"
                              step="0.01"
                              required
                            />
                          </label>

                          <label>
                            Target date
                            <input
                              type="date"
                              name="targetDate"
                              value={editForm.targetDate}
                              onChange={handleEditChange}
                            />
                          </label>

                          <label>
                            Description
                            <textarea
                              name="description"
                              value={editForm.description}
                              onChange={handleEditChange}
                              maxLength={300}
                              rows={3}
                            />
                          </label>

                          <button type="submit">Save changes</button>

                          <button
                            type="button"
                            onClick={() => setEditingGoalId(null)}
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <>
                          <div className="goal-card-header">
                            <div>
                              <h3>{goal.name}</h3>
                              <p>{goal.description || "Personal savings goal"}</p>
                            </div>

                            <span className="goal-percentage">
                              {progress}%
                            </span>
                          </div>

                          <div
                            className="goal-progress-track"
                            role="progressbar"
                            aria-label={`${goal.name} progress`}
                            aria-valuenow={progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div
                              className="goal-progress-fill"
                              style={{ width: `${progress}%` }}
                            />
                          </div>

                          <div className="goal-amount-row">
                            <span>
                              Saved: {formatCurrency(goal.savedAmountInPaise)}
                            </span>

                            <span>
                              Target: {formatCurrency(goal.targetAmountInPaise)}
                            </span>
                          </div>

                          <p className="goal-remaining">
                            {remaining === 0
                              ? "🎉 Goal completed!"
                              : `${formatCurrency(remaining)} left to reach your goal`}
                          </p>

                          <p className="goal-date">
                            Target date: {formatDate(goal.targetDate)}
                          </p>

                          <div className="goal-progress-update">
                            <label>
                              Update total saved (₹)
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={
                                  savedAmounts[goal._id] ??
                                  String(goal.savedAmountInPaise / 100)
                                }
                                onChange={(event) =>
                                  setSavedAmounts((previous) => ({
                                    ...previous,
                                    [goal._id]: event.target.value,
                                  }))
                                }
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => handleUpdateProgress(goal)}
                            >
                              Update progress
                            </button>
                          </div>

                          <div className="goal-actions">
                            <button
                              type="button"
                              onClick={() => startEditing(goal)}
                            >
                              Edit goal
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteGoal(goal._id)}
                            >
                              Delete goal
                            </button>
                          </div>
                        </>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default Goals;