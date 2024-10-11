import React, { useEffect, useState } from "react";

const CommentComponent = (props) => {
  const { datahref } = props;
  const [width, setWidth] = useState(window.innerWidth < 1470 ? 1270 : 1640);

  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth < 1470) {
        setWidth(1270);
      } else {
        setWidth(1640);
      }

      // Render lại Facebook Comments
      if (window.FB) {
        window.FB.XFBML.parse();
      }
    };

    // Gọi hàm updateWidth ngay khi component được mount
    updateWidth();

    // Thêm sự kiện resize
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []); // Chỉ gọi khi component mount và unmount

  return (
    <div style={{ margin: "-10px -12px 0", marginTop: "70px" }}>
      <div
        className="fb-comments"
        data-href={datahref}
        data-width={width}
        data-numposts="5"
      ></div>
    </div>
  );
};

export default CommentComponent;
