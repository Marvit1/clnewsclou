"use client";
export const runtime = 'nodejs';

import CategoryNews from "@/components/CategoryNews";

const WorldPage = () => {
  return <CategoryNews categorySlug="world" />;
};

export default WorldPage;
