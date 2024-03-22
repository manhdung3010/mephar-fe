import { columnFormat, columnWidth, formats, styles } from "./config";
import ExcelJS from "exceljs";
import moment from "moment";
import fs from "file-saver";
import { getCharByCode, removeAccents } from "@/helpers";
// import { getCharByCode, removeAccents } from "utils/common";

const getRowData = {
  array: (item) => {
    return item;
  },
  object: (item, mapping) => {
    return mapping.map((field) => item[field]);
  },
};

export const worksheetAddRow = (
  worksheet: ExcelJS.Worksheet,
  data: any[],
  index?: any,
  isHorizontal?: boolean
) => {
  let row: any = null;
  if (index === null || isNaN(index)) {
    row = worksheet.addRow(data);
  } else {
    row = worksheet.insertRow(index, data);
  }
  row.font = styles.font;
  if (isHorizontal) {
    row.horizontal = true;
  }
  return row;
};

export const excelEditCell = (cell, data = {}) => {
  Object.keys(data).forEach((key) => {
    if (data[key].constructor === {}.constructor) {
      cell[key] = { ...cell[key], ...data[key] };
    } else {
      cell[key] = data[key];
    }
  });
  return cell;
};

const createHeaderFooter = (
  worksheet: ExcelJS.Worksheet,
  currentRowIndex?: number,
  headerFooter?: any,
  format?: any,
  isBorder?: boolean,
  isBold?: boolean,
  isHorizontal?: boolean,
  isFillYellow?: boolean,
  checkNumberNegative?: boolean
) => {
  const rows: any = [];
  headerFooter.forEach((row) => {
    rows.push(worksheetAddRow(worksheet, row, null, true));
  });
  rows.forEach((row, rowIdx) => {
    const curRow = currentRowIndex + rowIdx + 1;
    const rowFormat = format[rowIdx] || [];
    row.eachCell((cell, cellIdx) => {
      if (cell.value !== "") {
        cell.alignment = { wrapText: true, vertical: "top", ...cell.alignment };
      }

      if (isBorder === true) {
        cell.border = styles.fullBorder;
      }

      if (isBold === true) {
        cell.font = { ...styles.font, bold: true };
      }

      if (row.horizontal && isHorizontal) {
        cell.alignment = {
          horizontal: "center",
          ...cell.alignment,
          vertical: "middle",
        };
      }

      if (isFillYellow) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FFFFFF00",
          },
          bgColor: {
            argb: "FFFF0000",
          },
        };
      }

      if (typeof cell.value === "number") {
        cell.alignment = { ...cell.alignment, horizontal: "right" };
        cell.numFmt = formats.currency;
      }

      if (
        checkNumberNegative &&
        typeof cell.value === "number" &&
        cell.value < 0
      ) {
        cell.value = Math.abs(cell.value);
        cell.font = { ...cell.font, color: { argb: "ffff0000" } };
      }

      const cellFormat = rowFormat[cellIdx - 1] || {};
      Object.keys(cellFormat).forEach((k) => {
        const v = cellFormat[k];
        switch (k) {
          case "merge":
            const mergeRow = v.row || 1;
            const mergeCol = v.col || 1;
            worksheet.mergeCells(
              curRow,
              cellIdx,
              curRow + mergeRow - 1,
              cellIdx + mergeCol - 1
            );
            break;
          case "fontBold":
            cell.font = { ...cell.font, bold: v };
            break;
          case "fontSize":
            cell.font = { ...cell.font, size: v };
            break;
          case "alignment":
            cell.alignment = { ...cell.alignment, horizontal: v };
            break;
          case "fontItalic":
            cell.font = { ...cell.font, italic: v };
            break;
          default:
            cell[k] = v;
            break;
        }
      });
    });
  });
  return rows;
};

const IntStream = (function () {
  function range(start, end, numbers = []) {
    if (start === end) {
      return numbers;
    }
    return range(start + 1, end, numbers.concat(start));
  }

  return {
    range,
  };
})();

export const addRow = (ws, rowData, widths, options) => {
  const rowValues: any = [];
  if (widths === undefined) widths = rowData.map(() => 1);
  if (options === undefined) options = [];
  let pos = 1;
  for (let i = 0; i < rowData.length; i++) {
    rowValues[pos] = rowData[i];
    pos += widths[i];
  }
  const row: any = worksheetAddRow(ws, rowValues);

  const address = row.getCell(1)._address;
  const rowIdx = address.slice(1, address.length);
  let letter = "A";

  for (let i = 0; i < rowData.length; ++i) {
    const cell = ws.getCell(`${letter}${rowIdx}`);
    for (const key in options[i]) {
      if (key === "style") {
        cell.style = {
          ...cell.style,
          ...options[i][key],
        };
      } else {
        cell[key] = options[i][key];
      }
    }

    ws.mergeCells(
      `${letter}${rowIdx}:${getCharByCode(letter, widths[i] - 1)}${rowIdx}`
    );
    letter = getCharByCode(letter, widths[i]);
  }
};

export async function ExportExcel(
  userOptions,
  drug_store?: any,
  name?: string
) {
  const options = {
    title: "",
    titleExtra: [],
    titleExtraFormat: [],
    fileName: "",
    infoHeader: [],
    infoHeaderCustom: [],
    infoHeaderCustomFormat: [],
    header: [],
    headerExtra: [],
    footer: [],
    headerFormat: [],
    footerFormat: [],
    data: [],
    dataFormat: [],
    dataExtra: [],
    mapping: [],
    format: [],
    footerBorder: true,
    footerBold: true,
    footerAlignment: false,
    formatMap: {},
    columnsWidth: [],
    generateInfo: true,
    generateSign: true,
    isFormImport: false,
    dropdownData: null,
    checkNumberNegative: false,
    callback: (f) => f,
    ...userOptions,
  };

  options.isMergedInfoHeader =
    userOptions.isMergedInfoHeader === undefined ||
    userOptions.isMergedInfoHeader === null ||
    userOptions.isMergedInfoHeader === true;

  if (options.header.length && Array.isArray(options.header[0]) === false) {
    options.header = [options.header];
  }
  if (options.footer.length && Array.isArray(options.footer[0]) === false) {
    options.footer = [options.footer];
  }

  const defaultInfo = options.generateInfo
    ? [
        ["Nhà thuốc:", options.info?.drug_store.name ?? drug_store?.name],
        ["Địa chỉ:", options.info?.drug_store.address ?? drug_store?.address],
        ["Thời gian xuất:", moment().format("DD/MM/YYYY HH:mm:ss")],
        ["Người xuất:", options.info?.name ?? name],
      ]
    : [];
  const info = [...defaultInfo, ...options.infoHeader];
  options.formatMap = {
    ...columnFormat,
    ...options.formatMap,
  };

  if (options.header.length > 0) {
    options.header[options.header.length - 1].forEach((item, index) => {
      let itemName = "";
      if (typeof item === "object" && !Array.isArray(item) && item !== null) {
        itemName = item.name;
      } else {
        itemName = item;
      }

      let key =
        item === ""
          ? removeAccents(options.header[0][index])
          : removeAccents(itemName);
      key = key.toLowerCase();
      if (options.columnsWidth.length - 1 < index) {
        options.columnsWidth.push(null);
      }
      if (!options.columnsWidth[index]) {
        options.columnsWidth[index] = columnWidth[key];
      }
      if (options.format.length - 1 < index) {
        options.format.push(null);
      }
      if (!options.format[index]) {
        options.format[index] = options.formatMap[key];
      }
    });
  }
  const workbook = new ExcelJS.Workbook();

  workbook.creator =
    process.env.APP_TYPE === "GDP" ? "SPHACY GDP" : "SPHACY GPP";
  workbook.created = new Date();
  workbook.calcProperties.fullCalcOnLoad = true;

  const worksheet = workbook.addWorksheet(options.fileName || options.title);
  let curRowIdx = 0;
  // add row and formatting
  if (options.title) {
    const titleRow: any = worksheetAddRow(worksheet, [options.title]);
    curRowIdx++;
    // titleRow.getCell(1).value = options.title;
    worksheet.getCell("A1").font = {
      ...titleRow.font,
      underline: "double",
      bold: true,
      size: 14,
    };
  }
  const infoHeaderCustomRows = createHeaderFooter(
    worksheet,
    curRowIdx,
    options.infoHeaderCustom,
    options.infoHeaderCustomFormat,
    false,
    false,
    false,
    false
  );
  curRowIdx += infoHeaderCustomRows.length;

  info.forEach((rowData) => {
    const row: any = worksheetAddRow(worksheet, rowData);
    row.eachCell((cell) => {
      cell.alignment = { wrapText: true, vertical: "top" };
    });
    curRowIdx++;
  });

  worksheetAddRow(worksheet, []);
  curRowIdx++;
  worksheetAddRow(worksheet, []);
  curRowIdx++;

  const titleExtraRows = createHeaderFooter(
    worksheet,
    curRowIdx,
    options.titleExtra,
    options.titleExtraFormat,
    false,
    true,
    true,
    false
  );
  curRowIdx += titleExtraRows.length;

  // header row
  if (options.header && options.header.length > 0) {
    options.header[options.header.length - 1] = options.header[
      options.header.length - 1
    ].map((item) => {
      let itemName = "";
      if (typeof item === "object" && !Array.isArray(item) && item !== null) {
        itemName = item.name;
      } else {
        itemName = item;
      }
      return itemName;
    });
    const headerRows = createHeaderFooter(
      worksheet,
      curRowIdx,
      options.header,
      options.headerFormat,
      true,
      true,
      true
    );
    curRowIdx += headerRows.length;
  }

  const headerExtraRows = createHeaderFooter(
    worksheet,
    curRowIdx,
    options.headerExtra,
    [],
    true,
    true,
    true,
    true,
    true
  );
  curRowIdx += headerExtraRows.length;

  // data row
  let rowDataType = "object";
  if (Array.isArray(options.data[0])) {
    rowDataType = "array";
  }
  const colCount = worksheet.columnCount;
  if (options.title) {
    worksheet.mergeCells(1, 1, 1, colCount);
  }
  if (options.generateInfo || info) {
    if (options.isMergedInfoHeader) {
      for (let i = 2; i <= info.length + 1; i++) {
        worksheet.mergeCells(i, 2, i, colCount);
      }
    }
  }
  let validation = {};
  if (options.isFormImport) {
    const { group, category, unit } = options.dropdownData;
    const errStyle = {
      dropdown: {
        type: "list",
        allowBlank: true,
        showErrorMessage: true,
        errorStyle: "error",
        errorTitle: "Lỗi",
      },
      currentCost: {
        type: "decimal",
        operator: "greaterThanOrEqual",
        allowBlank: true,
        showErrorMessage: true,
        errorStyle: "error",
        errorTitle: "Lỗi",
        formulae: [0],
      },
      name: {
        type: "textLength",
        operator: "greaterThan",
        showErrorMessage: true,
        allowBlank: false,
        formulae: [0],
        errorStyle: "error",
        errorTitle: "Lỗi",
      },
    };
    const errMSG = {
      dropdown: {
        error: "Vui lòng chọn theo danh sách có sẵn",
      },
      name: {
        error: "Chỉnh sửa tên thuốc không được nhỏ hơn 1 ký tự",
      },
      currentCost: {
        error: "Giá bán lớn hơn hoặc bằng 0",
      },
    };
    validation = {
      category: {
        formulae: [`$AI$5:$AI$${5 + category.length - 1}`],
        ...errStyle.dropdown,
        ...errMSG.dropdown,
      },
      group: {
        formulae: [`$AJ$5:$AJ$${5 + group.length - 1}`],
        ...errMSG.dropdown,
        ...errStyle.dropdown,
      },
      unit: {
        formulae: [`$AK$5:$AK$${5 + unit.length - 1}`],
        ...errMSG.dropdown,
        ...errStyle.dropdown,
      },
      active: {
        formulae: [`$AL$5:$AL$6`],
        ...errMSG.dropdown,
        ...errStyle.dropdown,
      },
      currentCost: {
        ...errMSG.currentCost,
        ...errStyle.currentCost,
      },
      name: {
        ...errStyle.name,
      },
    };
  }
  options.data.forEach((item, idx) => {
    const rowData = getRowData[rowDataType](item, options.mapping);
    if (options.isFormImport) {
      let subUnitIndex = 15;
      if (rowData[15]) {
        const otherUnits = JSON.parse(rowData[15]);

        (otherUnits || []).map((otherUnit) => {
          rowData[subUnitIndex++] = otherUnit.name;
          rowData[subUnitIndex++] = +otherUnit.exchange;
          rowData[subUnitIndex++] = +otherUnit.out_price;
        });
      }
      IntStream.range(subUnitIndex, 30).forEach((idxx) => {
        rowData[idxx] = "";
      });
    }

    const row: any = worksheetAddRow(
      worksheet,
      rowData.map((data) => {
        if (data instanceof Date) {
          return moment(data).utcOffset(0, true).toDate();
        }

        if (data === null || data === undefined) {
          return "";
        }

        return data;
      })
    );
    curRowIdx++;
    let isDQG = false;
    if (
      options.isFormImport &&
      row.values.length &&
      row.values[1].toLowerCase().indexOf("dqg") > -1
    )
      isDQG = true;

    const rowFormat = options.dataFormat[idx] || [];
    row.eachCell((cell, index) => {
      if (options.isFormImport) {
        if (index === 1) {
          cell.fill = styles.fillCellForm;
          cell.protection = styles.protection.locked;
        } else cell.protection = styles.protection.unlocked;

        if (index === 3) cell.dataValidation = validation["name"];
        if (index === 4) cell.dataValidation = validation["category"];
        if (index === 5) cell.dataValidation = validation["group"];
        if (index === 12) cell.dataValidation = validation["unit"];
        if (index === 13) cell.dataValidation = validation["currentCost"];
        if (index === 14) cell.dataValidation = validation["active"];
        if (index === 16) cell.dataValidation = validation["unit"];
        if (index === 19) cell.dataValidation = validation["unit"];
        if (index === 22) cell.dataValidation = validation["unit"];
        if (index === 25) cell.dataValidation = validation["unit"];
        if (index === 28) cell.dataValidation = validation["unit"];
        if (index === 3 || (6 <= index && index <= 12)) {
          if (isDQG) {
            cell.fill = styles.fillCellForm;
            cell.protection = styles.protection.locked;
          }
        }
      }
      //End handle validation eachCell isFormImport
      cell.border = styles.fullBorder;
      cell.alignment = { wrapText: true, vertical: "top" };
      if (options.format[index - 1]) {
        cell.numFmt = columnFormat[options.format[index - 1]];
      }
      if (
        options.checkNumberNegative &&
        typeof cell.value === "number" &&
        cell.value < 0
      ) {
        cell.value = Math.abs(cell.value);
        cell.font = { ...cell.font, color: { argb: "ffff0000" } };
      }
      if (options.dataFormat && options.dataFormat.length > 0) {
        const cellFormat = rowFormat[index - 1] || {};
        Object.keys(cellFormat).forEach((k) => {
          const v = cellFormat[k];
          if (k === "merge") {
            const mergeRow = v.row || 1;
            const mergeCol = v.col || 1;
            worksheet.mergeCells(
              curRowIdx,
              index,
              curRowIdx + mergeRow - 1,
              index + mergeCol - 1
            );
          } else if (k === "fontBold") {
            cell.font = { ...cell.font, bold: v };
          } else if (k === "fontSize") {
            cell.font = { ...cell.font, size: v };
          } else {
            cell[k] = v;
          }
        });
      }
    });
  });

  // add row to create new drug (formImport)
  if (options.isFormImport) {
    [...Array(2000)].forEach(() => {
      const row: any = worksheetAddRow(
        worksheet,
        [...Array(options.header[0].length)].map(() => "")
      );
      row.eachCell((cell, index) => {
        cell.value = null;
        cell.protection = styles.protection.unlocked;
        if (index === 4) cell.dataValidation = validation["category"];
        if (index === 5) cell.dataValidation = validation["group"];
        if (index === 12) cell.dataValidation = validation["unit"];
        if (index === 13) cell.dataValidation = validation["currentCost"];
        if (index === 14) cell.dataValidation = validation["active"];
        if (index === 16) cell.dataValidation = validation["unit"];
        if (index === 19) cell.dataValidation = validation["unit"];
        if (index === 22) cell.dataValidation = validation["unit"];
        if (index === 25) cell.dataValidation = validation["unit"];
        if (index === 28) cell.dataValidation = validation["unit"];

        cell.border = styles.fullBorder;
        cell.alignment = { wrapText: true, vertical: "top" };
        if (options.format[index - 1]) {
          cell.numFmt = columnFormat[options.format[index - 1]];
        }
      });
    });
  }
  const dataExtraRows = createHeaderFooter(
    worksheet,
    curRowIdx,
    options.dataExtra,
    [],
    true,
    true,
    true,
    true,
    true
  );
  curRowIdx += dataExtraRows.length;

  // footer row
  console.log(options.footer);
  const footerRows = createHeaderFooter(
    worksheet,
    curRowIdx,
    options.footer,
    options.footerFormat,
    options.footerBorder,
    options.footerBold,
    options.footerAlignment
  );
  curRowIdx += footerRows.length;

  options.columnsWidth.forEach((item, index) => {
    if (item) {
      worksheet.getColumn(index + 1).width = item;
    }
  });
  if ((worksheet.getColumn(1).width || 0) < 13) {
    worksheet.getColumn(1).width = 13;
  }

  worksheetAddRow(worksheet, []);
  curRowIdx++;

  if (options.generateSign) {
    const headerLength = options.header[0].length || 1;
    const pos =
      headerLength > 8
        ? headerLength - 5
        : headerLength > 4
        ? headerLength - 3
        : 1;
    worksheetAddRow(worksheet, []);
    addRow(
      worksheet,
      ["", "Dược sĩ phụ trách"],
      [pos, 3],
      [
        {},
        {
          alignment: {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          },
        },
      ]
    );

    worksheetAddRow(worksheet, []);
    worksheetAddRow(worksheet, []);
    worksheetAddRow(worksheet, []);
    curRowIdx += 3;

    // insert new row and return as row object
    addRow(
      worksheet,
      ["", options.info?.name],
      [pos, 3],
      [
        {},
        {
          style: { font: { bold: true } },
          alignment: {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          },
        },
      ]
    );
  }

  // handle formImport
  if (options.isFormImport) {
    const { group, category, unit } = options.dropdownData;
    worksheet.views = [
      {
        state: "frozen",
        xSplit: 1,
        ySplit: 4,
        topLeftCell: "B5",
        activeCell: "A1",
      },
    ];
    //init note
    worksheet.getCell("D2").fill = styles.fillCellForm;
    worksheet.getCell("D2").border = styles.fullBorder;
    worksheet.getCell("E2").value = "Ô không được chỉnh sửa";
    worksheet.getCell("E3").value =
      "Lưu ý: để thêm thuốc mới bạn bắt buộc điền vào những mục có dấu (*)";

    // init dropdown data
    worksheet.getCell("AL5").value = "Đang kinh doanh";
    worksheet.getCell("AL5").font = styles.invisible;
    worksheet.getCell("AL6").value = "Ngừng kinh doanh";
    worksheet.getCell("AL6").font = styles.invisible;

    category.forEach((item, i) => {
      worksheet.getCell(`AI${4 + i + 1}`).value = item.name;
      worksheet.getCell(`AI${4 + i + 1}`).font = styles.invisible;
    });

    group.forEach((item, i) => {
      worksheet.getCell(`AJ${4 + i + 1}`).value = item.name;
      worksheet.getCell(`AJ${4 + i + 1}`).font = styles.invisible;
    });

    unit.forEach((item, i) => {
      worksheet.getCell(`AK${4 + i + 1}`).value = item.name;
      worksheet.getCell(`AK${4 + i + 1}`).font = styles.invisible;
    });

    worksheet.getColumn("AI").hidden = true;
    worksheet.getColumn("AJ").hidden = true;
    worksheet.getColumn("AK").hidden = true;
    worksheet.getColumn("AL").hidden = true;

    // lock worksheet
    await worksheet.protect("ConghoaxahoichunghiaVietNam", options);
  }

  options.callback(workbook, curRowIdx);
  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fs.saveAs(
      blob,
      (options.fileName || options.title) +
        "-" +
        moment().format("YYYYMMDDHHmm") +
        ".xlsx"
    );
  });
}
