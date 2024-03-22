export const borderBoldTable = {
  hLineWidth: function (i, node) {
    return i === 0 || i === node.table.body.length ? 2 : 1;
  },
  vLineWidth: function (i, node) {
    return i === 0 || i === node.table.widths.length ? 2 : 1;
  },
  hLineColor: function (i, node) {
    return i === 0 || i === node.table.body.length ? "black" : "gray";
  },
  vLineColor: function (i, node) {
    return i === 0 || i === node.table.widths.length ? "black" : "gray";
  },
};
