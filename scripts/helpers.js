import _ from "lodash";
const { snakeCase } = _;

export function exit(reason, code = 1) {
  code === 0 ? console.log(reason) : console.error(reason);
  process.exit(code);
}

export function snakecase(text) {
  return snakeCase(text);
}
