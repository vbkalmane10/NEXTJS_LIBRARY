"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const createPaginationItems = () => {
    const items = [];

    // Display first page
    if (totalPages > 1) {
      items.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-4 py-2 m-2 rounded-xl ${
            currentPage === 1 ? "bg-black text-white" : "bg-slate-100"
          }`}
          disabled={currentPage === 1}
        >
          1
        </button>
      );
    }

    if (currentPage > 3) {
      items.push(
        <span key="start-ellipsis" className="p-4 m-2 rounded-xl">
          ...
        </span>
      );
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      items.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`p-4 m-2 rounded-xl ${
            i === currentPage ? "bg-black text-white" : "bg-slate-100"
          }`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - 2) {
      items.push(
        <span key="end-ellipsis" className="p-4 m-2 rounded-xl">
          ...
        </span>
      );
    }

    if (totalPages > 1) {
      items.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`p-4 m-2 rounded-xl ${
            currentPage === totalPages
              ? "bg-black text-white"
              : "bg-slate-100"
          }`}
          disabled={currentPage === totalPages}
        >
          {totalPages}
        </button>
      );
    }

    return items;
  };

  return <div className="pagination flex">{createPaginationItems()}</div>;
}
