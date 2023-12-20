import styled from "styled-components";
import { DeviceSize } from "@/styles/DeviceSize";
import ButtonSet from "@/components/ButtonSet/ButtonSet";
import Button from "@/components/button/Button";

interface Invitation {
  id: number;
  inviterUserId: number;
  teamId: string;
  dashboard: {
    title: string;
    id: number;
  };
  invitee: {
    nickname: string;
    id: number;
  };
  inviteAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface InvitationsListProps {
  invitations: Invitation[];
  totalCount: number;
  currentPage: number;
}

function InvitationHistory({ invitations, totalCount, currentPage }: InvitationsListProps) {
  return (
    <Container>
      <Header>
        <Title>초대 내역</Title>
        <PageInfo>
          {totalCount} 페이지 중 {currentPage}
        </PageInfo>
        <ButtonInfo>
          <PageButton type="forwardAndBackward" size="S" isDisabled={true} />
        </ButtonInfo>
        <InviteButton type="invite" size="S" children="초대하기" />
        <EmailList>이메일</EmailList>
      </Header>
      {invitations.map((invitation) => (
        <InvitationItem key={invitation.id}>
          <Email>{invitation.invitee.nickname}</Email>
          <Button type="delete" size="S" children="취소" />
        </InvitationItem>
      ))}
    </Container>
  );
}

const Container = styled.div`
  width: 62rem;

  padding: 2.5rem;

  border-radius: 8px;
  background: var(--White);

  @media screen and (max-width: ${DeviceSize.tablet}) {
    width: 54.4rem;
  }

  @media screen and (max-width: ${DeviceSize.mobile}) {
    width: 28.4rem;

    padding: 2rem;
  }
`;

const Header = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto auto auto;
  gap: 1.6rem;

  @media screen and (max-width: ${DeviceSize.mobile}) {
    row-gap: 1.2rem;
    column-gap: 0;
  }
`;

const Title = styled.h1`
  font-size: 2.4rem;

  @media screen and (max-width: ${DeviceSize.mobile}) {
    font-size: 2rem;
  }
`;

const PageInfo = styled.h3`
  color: var(--Black20);
  font-size: 1.4rem;
  font-weight: 400;

  @media screen and (max-width: ${DeviceSize.mobile}) {
    font-size: 1.2rem;
  }
`;

const ButtonInfo = styled.h3`
  display: flex;
  justify-content: flex-end;
`;

const PageButton = styled(ButtonSet)`
  @media screen and (max-width: ${DeviceSize.mobile}) {
    margin-left: auto;
  }
`;

const InviteButton = styled(Button)`
  @media screen and (max-width: ${DeviceSize.mobile}) {
    grid-column: 3;
  }
`;

const EmailList = styled.h3`
  margin-top: 0.8rem;
  margin-bottom: 1.3rem;

  color: var(--Gray40);
  font-size: 1.6rem;
  font-weight: 400;

  @media screen and (max-width: ${DeviceSize.mobile}) {
    margin-top: 0;
    margin-bottom: 0;

    grid-column: 1;
    grid-row: 2;

    font-size: 1.4rem;
  }
`;

const InvitationItem = styled.div`
  padding: 1.6rem 0;

  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px solid var(--Gray20);

  &:last-child {
    border-bottom: 0;
  }

  @media screen and (max-width: ${DeviceSize.mobile}) {
    padding: 1.2rem 0;
  }
`;

const Email = styled.div`
  color: var(--Black20);
  font-size: 1.6rem;
  font-weight: 400;

  @media screen and (max-width: ${DeviceSize.mobile}) {
    font-size: 1.4rem;
  }
`;

export default InvitationHistory;