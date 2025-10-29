import React, { useState } from "react";
import { pagination } from "./pagination";

export function SearchFilter(value, data, type) {
  if (type === "search") {
    const handleSkinSearch = (value, data) => {
      const skinsData = data;

      const filteredSkins = skinsData.filter((skin) =>
        skin.name.toLowerCase().includes(value)
      );

      if (value.trim() === "") {
        return {
          skins: pagination(skinsData).pageItems,
          pages: pagination(skinsData).totalPages,
        };
      }
      console.log(filteredSkins);

      return {
        skins: pagination(filteredSkins).pageItems,
        pages: pagination(filteredSkins).totalPages,
      };
    };
    return handleSkinSearch(value, data);
  }

  if (type === "filter") {
    const handleRarityFilter = (rarity, data) => {
      const skinsData = data;
      console.log("dataa", data);

      const filteredSkins = skinsData.filter((skin) => skin.rarity === rarity);

      if (rarity === "All") {
        return {
          skins: pagination(data).pageItems,
          pages: pagination(data).totalPages,
        };
      }
      console.log(filteredSkins);

      return {
        skins: pagination(filteredSkins).pageItems,
        pages: pagination(filteredSkins).totalPages,
      };
    };
    return handleRarityFilter(value, data);
  }
}
