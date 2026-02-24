import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./CalendarWidget.module.css";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CalendarWidget = () => {
  const [date, setDate] = useState(new Date());
  const today = new Date();

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setDate(new Date(year, month - 1, 1));
  const nextMonth = () => setDate(new Date(year, month + 1, 1));

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={prevMonth} className={styles.navButton}>
          <ChevronLeft size={16} />
        </button>
        <span className={styles.monthYear}>
          {MONTHS[month]} {year}
        </span>
        <button onClick={nextMonth} className={styles.navButton}>
          <ChevronRight size={16} />
        </button>
      </div>
      <div className={styles.grid}>
        {DAYS.map((d) => (
          <div key={d} className={styles.dayHeader}>
            {d}
          </div>
        ))}
        {cells.map((d, i) => (
          <div
            key={i}
            className={`${styles.cell} ${
              d === null
                ? ""
                : isToday(d)
                ? styles.today
                : styles.normalDay
            }`}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWidget;