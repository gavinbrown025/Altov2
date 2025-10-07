import { Suspense } from "react";

import DashboardLoading from "@/components/Dashboard/DashboardLoading";
import DashboardContent from "@/components/Dashboard/DashboardContent";

export default function Dashboard() {
  return (
    <div className="p-4">
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
