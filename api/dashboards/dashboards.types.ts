import { Invitation } from "@/api/invitations/invitations.types";

export interface Dashboard {
  id: number;
  title: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  createdByMe: boolean;
  userId: number;
}

export interface GetDashboardListData {
  cursorId: number | null;
  totalCount: number;
  dashboards: Dashboard[];
}

export interface GetDashboardInvitationsData {
  totalCount: number;
  invitations: Invitation[];
}

export interface DeleteDashboardProps {
  dashboardId: number;
  token: string | null;
}

export interface DeleteDashboardInvitationsProps {
  dashboardId: number;
  invitationId: number;
  token: string | null;
}

export interface GetDashboardProps {
  dashboardId: number;
  token: string | null;
}

export interface GetDashboardInvitationsProps {
  dashboardId: number;
  page?: number;
  size?: number;
  token: string | null;
}

export interface GetDashboardListProps {
  navigationMethod: string;
  cursorId?: number | null;
  page?: number;
  size?: number;
  token: string | null;
}

export interface PostDashboardInvitationsProps {
  email: string;
  dashboardId: number;
  token: string | null;
}

export interface PutDashboardProps {
  dashboardId: number;
  token: string | null;
}

export interface PostDashboardProps {
  token: string | null;
  title: string;
  color: string;
}
