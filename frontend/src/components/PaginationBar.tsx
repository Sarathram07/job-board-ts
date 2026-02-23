//import React from "react";

// -------------------- Types --------------------
type PageItem = number | "<" | ">";

type PaginationBarProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (args: number) => void;
};

type PageButtonProps = {
  page: PageItem;
  currentPage: number;
  onClick: () => void;
};

// -------------------- PaginationBar Component --------------------
function PaginationBar({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationBarProps) {
  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      className="pagination is-centered"
      role="navigation"
      aria-label="pagination"
    >
      <button
        className="pagination-previous"
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &#x25C0;
      </button>
      <button
        className="pagination-next"
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &#x25B6;
      </button>
      <ul className="pagination-list">
        {pages.map((page, index) => (
          <li key={index}>
            <PageButton
              page={page}
              currentPage={currentPage}
              onClick={() =>
                onPageChange(typeof page === "number" ? page : currentPage)
              }
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

// -------------------- PageButton Component --------------------
function PageButton({ page, currentPage, onClick }: PageButtonProps) {
  if (page === currentPage) {
    return (
      <button
        className="pagination-link is-current"
        aria-label={`Page ${page}`}
        aria-current="page"
      >
        {page}
      </button>
    );
  }

  if (page === "<" || page === ">") {
    return <span className="pagination-ellipsis">&hellip;</span>;
  }

  return (
    <button
      className="pagination-link"
      aria-label={`Go to page ${page}`}
      onClick={onClick}
    >
      {page}
    </button>
  );
}

// -------------------- Helper Functions --------------------
/**
 * Returns a list of pages to display in the pagination bar.
 * Can include special '<' or '>' indicators for skipped pages.
 */
function getVisiblePages(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return range(total);
  }
  if (current < 5) {
    return [...range(5), ">", total];
  }
  if (current > total - 4) {
    return [1, "<", ...range(5, total - 4)];
  }
  return [1, "<", current - 1, current, current + 1, ">", total];
}

/**
 * Generates a range of numbers: [start, start+1, ..., start+count-1]
 */
function range(count: number, start = 1): number[] {
  return Array.from({ length: count }, (_, i) => i + start);
}

export default PaginationBar;
