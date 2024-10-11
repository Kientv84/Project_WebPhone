import styled from "styled-components";

export const StyledComments = styled.div`
  width: ${(props) => (props.width ? props.width : "100%")};
  max-width: 1640; /* Chiều rộng tối đa */
  margin: 0 auto; /* Căn giữa */
`;
