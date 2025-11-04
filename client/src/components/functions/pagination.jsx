import React from "react";

export function pagination(data, curPage = 0, itemsNumber = 16) {
  const itemsPerPage = window.innerWidth > 640 ? itemsNumber : itemsNumber / 2;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const pageItems = [];
  for (let i = curPage * itemsPerPage; i < itemsPerPage * (curPage + 1); i++) {
    if (data[i]) {
      pageItems.push(data?.[i]);
    }
  }

  return { pageItems, totalPages };
}
