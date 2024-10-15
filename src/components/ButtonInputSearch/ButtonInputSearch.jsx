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
    setSearch,
  } = props;

  const handleSearch = () => {
    if (value && value.trim()) {
      // Kiểm tra giá trị hợp lệ trước khi tìm kiếm
      navigate(`/catalogsearch/result?q=${encodeURIComponent(value.trim())}`);
      if (setSearch && value.trim() !== "") {
        setSearch(""); // Kiểm tra setSearch trước khi reset ô tìm kiếm
      }
    } else {
      // Nếu không có giá trị trong ô tìm kiếm, điều hướng đến trang kết quả trống
      navigate(`/catalogsearch/result?q=`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Kích hoạt tìm kiếm khi nhấn Enter
    }
  };

  return (
    <div style={{ display: "flex", backgroundColor: "#fff" }}>
      <InputComponent
        size={size}
        bordered={bordered}
        placeholder={placeholder}
        style={{ backgroundColor: backgroundColorInput, borderRadius: "0px" }}
        value={value}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
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
