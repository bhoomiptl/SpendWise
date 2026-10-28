import { useState } from "react";
import { api } from "../../api/api";

function WhatIf() {
    const [monthlyReduction, setMonthlyReduction] = useState("");
    const [durationMonths, setDurationMonths] = useState("12");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const formatMoney = (paise) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(paise / 100);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setResult(null);

        const reduction = Number(monthlyReduction);
        const duration = Number(durationMonths);

        if (
            !Number.isFinite(reduction) ||
            reduction <= 0 ||
            !Number.isSafeInteger(Math.round(reduction * 100))
        ) {
            setError("Enter a valid monthly reduction amount.");
            return;
        }

        if (
            !Number.isInteger(duration) ||
            duration < 1 ||
            duration > 60
        ) {
            setError("Choose a duration between 1 and 60 months.");
            return;
        }

        setLoading(true);

        try {
            const data = await api.post("/whatif", {
                monthlyReduction: Math.round(reduction * 100),
                durationMonths: duration,
            });

            setResult(data.simulation);
        } catch (err) {
            setError(err.message || "Unable to calculate your savings.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="page">
            <p className="page-eyebrow">Financial Planning</p>

            <h1>What-If</h1>

            <p className="page-description">
                Discover how reducing your monthly expenses could help you
                save more money over time.
            </p>

            <div className="whatif-layout">
                <section className="whatif-form-section">
                    <h2>Plan your savings</h2>

                    <p>
                        Imagine spending less each month. Enter your
                        planned reduction to estimate your potential savings.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="whatif-field">
                            <label htmlFor="monthlyReduction">
                                Monthly expense reduction (₹)
                            </label>

                            <input
                                id="monthlyReduction"
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder="e.g. 1000"
                                value={monthlyReduction}
                                onChange={(event) =>
                                    setMonthlyReduction(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="whatif-field">
                            <label htmlFor="durationMonths">
                                Savings duration
                            </label>

                            <select
                                id="durationMonths"
                                value={durationMonths}
                                onChange={(event) =>
                                    setDurationMonths(event.target.value)
                                }
                            >
                                <option value="3">3 months</option>
                                <option value="6">6 months</option>
                                <option value="12">12 months</option>
                                <option value="24">24 months</option>
                                <option value="36">36 months</option>
                                <option value="60">60 months</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Calculating..."
                                : "Calculate My Savings"}
                        </button>
                    </form>

                    {error && (
                        <p className="whatif-error" role="alert">
                            {error}
                        </p>
                    )}
                </section>

                {result && (
                    <section
                        className="whatif-results"
                        aria-live="polite"
                    >
                        <h2>Your savings projection</h2>

                        <div className="whatif-result-card">
                            <p>Current monthly expenses</p>
                            <h3>
                                {formatMoney(result.currentMonthlyExpenses)}
                            </h3>
                        </div>

                        <div className="whatif-result-card">
                            <p>Projected monthly expenses</p>
                            <h3>
                                {formatMoney(result.projectedMonthlyExpenses)}
                            </h3>
                        </div>

                        <div className="whatif-result-card">
                            <p>
                                Potential savings over{" "}
                                {result.durationMonths} months
                            </p>
                            <h3>
                                {formatMoney(result.totalSavings)}
                            </h3>
                        </div>

                        <div className="whatif-result-card">
                            <p>Potential savings over 12 months</p>
                            <h3>
                                {formatMoney(result.annualSavings)}
                            </h3>
                        </div>

                        <p className="page-description">
                            These are estimates based on your selected
                            monthly reduction, assuming you maintain it
                            throughout the period. Actual savings may vary.
                        </p>
                    </section>
                )}
            </div>
        </section>
    );
}

export default WhatIf;