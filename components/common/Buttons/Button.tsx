import AddBoxIcon from "@/assets/icons/add-box.svg";
import ArrowIcon from "@/assets/icons/arrow-forward.svg";
import CrownIcon from "@/assets/icons/crown.svg";
import AddColumn from "@/components/common/Chip/AddColumn";
import TYPES from "@/components/common/Buttons/ButtonStyles";
import { ReactNode } from "react";
import styled from "styled-components";

interface ButtonContentProps {
  type: keyof typeof TYPES;
  children?: ReactNode;
  disabled?: boolean;
  id?: number;
  color?: string;
  title?: string;
  createdByMe?: boolean;
  onClick?: () => void;
}

const ButtonContent = ({ type, children, id, title, color, createdByMe }: ButtonContentProps) => {
  switch (type) {
    case "addNewColumn":
    case "plus":
    case "newDashboard":
      return (
        <>
          <span>{children}</span>
          <AddColumn />
        </>
      );
    case "dashboardList":
      return (
        <>
          <StyledTitleWrapper>
            {color && <Color color={color} />}
            <div style={{ display: "flex", gap: "0.8rem", width: "85%" }}>
              {createdByMe && <CrownIcon />}
              {title && <StyledDashboardTitle>{title}</StyledDashboardTitle>}
            </div>
          </StyledTitleWrapper>
          <ArrowIcon />
        </>
      );
    case "invite":
      return (
        <>
          <StyledAddBoxIcon type={type} />
          <span>{children}</span>
        </>
      );
    default:
      return children;
  }
};

const Button = ({ type, children, disabled, id, title, color, createdByMe, onClick }: ButtonContentProps) => {
  return (
    <StyledButton type={type} disabled={disabled} onClick={onClick}>
      <ButtonContent type={type} children={children} id={id} title={title} color={color} createdByMe={createdByMe} />
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.button<ButtonContentProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  border: 1px solid var(--Grayd9);
  border-radius: 8px;
  background-color: var(--White);
  color: var(--Black33);
  font-weight: 500;

  ${({ type }) => TYPES[type]}
`;

const StyledAddBoxIcon = styled(AddBoxIcon)`
  path {
    fill: ${({ type }) => (type === "invite" ? "var(--White)" : "currentColor")};
  }
`;

const Color = styled.div<{ color: string }>`
  width: 0.8rem;
  height: 0.8rem;

  border-radius: 100%;
  background-color: ${(props) => props.color};
`;

const StyledTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;

  width: 90%;
`;

const StyledDashboardTitle = styled.span`
  width: 85%;
  height: 1.8rem;

  display: block;

  text-align: start;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    text-overflow: clip;
    overflow: auto;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;
