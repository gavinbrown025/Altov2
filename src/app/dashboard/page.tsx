import { Suspense } from "react";

import DashboardLoading from "@/components/Dashboard/DashboardLoading";
import DashboardContent from "@/components/Dashboard/DashboardContent";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
