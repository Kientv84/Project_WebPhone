import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";

const ButtonInputSearch = (props) => {
  const navigate = useNavigate();
  const {
    size,
    placeholder,
    textbutton,
    bordered,
    backgroundColorInput = "#fff",
    backgroundColorButton = "rgba(13, 129, 115, 0.82)",
    colorButton = "#fff",
    value, // Nhận giá trị của ô tìm kiếm từ props
    // onSearch,
  } = props;

  const handleSearch = () => {
    if (value) {
      // Điều hướng sang trang SearchProductPage với từ khóa tìm kiếm
      navigate(`/catalogsearch/result?q=${value}`);
    }
  };
  return (
    <div style={{ display: "flex", backgroundColor: "#fff" }}>
      <InputComponent
        size={size}
        bordered={bordered}
        placeholder={placeholder}
        style={{ backgroundColor: backgroundColorInput, borderRadius: "0px" }}
        {...props}
      />
      <ButtonComponent
        size={size}
        style={{
          backgroundColor: backgroundColorButton,
          border: !bordered && "none",
          borderRadius: "0px",
        }}
        icon={<SearchOutlined style={{ color: colorButton }} />}
        textbutton={textbutton}
        styletextbutton={{ color: colorButton }}
        onClick={handleSearch}
      />
    </div>
  );
};

export default ButtonInputSearch;
