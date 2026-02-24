"use client";
export const runtime = 'nodejs';

import CategoryNews from "@/components/CategoryNews";

const SportsPage = () => {
  return <CategoryNews categorySlug="sports" />;
};

export default SportsPage;
