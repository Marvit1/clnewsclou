import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  previousLabel: string;
  nextLabel: string;
  styles: {
    paginationContainer?: string;
    paginationButton?: string;
    prevButton?: string;
    nextButton?: string;
    pageButton?: string;
    pageButtonActive?: string;
    pageButtonInactive?: string;
  };
}

const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  previousLabel,
  nextLabel,
  styles,
}: CustomPaginationProps) => {
  const getPageNumbers = () => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const nums = new Set<number>();
    nums.add(1);
    nums.add(totalPages);

    if (currentPage <= 2 || currentPage >= totalPages - 1) {
      nums.add(2);
      nums.add(totalPages - 1);
    } else {
      nums.add(currentPage);
      // Ensure we add a next page if it's not the last one
      if (currentPage + 1 < totalPages) {
         nums.add(currentPage + 1);
      }
    }

    const sorted = Array.from(nums).sort((a, b) => a - b);
    const result: (number | string)[] = [];
    let prev = 0;
    
    for (const p of sorted) {
      if (prev > 0 && p - prev > 1) {
        result.push("...");
      }
      result.push(p);
      prev = p;
    }
    
    return result;
  };

  const pages = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className={styles.paginationContainer}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`${styles.paginationButton} ${styles.prevButton}`}
      >
        <ChevronLeft size={14} /> {previousLabel}
      </button>

      {pages.map((p, i) => (
        p === "..." ? (
            <span key={`ellipsis-${i}`} className={styles.pageButton} style={{ border: 'none', cursor: 'default', background: 'transparent' }}>...</span>
        ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`${styles.pageButton} ${
                p === currentPage ? styles.pageButtonActive : styles.pageButtonInactive
              }`}
            >
              {p}
            </button>
        )
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`${styles.paginationButton} ${styles.nextButton}`}
      >
        {nextLabel} <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default CustomPagination;
