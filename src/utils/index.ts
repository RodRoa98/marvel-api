export const spreadMongoObj = (obj) => (obj.toJSON ? obj.toJSON() : obj);
export const compose = (...fns) =>
  fns.reduceRight(
    (f, g) =>
      (...args) =>
        g(f(...args))
  );
export const setDateOneMonthLater = () => {
  const actualDate = new Date();

  return new Date(actualDate.setMonth(actualDate.getMonth() + 1));
};
export function coerceBooleanProp(value: any): boolean {
  return value !== null && value !== undefined && `${value}`.toLowerCase() !== 'false';
}
