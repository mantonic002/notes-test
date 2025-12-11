import { Pagination } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

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

  return (
    <div className="d-flex justify-content-center mt-4">
      <Pagination>
        <Pagination.First
          as="button"
          onClick={(e) => {
            e.preventDefault();
            goToPage(1);
          }}
          disabled={currentPage === 1}
        />

        <Pagination.Prev
          as="button"
          onClick={(e) => {
            e.preventDefault();
            goToPage(currentPage - 1);
          }}
          disabled={currentPage === 1}
        />

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Pagination.Item
            key={page}
            as="button"
            active={page === currentPage}
            onClick={(e) => {
              e.preventDefault();
              goToPage(page);
            }}
          >
            {page}
          </Pagination.Item>
        ))}

        <Pagination.Next
          as="button"
          onClick={(e) => {
            e.preventDefault();
            goToPage(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
        />

        <Pagination.Last
          as="button"
          onClick={(e) => {
            e.preventDefault();
            goToPage(totalPages);
          }}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
}
