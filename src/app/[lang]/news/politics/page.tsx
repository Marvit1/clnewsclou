"use client";
export const runtime = 'nodejs';

import CategoryNews from "@/components/CategoryNews";

const PoliticsPage = () => {
  return <CategoryNews categorySlug="politics" />;
};

export default PoliticsPage;
