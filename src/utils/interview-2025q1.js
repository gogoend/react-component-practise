//#region 防抖
const debounce = (fn, delay, runAtTail = true) => {
  let timer;

  if (runAtTail) {
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  } else {
    let canRun = true;
    return (...args) => {
      if (canRun) {
        fn(...args);
        canRun = false;
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        canRun = true;
      }, delay);
    };
  }
};
//#endregion

//#region Promise调度器
const sleep = (delay) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

const promiseFactories = [1000, 2000, 1000, 2000, 1000, 2000].map(
  (it) => () => sleep(it)
);

const promiseScheduler = (promiseFactoryList, maxPoolSize = 2) => {
  return new Promise((resolve) => {
    if (!promiseFactoryList.length) {
      resolve([]);
      return;
    }

    const promiseFactoryToIndexMap = new Map();
    promiseFactoryList.forEach((it, index) => {
      promiseFactoryToIndexMap.set(it, index);
    });
    const queue = [...promiseFactoryList];
    const pool = new Set();
    const result = [];
    let finishedTaskCount = 0;

    function requestTask() {
      while (pool.size < maxPoolSize && queue.length) {
        const factory = queue.shift();
        const promise = factory();
        pool.add(promise);
        promise.then((res) => {
          pool.delete(promise);
          const index = promiseFactoryToIndexMap.get(factory);
          result[index] = res;
          finishedTaskCount++;
          if (finishedTaskCount === promiseFactoryList.length) {
            resolve(result);
          } else {
            requestTask();
          }
        });
      }
    }
    requestTask();
  });
};
//#endregion

//#region 手写Call
const myCall = (fn, ctx, ...args) => {
  const callSymbol = Symbol();
  if (ctx === null || ctx === undefined) {
    ctx = globalThis;
  }
  const o = Object(ctx);
  o[callSymbol] = fn;
  const returnValue = o[callSymbol](...args);
  delete o[callSymbol];

  return returnValue;
};

Function.prototype.myCall = function (ctx, ...args) {
  const callSymbol = Symbol();
  if (ctx === null || ctx === undefined) {
    ctx = globalThis;
  }
  const o = Object(ctx);
  o[callSymbol] = this;
  const returnValue = o[callSymbol](...args);
  delete o[callSymbol];

  return returnValue;
};
//#endregion

//#region 手写new
function myObjectCreate(proto) {
  const F = function () {};
  F.prototype = proto;
  return new F();
}

function myNew(Ctor, ...args) {
  const o = myObjectCreate(Ctor.prototype);
  const returnValue = Ctor.call(o, ...args);
  if (returnValue && ["function", "object"].includes(typeof returnValue)) {
    return returnValue;
  }

  return o;
}
//#endregion

//#region 寄生组合式继承
function myInherit(Sub, Super) {
  const prototype = myObjectCreate(Super.prototype);
  prototype.constructor = Sub;
  Sub.prototype = prototype;
}
function Super() {
  this.color = ["a", "b", "c"];
}
function Sub(...args) {
  Super.call(this, ...args);
  this.args = args;
}
Sub.prototype.a = function () {
  console.log(this.args);
};
myInherit(Sub, Object);
//#endregion

//#region 手写instanceof
function myInstanceOf(o, Ctor) {
  if (o === null || typeof o !== "object") {
    return false;
  }
  let proto = o.__proto__;
  while (proto) {
    if (Ctor.prototype === proto) {
      return true;
    }
    proto = proto.__proto__;
  }
  return false;
}
//#endregion

//#region 矩阵转置
function transposeMatrix(arr) {
  const rowCount = arr.length;
  const colCount = arr[0].length;
  const result = Array.from({ length: colCount }, () =>
    Array.from({ length: rowCount }).fill(0)
  );

  for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < colCount; j++) {
      result[j][i] = arr[i][j];
    }
  }
  return result;
}
//#endregion

//#region 数组扁平化 - 递归、迭代、Reduce
const flattenArrayWithRecursion = (arr) => {
  const result = [];
  function innerRecursion(_arr) {
    for (let i = 0; i < _arr.length; i++) {
      const it = _arr[i];
      if (it instanceof Array) {
        innerRecursion(it);
      } else {
        result.push(it);
      }
    }
  }
  innerRecursion(arr);

  return result;
};
const flattenArrayWithIterate = (arr) => {
  const result = [];
  const queue = [...arr];

  while (queue.length) {
    const it = queue.shift();
    if (it instanceof Array) {
      queue.unshift(...it);
    } else {
      result.push(it);
    }
  }
  return result;
};
const flattenArrayWithReduce = (arr, result = []) => {
  return arr.reduce((accu, cur, index) => {
    if (cur instanceof Array) {
      return flattenArrayWithReduce(cur, accu);
    } else {
      accu.push(cur);
      return accu;
    }
  }, result);
};
//#endregion

function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}
//#region 快速排序
function quickSort(_arr) {
  function innerRecursion(arr, start = 0, end = arr.length - 1) {
    const pivotIndex = start;
    const pivot = arr[pivotIndex];

    let p = start,
      q = end;
    while (p <= q) {
      while (arr[p] < pivot) {
        p++;
      }
      while (arr[q] > pivot) {
        q--;
      }
      if (p <= q) {
        swap(arr, p, q);
        p++;
        q--;
      }
    }
    if (q > start) {
      innerRecursion(arr, start, q);
    }
    if (p < end) {
      innerRecursion(arr, p, end);
    }
  }
  innerRecursion(_arr);
  return _arr;
}
//#endregion

//#region 冒泡排序
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; i < arr.length; i++) {
      if (arr[i] < arr[j]) {
        swap(arr, i, j);
      }
    }
  }
  return arr;
}
//#endregion

//#region Leetcode 两数之和
function twoSum(nums, target) {
  const minusMap = {};
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if (minusMap[n] >= 0) {
      return [i, minusMap[n]];
    }
    minusMap[target - n] = i;
  }
  return [];
}
twoSum([2, 7, 11, 15], 9);
//#endregion

//#region Leetcode 奇偶数组 - 偶数在前，奇数在后
var sortArrayByParity = function (nums) {
  let p = 0,
    q = nums.length - 1;
  while (p < q) {
    while (nums[p] % 2 === 0) {
      p++;
    }
    while (nums[q] % 2 === 1) {
      q--;
    }
    if (p < q) {
      swap(nums, p, q);
      p++;
      q--;
    }
  }
  return nums;
};
sortArrayByParity([3, 1, 2, 4]);
//#endregion

//#region LeetCode 有效的括号
function isValidParentheses(s) {
  if (s.length % 2 !== 0) {
    return false;
  }
  const stack = [];
  const matchMap = {
    "}": "{",
    "]": "[",
    ")": "(",
  };
  for (let i = 0; i < s.length; i++) {
    if (Object.values(matchMap).includes(s[i])) {
      stack.push(s[i]);
    } else {
      const strToPair = stack.pop();
      if (strToPair !== matchMap[s[i]]) {
        return false;
      }
    }
  }
  if (stack.length) {
    return false;
  }

  return true;
}
//#endregion

//#region 深拷贝
function cloneDeep(o) {
  if (
    ["number", "boolean", "string"].includes(typeof o) ||
    [null, undefined].includes(o)
  ) {
    return o;
  }

  let clonedO;
  const oTag = Object.prototype.toString.call(o).slice(8, -1);
  switch (oTag) {
    case "Array": {
      clonedO = [];
      for (let i = 0; i < o.length; i++) {
        if (Object.prototype.hasOwnProperty.call(o, i)) {
          clonedO[i] = cloneDeep(o[i]);
        }
      }
      return clonedO;
    }
    case "Object": {
      clonedO = {};
      const keys = Object.keys(o);
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        clonedO[k] = cloneDeep(o[k]);
      }
      return clonedO;
    }
    default: {
      return o;
    }
  }
}
//#endregion
