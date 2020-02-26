import styled, { css } from 'styled-components';

const Button = styled.button.attrs(props => ({
  type: 'submit',
  disabled: props.disabled,
  name: props.value,
}))`
  border: 1px solid #eee;
  padding: 0px;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 4px;
  width: 150px;
  height: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.3;
  }

  p {
    margin-left: 5px;
    font-weight: bold;
    color: #fff;
    pointer-events:none;
    cursor:default;
  }

  &:hover{
    opacity:0.8;
  }
  ${props =>
    props.name &&
    props.name === 'all' &&
    css`
      background: #117a8b;
    `}

    ${props =>
      props.name &&
      props.name === 'open' &&
      css`
        background: #d39e00;
      `}

    ${props =>
      props.name &&
      props.name === 'closed' &&
      css`
        background: #28a745;
      `}

      ${props =>
        props.name &&
        (props.name === 'prev' || props.name === 'next') &&
        css`
          background: #7159c1;
        `}
`;
export default Button;
