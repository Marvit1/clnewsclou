"use client";
export const runtime = 'edge';

import CategoryNews from "@/components/CategoryNews";

const SportsPage = () => {
  return <CategoryNews categorySlug="sports" />;
};

export default SportsPage;
