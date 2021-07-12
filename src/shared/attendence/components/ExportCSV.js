import React, { useContext } from "react";

import * as FileSaver from "file-saver";

import * as XLSX from "xlsx";
import Button from "../../components/FormElements/Button";
import { AuthContext } from "../../context/auth-context";

export const ExportCSV = ({ csvData, fileName }) => {
  const auth = useContext(AuthContext);
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

  const fileExtension = ".xlsx";

  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const data = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(data, fileName + fileExtension);
    // auth.logout();
  };

  return (
    <Button onClick={(e) => exportToCSV(csvData, fileName)}>Export</Button>
  );
};
