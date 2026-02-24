"use client";
export const runtime = 'edge';

import CategoryNews from "@/components/CategoryNews";

const LawPage = () => {
    return <CategoryNews categorySlug="law" />;
};

export default LawPage;
