"use client";

import React from "react";
import { useRouter } from "next/navigation";

type SortOption = "title" | "author" | "genre" | "price";

interface SortByDropdownProps {
  currentSortOption: SortOption;
}

const SortByDropdown: React.FC<SortByDropdownProps> = ({ currentSortOption }) => {
  const router = useRouter();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value as SortOption;
    router.push(`/?sort=${option}`);
  };

  return (
    <select
      value={currentSortOption}
      onChange={handleSortChange}
      className="border border-gray-300 p-2 rounded"
    >
      <option value="title">Sort by Title</option>
      <option value="author">Sort by Author</option>
      <option value="genre">Sort by Genre</option>
      <option value="price">Sort by Price</option>
    </select>
  );
};

export default SortByDropdown;
