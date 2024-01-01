import { getDashboard } from "@/api/dashboards";
import { Dashboard } from "@/api/dashboards/dashboards.types";
import NavContainer from "@/components/common/Nav/NavContainer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DashboardNav = () => {
  const router = useRouter();
  const { boardid } = router.query;
  const [dashboard, setDashboard] = useState<Dashboard>();

  console.log(dashboard);
  useEffect(() => {
    if (!boardid) return;
    const loadDashboardData = async () => {
      const res = await getDashboard({ dashboardId: String(boardid), token: localStorage.getItem("accessToken") });
      if (res !== null) setDashboard(res);
    };
    loadDashboardData();
  }, [boardid]);

  return <>{dashboard && <NavContainer title={dashboard.title} $isDashboard={true} createdByMe={dashboard.createdByMe} />}</>;
};

export default DashboardNav;
