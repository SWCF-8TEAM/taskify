import AddFillo from "@/assets/icons/add-fillo.svg";
import { DeviceSize } from "@/styles/DeviceSize";
import styled from "styled-components";

const AddColumn = () => {
  return (
    <Container>
      <StyledAddFillo alt="add" width={16} height={16} />
    </Container>
  );
};

export default AddColumn;

const Container = styled.div`
  width: 2.2rem;
  height: 2.2rem;

  padding: 0.3rem;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  border-radius: 4px;
  background: var(--Grayfa);

  @media screen and (max-width: ${DeviceSize.mobile}) {
    width: 2rem;
    height: 2rem;

    padding: 0.27rem;
  }
`;

const StyledAddFillo = styled(AddFillo)`
  path {
    fill: var(--Main);
  }
`;
