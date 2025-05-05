const formatNumberCompact = (number) => new Intl.NumberFormat('en-US', {
  useGrouping: true,
  notation: "compact",

}).format(number);

const formatNumberDecimalPoint = (number, point = 1) => new Intl.NumberFormat('en-US', {
  useGrouping: true,
  minimumFractionDigits: point,

}).format(number);

export {formatNumberCompact, formatNumberDecimalPoint};
