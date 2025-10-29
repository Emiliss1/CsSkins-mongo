import React, { useState } from "react";
import { useEffect } from "react";

export default function FetchData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/crates.json"
        );
        const data = await response.json();

        console.log(data);

        const selectedCasesIndex = [
          3, 4, 5, 6, 7, 11, 12, 18, 19, 20, 30, 39, 49, 51, 81, 112, 142, 145,
          173, 180, 208, 209, 221, 238, 245, 260, 275, 282, 297, 301, 304, 305,
          312, 320, 337, 352, 373, 389, 437, 438,
        ]; //selected cases from fetched api that will be in a case pool
        let selectedCases = [];

        selectedCasesIndex.forEach((item) => {
          selectedCases.push(data[item]);
        });

        setData(selectedCases);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCases();
  }, []);
  return data;
}
