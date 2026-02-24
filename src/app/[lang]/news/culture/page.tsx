"use client";
export const runtime = 'nodejs';

import CategoryNews from "@/components/CategoryNews";

const CulturePage = () => {
  return <CategoryNews categorySlug="culture" />;
};

export default CulturePage;
