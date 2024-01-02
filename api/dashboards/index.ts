import instance from "@/api/axios";
import { ENDPOINTS } from "@/api/config";
import {
  Dashboard,
  DeleteDashboardInvitationsProps,
  DeleteDashboardProps,
  GetDashboardInvitationsData,
  GetDashboardInvitationsProps,
  GetDashboardListData,
  GetDashboardListProps,
  GetDashboardProps,
  PostDashboardInvitationsProps,
  PostDashboardProps,
  PutDashboardProps,
} from "@/api/dashboards/dashboards.types";
import { Invitation } from "@/api/invitations/invitations.types";

export const deleteDashboard = async ({ dashboardId, token }: DeleteDashboardProps) => {
  try {
    const res = await instance.delete(ENDPOINTS.DASHBOARDS.DELETE(dashboardId), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    console.error(error.response.data.message);
  }
};

export const deleteDashboardInvitations = async ({ dashboardId, invitationId, token }: DeleteDashboardInvitationsProps) => {
  try {
    await instance.delete(ENDPOINTS.DASHBOARDS.DELETE_INVITATION(dashboardId, invitationId), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    console.error(error.response.data.message);
  }
};

export const getDashboard = async ({ dashboardId, token }: GetDashboardProps): Promise<Dashboard | null> => {
  try {
    const res = await instance.get(ENDPOINTS.DASHBOARDS.GET(dashboardId), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    console.error(error.response.data.message);
    return null;
  }
};

export const getDashboardInvitations = async ({ dashboardId, size = 5, page, token }: GetDashboardInvitationsProps): Promise<GetDashboardInvitationsData | null> => {
  try {
    const res = await instance.get(ENDPOINTS.DASHBOARDS.GET_INVITATION(dashboardId), {
      params: {
        dashboardId,
        size,
        page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    console.error(error.response.data.message);
    return null;
  }
};

export const getDashboardList = async ({ navigationMethod, size, cursorId, page, token }: GetDashboardListProps): Promise<GetDashboardListData | null> => {
  try {
    const res = await instance.get(ENDPOINTS.DASHBOARDS.GET_LIST, {
      params: {
        navigationMethod,
        size,
        cursorId,
        page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    console.error(error.response.data.message);
    return null;
  }
};

export const postDashboard = async ({ token, title, color }: PostDashboardProps): Promise<Dashboard | null> => {
  try {
    const res = await instance.post(
      ENDPOINTS.DASHBOARDS.POST,
      {
        title,
        color,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error: any) {
    console.error(error.response.data.message);
    return null;
  }
};

export const postDashboardInvitations = async ({ email, dashboardId, token }: PostDashboardInvitationsProps): Promise<Invitation | null> => {
  try {
    const res = await instance.post(
      ENDPOINTS.DASHBOARDS.POST_INVITATION(dashboardId),
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error: any) {
    console.error(error.response.data.message);
    return null;
  }
};

export const putDashboard = async ({ dashboardId, token, title, color }: PutDashboardProps): Promise<Dashboard | null> => {
  try {
    const res = await instance.put(
      ENDPOINTS.DASHBOARDS.PUT(dashboardId),
      {
        title,
        color,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error: any) {
    console.error(error.response.data.message);
    return null;
  }
};
