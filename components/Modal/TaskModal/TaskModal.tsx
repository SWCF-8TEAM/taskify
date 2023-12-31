import { deleteCard } from "@/api/cards";
import { Card } from "@/api/cards/cards.types";
import Division from "@/assets/icons/category-division.svg";
import Close from "@/assets/icons/close.svg";
import Kebab from "@/assets/icons/kebab.svg";
import AlertModal from "@/components/Modal/AlertModal";
import EditTaskModal from "@/components/Modal/EditTaskModal";
import ModalWrapper from "@/components/Modal/ModalWrapper";
import TaskDropdown from "@/components/Modal/TaskDropdown";
import ColumnName from "@/components/common/Chip/ColumnName";
import Tag from "@/components/common/Chip/Tag";
import { useInfiniteScrollNavigator } from "@/hooks/useInfiniteScrollNavigator";
import { useModal } from "@/hooks/useModal";
import { cardAtom, cardsAtom, cardsTotalCountAtom, commentScrollAtom, isCardUpdatedAtom, statusAtom } from "@/states/atoms";
import { DeviceSize } from "@/styles/DeviceSize";
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowUpWideShort } from "react-icons/fa6";
import styled from "styled-components";
import NoProfileImage from "@/components/common/NoProfileImage/ProfileImage";
import Comments from "@/components/Modal/TaskModal/Comments";

const TaskModal: React.FC<{ cardData: Card; columnId: number; closeModalFunc: () => void; columnTitle: string }> = ({ cardData, columnId, closeModalFunc, columnTitle }) => {
  const { isModalOpen: isEditModalOpen, openModalFunc: openEditModal, closeModalFunc: closeEditModal } = useModal();
  const { isModalOpen: isDeleteModalOpen, openModalFunc: openDeleteModal, closeModalFunc: closeDeleteModal } = useModal();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const scrollContainerRef = useRef(null);
  const { startRef, endRef, handleScrollNavClick, isScrollingUp } = useInfiniteScrollNavigator(scrollContainerRef);
  const [cards, setCards] = useAtom(cardsAtom);
  const [card, setCard] = useAtom(cardAtom);
  const [updatedColumnTitle, setStatus] = useAtom(statusAtom);
  const [columnTitleData, setColumnTitle] = useState(columnTitle);
  const [isCardUpdated, setIsCardUpdated] = useAtom(isCardUpdatedAtom);
  const [isScrollActive, setIsScrollActive] = useAtom(commentScrollAtom);
  const [, setCardsTotalCount] = useAtom(cardsTotalCountAtom);

  const token = localStorage.getItem("accessToken");
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownDeleteClick = () => {
    openDeleteModal();
  };

  const handleDropdownEditClick = () => {
    openEditModal();
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  const handleConfirmDelete = async () => {
    await deleteCard({ cardId: card.id, token });
    setCards((prevCards) => {
      const updatedCards = prevCards[columnId].filter((v) => v.id !== card.id);
      return { ...prevCards, [columnId]: updatedCards };
    });
    setCardsTotalCount((prev) => {
      const updatedCardsCount = prev[columnId] - 1;
      return { ...prev, [columnId]: updatedCardsCount };
    });
    closeModalFunc();
  };

  const handleTaskModalClose = () => {
    if (isCardUpdated) {
      setCards((prev) => {
        const cardIndex = prev[columnId].findIndex((v) => v.id == card.id);
        const cardList = prev[columnId];
        cardList[cardIndex] = card;
        return { ...prev, [card.columnId]: cardList };
      });
      //status를 다른 칼럼으로 옮겼을 시 즉시 반영
      if (columnId !== card.columnId) {
        setCards((prev) => {
          //바뀐 컬럼에 우선 추가
          const cardList = [card, ...cards[card.columnId]];
          return { ...prev, [card.columnId]: cardList };
        });
        setCards((prev) => {
          const cardList = [...cards[columnId].filter((v) => v.id !== card.id)];
          return { ...prev, [columnId]: cardList };
        });
        //컬럼 개수 조정
        setCardsTotalCount((prev) => {
          return { ...prev, [columnId]: prev[columnId] - 1 };
        });
        setCardsTotalCount((prev) => {
          return { ...prev, [card.columnId]: prev[card.columnId] + 1 };
        });
      }
    }
    closeModalFunc();
    setIsScrollActive(false);
    setIsCardUpdated(false);
    setStatus("");
  };

  useEffect(() => {
    if (!isCardUpdated) setCard(cardData);
    else {
      setColumnTitle(updatedColumnTitle);
    }
  });

  return (
    <>
      <Wrapper ref={scrollContainerRef}>
        <div ref={startRef} />
        <TitleWrapper>
          <IconContainer>
            <KebabIconContainer tabIndex={0} onBlur={handleDropdownClose}>
              <Kebab alt="kebab" width={28} height={28} onClick={toggleDropdown} />
              {isDropdownOpen && <TaskDropdown onEdit={handleDropdownEditClick} onCreate={handleDropdownDeleteClick} />}
            </KebabIconContainer>
            <div style={{ cursor: "pointer" }}>
              <Close alt="close" width={28} height={28} onClick={handleTaskModalClose} />
            </div>
          </IconContainer>
        </TitleWrapper>
        <Container>
          <Title>{card.title}</Title>
          <ContactDeadLineWrapper>
            <Contact>담당자</Contact>
            <DeadLine>마감일</DeadLine>
            <ContactName>
              {card.assignee && (
                <ProfileImageWrapper>
                  {card.assignee.profileImageUrl ? (
                    <ProfileImage $image={card.assignee.profileImageUrl} />
                  ) : (
                    <NoProfileImageWrapper>
                      <NoProfileImage id={card.assignee.id} nickname={card.assignee.nickname} />
                    </NoProfileImageWrapper>
                  )}
                </ProfileImageWrapper>
              )}
              {card.assignee?.nickname}
            </ContactName>
            <DeadLineDate>{card.dueDate}</DeadLineDate>
          </ContactDeadLineWrapper>
          <CategoryWrapper>
            <ColumnName status={columnTitleData} />
            <DivisionWrapper>
              <Division alt="category-division" width={10} height={20} />
            </DivisionWrapper>
            <Tags>
              {card.tags.map((tag, idx) => (
                <Tag key={idx} tag={tag} />
              ))}
            </Tags>
          </CategoryWrapper>
          <Description>{card.description}</Description>
          {card.imageUrl && <Image src={card.imageUrl} alt="Task Image" />}
          <Comments cardData={cardData} />
          <div ref={endRef} />
          {isScrollActive && (
            <ScrollNavigateButton onClick={() => handleScrollNavClick()}>
              <ScrollNavigateIcon $isScrollingUp={isScrollingUp} />
            </ScrollNavigateButton>
          )}
        </Container>
      </Wrapper>
      {isEditModalOpen && (
        <ModalWrapper>
          <EditTaskModal
            card={card}
            onCancel={closeEditModal}
            onEdit={() => {
              closeEditModal();
            }}
          />
        </ModalWrapper>
      )}
      {isDeleteModalOpen && (
        <ModalWrapper>
          <AlertModal type="confirm" onCancel={closeDeleteModal} onConfirm={handleConfirmDelete} />
        </ModalWrapper>
      )}
    </>
  );
};

export default TaskModal;

const Wrapper = styled.div`
  width: 73rem;
  max-height: 76.3rem;
  overflow-y: auto;

  padding: 3.2rem 2.8rem 2.8rem 2.8rem;

  display: flex;
  flex-direction: column;

  border-radius: 8px;
  background: var(--White);

  @media (max-width: ${DeviceSize.mobile}) {
    width: 32.7rem;
    height: 70.8rem;

    padding: 2.8rem 2rem 2.8rem 2rem;

    border-radius: 8px;
  }
`;

const Container = styled.div`
  padding-top: 3rem;
`;

const TitleWrapper = styled.div`
  padding: 1.7rem 2.8rem 1.7rem;

  border-radius: 8px;

  position: fixed;
  top: 0;
  right: 0.5rem;
  left: 0;

  display: flex;
  justify-content: flex-end;

  background-color: var(--White);
`;

const Title = styled.div`
  font-size: 2.4rem;
  font-weight: 700;

  @media (max-width: ${DeviceSize.mobile}) {
    font-size: 2rem;
  }
`;

const IconContainer = styled.div`
  display: flex;

  gap: 2.4rem;
`;

const KebabIconContainer = styled.div`
  position: relative;
  align-items: center;
  gap: 2.4rem;

  cursor: pointer;
`;

const ContactDeadLineWrapper = styled.div`
  margin-top: 2.8rem;
  padding: 1.2rem 1.6rem 1rem 1.6rem;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);

  border-radius: 8px;
  border: 1px solid var(--Grayd9);

  @media (max-width: ${DeviceSize.mobile}) {
    margin-top: 1.6rem;
  }
`;

const Contact = styled.div`
  display: flex;
  justify-content: flex-start;
  flex: 1 1 50%;

  font-size: 1.2rem;
  font-weight: 600;

  @media (max-width: ${DeviceSize.mobile}) {
    font-size: 1rem;
  }
`;
const DeadLine = styled.div`
  display: flex;
  justify-content: flex-start;

  font-size: 1.4rem;
  font-weight: 600;
  flex: 1 1 50%;

  @media (max-width: ${DeviceSize.mobile}) {
    font-size: 1rem;
  }
`;
const ContactName = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 50%;

  font-size: 1.4rem;

  @media (max-width: ${DeviceSize.mobile}) {
    font-size: 1.2rem;
  }
`;

const ProfileImageWrapper = styled.div`
  width: 2.6rem;
  height: 2.6rem;

  margin-right: 0.8rem;
  overflow: hidden;
  border-radius: 50%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DeadLineDate = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 50%;

  font-size: 1.2rem;

  @media (max-width: ${DeviceSize.mobile}) {
    font-size: 1.2rem;
  }
`;

const CategoryWrapper = styled.div`
  margin-top: 2.4rem;

  display: flex;
  align-items: center;

  @media (max-width: ${DeviceSize.mobile}) {
    margin-top: 1.6rem;
  }
`;

const Tags = styled.div`
  max-width: 57rem;

  display: flex;
  gap: 0.6rem;

  overflow-x: hidden;

  &:hover {
    overflow-x: auto;
  }

  @media (max-width: ${DeviceSize.tablet}) {
    height: 50%;

    margin-right: 1.6rem;

    align-items: center;
    float: left;
  }
  @media (max-width: ${DeviceSize.mobile}) {
    height: auto;
  }
`;

const DivisionWrapper = styled.div`
  margin-left: 2rem;
  margin-right: 1rem;

  @media (max-width: ${DeviceSize.mobile}) {
    margin-left: 1.2rem;
    margin-right: 0.2rem;
  }
`;

const Description = styled.div`
  width: 100%;

  margin: 1.6rem auto;

  overflow-wrap: break-word;
  word-wrap: break-word;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 2.2rem;
  text-align: left;

  @media (max-width: ${DeviceSize.mobile}) {
    font-size: 1.2rem;
  }
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;

  margin-bottom: 2.4rem;

  @media (max-width: ${DeviceSize.mobile}) {
    margin-bottom: 1.9rem;
  }
`;

const ProfileImage = styled.div<{ $image: string }>`
  width: 2.7rem;
  height: 2.7rem;

  border-radius: 4.4rem;

  background-image: url(${(props) => props.$image});
  background-size: cover;
`;

const NoProfileImageWrapper = styled.div`
  width: 2.7rem;

  line-height: 2.7rem;
  font-size: 1.3rem;

  @media (max-width: ${DeviceSize.mobile}) {
    width: 2.4rem;

    line-height: 2.4rem;
  }
`;
const ScrollNavigateButton = styled.div`
  position: sticky;
  bottom: 0;
  left: 100rem;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 4rem;
  height: 4rem;

  border-radius: 1.5rem;

  cursor: pointer;

  background-color: var(--MainHover);
`;

const ScrollNavigateIcon = styled(FaArrowUpWideShort)<{ $isScrollingUp: boolean }>`
  width: 2.5rem;
  height: 3.5rem;

  ${(props) => props.$isScrollingUp && " transform: scaleY(-1)"};

  fill: var(--Main);
`;
