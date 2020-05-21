import { helper } from '@ember/component/helper';

export function test(params:any) {
  console.log('helper function' + params);
}

export default helper(test);
