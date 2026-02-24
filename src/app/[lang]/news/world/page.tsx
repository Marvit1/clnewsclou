"use client";
export const runtime = 'edge';

import CategoryNews from "@/components/CategoryNews";

const WorldPage = () => {
  return <CategoryNews categorySlug="world" />;
};

export default WorldPage;
