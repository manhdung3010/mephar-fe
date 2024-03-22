import { formatMoney } from "@/helpers";
import { logoGDP, logoGPP } from "./logoText";

interface TableDocDefinitionProps {
  info?: any;
  title: string;
  header: any;
  items: any[];
  mapFooter?: any[];
  widths?: (number | string)[];
  customFooter?: any;
  options?: any;
  customFieldExportPDF?: any;
}

export default function TableDocDefinition(props: TableDocDefinitionProps) {
  const {
    info,
    title,
    header,
    items,
    mapFooter,
    widths,
    customFooter,
    options,
    customFieldExportPDF,
  } = props;

  console.log("items", items);
  const footer = mapFooter?.map((e, idx) => {
    if (e === "sum")
      return {
        text: +items?.reduce((acc, cur) => acc + +cur[idx], 0),
        bold: true,
      };
    else return mapFooter[idx];
  });
  if (footer && footer.length === items?.[0]?.length) items.push(footer);

  const itemsFinal = items.map((item) => item.map((e) => e || ""));
  let widthsFinal = [];
  if (widths === undefined) {
    widthsFinal = header?.map((_, i) => (i === 0 ? "*" : "auto"));
  } else {
    widthsFinal = header?.map((_, i) => (widths[i] ? widths[i] : "*"));
  }
  return {
    pageOrientation: options.pageOrientation || "portrait",
    content: [
      {
        columns: [
          {
            svg: process.env.APP_TYPE === "GDP" ? logoGDP : logoGPP,
            width: 70,
          },
          {
            type: "none",
            lineHeight: 1.5,
            ul: [
              {
                text: info.drug_store?.name,
                style: "header",
                alignment: "center",
              },
              {
                text: [
                  "Địa chỉ: ",
                  { text: info.drug_store?.address, bold: true },
                ],
                alignment: "center",
              },
              {
                text: [
                  "Điện thoại: ",
                  { text: info.drug_store?.phone, bold: true },
                ],
                alignment: "center",
              },
            ],
          },
        ],
        columnGap: 10,
      },
      "\n",
      title
        ? {
            text: title,
            style: "header",
            alignment: "center",
          }
        : null,
      "\n",
      customFieldExportPDF
        ? {
            text: customFieldExportPDF,
            style: "header",
          }
        : null,
      "\n",
      {
        layout: options.smallTable
          ? "customTableLayoutSmall"
          : "customTableLayout",
        lineHeight: 1.3,
        table: {
          headerRows: 1,
          widths: widthsFinal,
          body: [
            header.map((e) => ({
              text: e,
              style: "tableHeader",
            })),
            ...itemsFinal,
          ],
        },
      },
      "\n",
      ...(customFooter
        ? customFooter
        : [
            {
              text: "Dược sĩ phụ trách:",
              alignment: "right",
              margin: [0, 20, 60, 50],
            },
            {
              text: info.name,
              bold: true,
              alignment: "right",
              margin: [0, 0, 60, 5],
            },
          ]),
    ],
    defaultStyle: {
      fontSize: options.fontSize || options.smallTable ? 10 : 12,
    },
    styles: {
      header: {
        fontSize: 15,
        bold: true,
        color: "#0C69a6",
      },
      tableHeader: {
        color: "#0C69a6",
        bold: true,
        alignment: "center",
      },
    },
  };
}
