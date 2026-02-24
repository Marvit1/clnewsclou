"use client";
export const runtime = 'edge';

import CategoryNews from "@/components/CategoryNews";

const PoliticsPage = () => {
  return <CategoryNews categorySlug="politics" />;
};

export default PoliticsPage;
