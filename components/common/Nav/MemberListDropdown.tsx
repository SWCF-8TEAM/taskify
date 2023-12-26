import styled from "styled-components";
import { DeviceSize } from "@/styles/DeviceSize";

interface Member {
  id: number;
  userId: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
}

interface MemberListProps {
  members: Member[];
}

const MemberListDropdown = ({ members }: MemberListProps) => {
  return (
    <Dropdown>
      {members.map((member) => (
        <Item>
          <Profile src={member.profileImageUrl || ""} alt={member.nickname} />
          <div key={member.id}>{member.nickname}</div>
        </Item>
      ))}
    </Dropdown>
  );
};

export default MemberListDropdown;

const Dropdown = styled.div`
  width: 16rem;

  border: 1px solid var(--Grayd9);
  border-radius: 16px;

  position: absolute;
  top: 8%;

  background-color: white;
`;

const Item = styled.div`
  padding: 2rem;
  border-bottom: 1px solid var(--Grayd9);

  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: var(--MainBG);

  color: var(--Black33);
  font-size: 1.6rem;
  font-weight: 400;

  &:first-child {
    border-radius: 15px 15px 0 0;
  }

  &:last-child {
    border-bottom: 0;
    border-radius: 0 0 15px 15px;
  }
`;

const Profile = styled.img`
  width: 3rem;
  height: 3rem;

  margin-right: 1.2rem;

  border-radius: 50%;

  object-fit: cover;

  @media screen and (max-width: ${DeviceSize.mobile}) {
    width: 3.4rem;
    height: 3.4rem;

    margin-right: 0.8rem;
  }
`;