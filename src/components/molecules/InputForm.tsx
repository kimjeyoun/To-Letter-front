import styled from "styled-components";
import Box from "./Box";
import Button from "./Button";

interface props {
  key: string;
  labelTitle: string;
  type: string;
  name: string;
  onChange: () => void;
  isExistButton?: boolean;
  buttonTitle?: string;
  onClick?: () => void;
}

export default function InputForm({
  key,
  labelTitle,
  type,
  name,
  onChange,
  isExistButton = false,
  buttonTitle = "",
  onClick = () => {},
}: props) {
  if (isExistButton) {
    return (
      <FormLabel key={key}>
        <Box $alignItems="center" $justifyContent="space-between">
          {labelTitle}
          <Button title={buttonTitle} onClick={onClick} />
        </Box>
        <FormInput type={type} name={name} onChange={onChange} />
      </FormLabel>
    );
  } else {
    return (
      <FormLabel key={key}>
        {labelTitle}
        <FormInput type={type} name={name} onChange={onChange} />
      </FormLabel>
    );
  }
}

const FormLabel = styled.label`
  display: flex;
  flex-direction: column;
  margin: 8px 0;
  width: 100%;
  color: #cecece;
`;
const FormInput = styled.input`
  border: none;
  background-color: transparent;
  border-bottom: 1px solid white;
  width: 100%;
  height: 28px;
  font-size: 20px;
  margin-top: 8px;
  color: #ffffff;
  &:focus {
    outline: none; /* 기본 outline 제거 */
    box-shadow: none; /* 기본 box-shadow 제거 */
  }
  &:-internal-autofill-selected {
    border: none;
    background-color: transparent;
    border-bottom: 1px solid white;
    width: 100%;
    height: 28px;
    font-size: 20px;
    margin-top: 8px;
    color: #ffffff;
  }
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    border: none;
    -webkit-text-fill-color: #ffffff !important;
    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
    background-color: transparent !important;
    transition: background-color 5000s ease-in-out 0s;
    border-bottom: 1px solid white;
  }
`;
