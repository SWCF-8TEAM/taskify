import { putColumns } from "@/api/columns";
import Input from "@/components/Sign/SignInput/Input";
import ButtonSet from "@/components/common/Buttons/ButtonSet";
import { DeviceSize } from "@/styles/DeviceSize";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";

interface ModalProps {
  columnId: number;
  onClose?: () => void;
  onAdd?: () => void;
  closeModalFunc?: () => void;
  isTitleExist: (title: string) => boolean;
}

const ChangeColumnNameModal = ({ columnId, onClose, onAdd, closeModalFunc, isTitleExist }: ModalProps) => {
  const { control, handleSubmit, formState, setError } = useForm({
    defaultValues: { newTitle: "" },
    mode: "onBlur",
  });

  return (
    <Wrapper>
      <Title>컬럼 관리</Title>
      <form
        onSubmit={handleSubmit(async (data) => {
          if (isTitleExist(data.newTitle)) {
            setError("newTitle", { message: "이름이 중복되었습니다. 다시 입력해주세요!" });
            return;
          }

          const res = await putColumns({ title: data.newTitle, columnId: columnId, token: localStorage.getItem("accessToken") });
          if (res !== null && closeModalFunc) {
            closeModalFunc();
          }
        })}
      >
        <InputWrapper>
          <Controller
            control={control}
            name="newTitle"
            rules={{ required: "변경할 이름을 입력해주세요" }}
            render={({ field, fieldState }) => (
              <Input label="컬럼 이름" {...field} placeholder="이름을 입력하세요" hasError={Boolean(fieldState.error)} errorText={fieldState.error?.message} />
            )}
          />
        </InputWrapper>
        <ButtonWrapper>
          <ButtonSet type="modalSet" onClickLeft={onClose} onClickRight={onAdd} isDisabled={!formState.isValid}>
            변경
          </ButtonSet>
        </ButtonWrapper>
      </form>
    </Wrapper>
  );
};

export default ChangeColumnNameModal;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  width: 54rem;

  padding: 3.2rem 2.8rem 2.8rem 2.8rem;

  border-radius: 8px;
  background: var(--MainLight);

  @media (max-width: ${DeviceSize.mobile}) {
    width: 32.7rem;

    padding: 2.8rem 2rem 2.8rem 2rem;

    border-radius: 8px;
  }
`;

const Title = styled.div`
  font-size: 2.4rem;
  font-weight: 700;

  @media (max-width: ${DeviceSize.mobile}) {
    font-size: 2rem;
  }
`;

const InputWrapper = styled.div`
  margin-top: 3.2rem;
  margin-bottom: 2.8rem;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.8rem;

  @media (max-width: ${DeviceSize.mobile}) {
    margin-top: 2.4rem;
    margin-bottom: 2.4rem;
  }
`;

const NameType = styled.label`
  color: var(--Black33);

  font-size: 1.8rem;
  font-weight: 500;
`;

const NameInputBox = styled.input`
  width: 100%;
  height: 4.8rem;

  border: 1px solid var(--Grayd9);
  padding: 1.5rem 1.6rem 1.4rem 1.6rem;
  border-radius: 6px;

  font-size: 1.6rem;
  font-weight: 400;

  &:focus {
    outline: none;
    border-color: var(--Main);
  }

  @media (max-width: ${DeviceSize.mobile}) {
    width: 100%;
    height: 4.2rem;

    border-radius: 8px;
  }
`;

const ColorSelectorWrapper = styled.div`
  display: flex;
  justify-content: flex-start;

  margin-bottom: 2.8rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;