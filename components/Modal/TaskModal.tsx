import { Card } from "@/api/cards/cards.types";
import { getCard } from "@/api/cards/index";
import { Comment } from "@/api/comments/comments.types";
import { deleteComments, getComments, postComments, putComments } from "@/api/comments/index";
import Division from "@/assets/icons/category-division.svg";
import Close from "@/assets/icons/close.svg";
import Kebab from "@/assets/icons/kebab.svg";
import KebabModal from "@/components/Modal/KebabModal";
import ModalInput from "@/components/Modal/ModalInput/ModalInput";
import ColumnName from "@/components/common/Chip/ColumnName";
import Tag from "@/components/common/Chip/Tag";
import { useScroll } from "@/hooks/useScroll";
import { DeviceSize } from "@/styles/DeviceSize";
import { Z_INDEX } from "@/styles/ZindexStyles";
import { formatUpdatedAt } from "@/utils/FormatDate";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

// 임시 토큰
const TMP_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjA5LCJ0ZWFtSWQiOiIxLTA4IiwiaWF0IjoxNzAzNzI2OTIzLCJpc3MiOiJzcC10YXNraWZ5In0.YC0RG8_8Xoe8uEjPtqFEdCGilAlOonBG5x47GGJiOLc";

const TaskModal: React.FC = () => {
  const { observe, unobserve, targetRef, loadData } = useScroll();
  const [isKebabModalOpen, setIsKebabModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [cardData, setCardData] = useState<Card | null>(null);
  const [commentsData, setCommentsData] = useState<Comment[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [cursorId, setCursorId] = useState<number | null>(null);

  const handleKebabClick = () => {
    setIsKebabModalOpen(!isKebabModalOpen);
  };

  const handleCloseClick = () => {
    setIsModalOpen(false);
  };

  const loadCardData = async () => {
    const data = await getCard({
      cardId: 159,
      token: TMP_TOKEN,
    });
    if (data) {
      setCardData(data);
    }
  };

  const loadCommentsData = async () => {
    if (commentsData.length > 0 && cursorId === null) {
      unobserve();
      return;
    }
    try {
      const commentsData = await getComments({
        cardId: 159,
        size: 2,
        cursorId,
        token: TMP_TOKEN,
      });

      if (commentsData) {
        setCommentsData((prev) => {
          return [...prev, ...commentsData.comments];
        });
        setCursorId(commentsData.cursorId);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    }
    observe();
  };

  const submitComment = async (comment: string) => {
    await postComments({
      token: TMP_TOKEN,
      content: comment,
      cardId: 159,
      columnId: 1242,
      dashboardId: 394,
    });

    await loadCommentsData();
  };

  const handleEditClick = (commentId: number, currentContent: string) => {
    setIsEditing(true);
    setEditingCommentId(commentId);
    setNewCommentContent(currentContent);
  };

  const handleDeleteClick = async (commentId: number) => {
    await deleteComments({ commentId, token: TMP_TOKEN });
    await loadCommentsData();
  };

  const handleKeyDown = async (event: React.KeyboardEvent, commentId: number) => {
    if (event.key === "Enter") {
      event.preventDefault();
      await handleUpdateComment(commentId);
    }
    await loadCommentsData();
  };

  const handleUpdateComment = async (commentId: number) => {
    if (commentId) {
      await putComments({
        commentId: commentId,
        token: TMP_TOKEN,
        content: newCommentContent,
      });
      setIsEditing(false);
      setEditingCommentId(null);
      setNewCommentContent("");

      await loadCommentsData();
    }
  };

  useEffect(() => {
    loadCardData();
  }, []);

  useEffect(() => {
    loadCommentsData();
  }, [loadData]);

  if (!cardData) {
    return <div>Loading...</div>;
  }

  return (
    <Wrapper>
      <TitleWrapper>
        <Title>{cardData.title}</Title>
        <IconContainer>
          <KebabIconContainer>
            <Kebab alt="kebab" width={28} height={28} onClick={handleKebabClick} />
            {isKebabModalOpen && <StyledKebabModal />}
          </KebabIconContainer>
          <Close alt="close" width={28} height={28} onClick={handleCloseClick} />
        </IconContainer>
      </TitleWrapper>
      <ContactDeadLineWrapper>
        <Contact>담당자</Contact>
        <DeadLine>마감일</DeadLine>
        <ContactName>
          <ProfileImageWrapper>
            <img src={cardData.assignee.profileImageUrl} alt="Profile Image" />
          </ProfileImageWrapper>
          {cardData.assignee.nickname}
        </ContactName>
        <DeadLineDate>{cardData.dueDate}</DeadLineDate>
      </ContactDeadLineWrapper>
      <CategoryWrapper>
        <ColumnName status="To do" />
        <DivisionWrapper>
          <Division alt="category-division" width={10} height={20} />
        </DivisionWrapper>
        <Tags>
          {cardData.tags.map((tag, idx) => (
            <Tag key={idx} $bgColor="--Pinkf7" $textColor="--Pinkd5">
              {tag}
            </Tag>
          ))}
        </Tags>
      </CategoryWrapper>
      <Description>{cardData.description}</Description>
      <Image src={cardData.imageUrl} alt="Task Image" />
      <CommentContainer>
        <ModalInput label="댓글" $inputType="댓글" onSubmitComment={submitComment} />
        <CommentWrapper>
          {commentsData.map((comment) => (
            <CommentItem key={comment.id}>
              <LeftWrapper>
                <img src={comment.author.profileImageUrl} alt="nickname" />
              </LeftWrapper>
              <RightWrapper>
                <InfoWrapper>
                  {comment.author.nickname}
                  <CommentDate>{formatUpdatedAt(comment.updatedAt)}</CommentDate>
                </InfoWrapper>
                {isEditing && editingCommentId === comment.id ? (
                  <input type="text" value={newCommentContent} onChange={(e) => setNewCommentContent(e.target.value)} onKeyDown={(e) => handleKeyDown(e, comment.id)} />
                ) : (
                  <CommentContent>{comment.content}</CommentContent>
                )}
                <FunctionWrapper>
                  <Edit onClick={() => handleEditClick(comment.id, comment.content)}>수정</Edit>
                  <Delete onClick={() => handleDeleteClick(comment.id)}>삭제</Delete>
                </FunctionWrapper>
              </RightWrapper>
            </CommentItem>
          ))}
          <div ref={targetRef}></div>
        </CommentWrapper>
      </CommentContainer>
    </Wrapper>
  );
};

export default TaskModal;

const Wrapper = styled.div`
  width: 73rem;
  height: 76.3rem;
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

const TitleWrapper = styled.div`
  width: 100%;
  height: 8.5rem;

  display: flex;
  justify-content: space-between;
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
`;

const StyledKebabModal = styled(KebabModal)`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: ${Z_INDEX.TaskModal_StyledKebabModal};
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
  display: flex;

  gap: 0.6rem;

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

const CommentContainer = styled.div`
  position: sticky;
  top: 8.5rem;
  z-index: 10;
  background: var(--White);
`;

const CommentWrapper = styled.div`
  margin-top: 1.6rem;
`;

const LeftWrapper = styled.div`
  display: flex;
  align-items: top;

  img {
    width: 3.2rem;
    height: 3.2rem;

    margin-right: 1rem;

    border-radius: 50%;
  }
`;

const RightWrapper = styled.div``;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: row;

  gap: 0.8rem;

  font-size: 1.4rem;

  @media (max-width: ${DeviceSize.mobile}) {
    font-size: 1.2rem;
  }
`;

const CommentDate = styled.div`
  display: flex;
  align-items: center;

  font-size: 1.2rem;

  @media (max-width: ${DeviceSize.mobile}) {
    font-size: 1rem;
  }
`;

const CommentItem = styled.div`
  display: flex;
  flex-direction: row;

  padding: 0.8rem;
  margin-bottom: 0.8rem;

  font-size: 1.4rem;

  @media (max-width: ${DeviceSize.mobile}) {
    font-size: 1.2rem;
  }
`;

const CommentContent = styled.div`
  margin: 0.6rem 0 1.2rem 0;

  display: flex;
  justify-content: flex-start;
`;

const FunctionWrapper = styled.div`
  display: flex;
  flex-direction: row;

  gap: 1.2rem;
`;

const Edit = styled.button`
  color: var(--Gray9f);
  font-size: 1.2rem;
  text-decoration-line: underline;

  @media (max-width: ${DeviceSize.mobile}) {
    font-size: 1rem;
  }
`;

const Delete = styled.button`
  color: var(--Gray9f);
  font-size: 1.2rem;
  text-decoration-line: underline;

  @media (max-width: ${DeviceSize.mobile}) {
    font-size: 1rem;
  }
`;
