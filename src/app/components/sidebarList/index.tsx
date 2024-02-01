import React from "react";

const SideBarList = () => {
  const list = [
    "perosnOne ",
    "personTwo",
    "persont three",
    "personTwo",
    "personTwo",
  ];
  return (
    <div style={{ width: "300px", height: "100%", backgroundColor: "red" }}>
      {list &&
        list.map((data) => {
          return <p style={{ marginTop: "50px" }}>{data}</p>;
        })}
    </div>
  );
};

export default SideBarList;
