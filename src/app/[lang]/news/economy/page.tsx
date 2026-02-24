"use client";
export const runtime = 'nodejs';

import CategoryNews from "@/components/CategoryNews";

const EconomyPage = () => {
  return <CategoryNews categorySlug="economy" />;
};

export default EconomyPage;
