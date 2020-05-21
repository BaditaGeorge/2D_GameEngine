import { helper } from '@ember/component/helper';

export function substring(params: any) {
  if (params !== null) {
    console.log(params);
  }
}

export default helper(substring);
