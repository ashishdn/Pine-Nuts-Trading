import { Suspense } from "react";
import DashboardShell from "../components/dashboard/dashboard-shell";
import { getMockData } from "../lib/mockData";
import { connection } from "next/server";

async function DashboardRequest() {
  await connection();
  return <DashboardShell initialData={getMockData()} />;
}

function DashboardLoading() {
  return (
    <main className="dashboard-main" aria-label="Loading dashboard">
      <div className="loading-heading">
        <span />
        <span />
        <span />
      </div>
      <div className="loading-metrics">
        {[0, 1, 2, 3].map((item) => <span key={item} />)}
      </div>
      <div className="loading-table" />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardRequest />
    </Suspense>
  );
}
