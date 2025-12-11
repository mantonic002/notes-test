import { useSearchParams } from "react-router-dom";
import "../../App.css";

interface Props {
  totalCount: number | null;
  pageSize?: number;
}

export default function CustomPagination({ totalCount, pageSize = 9 }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  if (totalCount === null) return null;

  const totalPages = Math.ceil(totalCount / pageSize);
  if (totalPages <= 1) return null;

  const currentPage = Math.max(
    1,
    parseInt(searchParams.get("page") || "1", 10),
  );

  const goToPage = (page: number) => {
    page = Math.min(Math.max(page, 1), totalPages); // clamp

    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    newParams.set("size", pageSize.toString());
    setSearchParams(newParams);
  };

  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, currentPage + 1);

  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);

  const showFirst = start > 1;
  const showLast = end < totalPages;

  return (
    <nav className="cp-wrapper" aria-label="Pagination">
      <button
        className="cp-btn cp-nav"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ‹ Prev
      </button>

      {showFirst && (
        <>
          <button className="cp-btn" onClick={() => goToPage(1)}>
            1
          </button>

          {start > 2 && <span className="cp-dots">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          className={`cp-btn ${p === currentPage ? "active" : ""}`}
          onClick={() => goToPage(p)}
          aria-current={p === currentPage ? "page" : undefined}
        >
          {p}
        </button>
      ))}

      {showLast && (
        <>
          {end < totalPages - 1 && <span className="cp-dots">…</span>}

          <button className="cp-btn" onClick={() => goToPage(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        className="cp-btn cp-nav"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next ›
      </button>
    </nav>
  );
}
