import { atom } from "jotai";
import { Invitation } from "@/api/invitations/invitations.types";
import { DASHBOARD_COLOR } from "@/constants/ColorConstant";
import { Columns } from "@/api/columns/columns.types";
import { Card } from "@/api/cards/cards.types";
import { UserData } from "@/api/users/users.types";
import { Dashboard } from "@/api/dashboards/dashboards.types";
import { Member } from "@/api/members/members.types";

// 현재 활성화된 드롭다운의 식별자를 저장하는 아톰
export const activeDropdownAtom = atom<string | null>(null);

export const invitationsAtom = atom<Invitation[]>([]);
export const invitationsPageAtom = atom<Invitation[]>([]);

export const columnsAtom = atom<Columns[]>([]);
export const totalColumnsAtom = atom(0);

export const dashboardColorAtom = atom<string>(`${DASHBOARD_COLOR[0]}`);

export const cardsAtom = atom<{ [columnId: number]: Card[] }>({});

export const dashboardListAtom = atom<Dashboard | null>(null);

export const membersAtom = atom<Member[]>([]);

export const cardAtom = atom<Card>({
  id: 0,
  title: "string",
  description: "string",
  tags: [],
  dueDate: "string",
  assignee: {
    nickname: "string",
    id: 0,
  },
  imageUrl: "string",
  teamId: "string",
  dashboardId: 0,
  columnId: 0,
  createdAt: "string",
  updatedAt: "string",
});
export const isCardUpdatedAtom = atom<boolean>(false);

export const cardsTotalCountAtom = atom<{ [columnId: number]: number }>({});

export const commentScrollAtom = atom<boolean>(false);

export const dueDateAtom = atom<string>("");

export const cardImageAtom = atom<File | null>(null);

export const profileImageAtom = atom<File | null>(null);

export const cardAssigneeIdAtom = atom<number | null>(null);

export const tagAtom = atom<string[]>([]);

export const isOpenAtom = atom(false);

export const statusAtom = atom("로딩 중");

export const selectedIdAtom = atom<number | null>(null);

export const userProfileImageUrlAtom = atom<string>("");

export const userDataAtom = atom<UserData | null>(null);

export const isTagModifyAtom = atom<boolean>(false);

export const newDashboardAtom = atom<Dashboard | null>(null); //사아드메뉴, 대시보드리스트 연동
