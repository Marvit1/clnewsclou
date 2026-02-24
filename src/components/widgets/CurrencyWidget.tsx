import { useState } from "react";
import { ArrowRightLeft, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./CurrencyWidget.module.css";

interface Rate {
  code: string;
  name: string;
  rate: number;
  change: number;
}

const rates: Rate[] = [
  { code: "USD", name: "US Dollar", rate: 1.0, change: 0 },
  { code: "EUR", name: "Euro", rate: 0.92, change: -0.3 },
  { code: "AMD", name: "Armenian Dram", rate: 387.5, change: 0.15 },
  { code: "RUB", name: "Russian Ruble", rate: 92.4, change: -0.8 },
  { code: "GBP", name: "British Pound", rate: 0.79, change: 0.12 },
];

const CurrencyWidget = () => {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("AMD");

  const fromRate = rates.find((r) => r.code === from)!;
  const toRate = rates.find((r) => r.code === to)!;
  const converted = ((parseFloat(amount) || 0) / fromRate.rate) * toRate.rate;

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <ArrowRightLeft size={16} style={{ color: "hsl(var(--accent))" }} />
        <span className={styles.title}>Currency</span>
      </div>

      {/* Converter */}
      <div className={styles.converterSpace}>
        <div className={styles.inputRow}>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={styles.input}
            placeholder="0"
          />
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={styles.select}
          >
            {rates.map((r) => (
              <option key={r.code} value={r.code}>{r.code}</option>
            ))}
          </select>
        </div>

        <div className={styles.swapButton}>
          <button
            onClick={swap}
            className={styles.swapBtn}
          >
            <ArrowRightLeft size={12} />
          </button>
        </div>

        <div className={styles.outputRow}>
          <div className={styles.outputBox}>
            <span className={styles.outputValue}>
              {converted.toFixed(2)}
            </span>
          </div>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={styles.select}
          >
            {rates.map((r) => (
              <option key={r.code} value={r.code}>{r.code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Rate Table */}
      <div className={styles.rateTable}>
        <div className={styles.rateList}>
          {rates.filter(r => r.code !== "USD").map((r) => (
            <div key={r.code} className={styles.rateRow}>
              <span className={styles.rateCode}>{r.code}/USD</span>
              <span className={styles.rateValue}>{r.rate.toFixed(2)}</span>
              <span className={`${styles.rateChange} ${r.change > 0 ? styles.positive : styles.negative}`}>
                {r.change > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {Math.abs(r.change)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencyWidget;