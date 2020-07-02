import { BasicUnitOfModel } from '../interface';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function getValueFromObject(source: any, parents: any): string {
  let position = source;
  for (const keyOrIndex of parents) {
    const newPosition = position[keyOrIndex];
    position = newPosition;
  }
  return position;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function addValueToTargetObject({
  targetObject,
  parents,
  value,
  numberSymbol,
}: {
  targetObject: any;
  parents: any;
  value: string;
  numberSymbol: symbol;
}) {
  let position = targetObject;

  console.log({ targetObject, parents, value, numberSymbol });
  let previousPosition;
  for (const parent of parents) {
    if (position[parent] === undefined) {
      position[parent] = {};
      if (typeof parent === 'number') {
        position[numberSymbol] = true;
      }
    }
    previousPosition = position;
    position = position[parent];
  }
  previousPosition[parents[parents.length - 1]] = value;
}

function addArrayStructureToTargetObject({
  source,
  numberSymbol,
}: {
  source: any;
  numberSymbol: symbol;
}) {
  // console.log(source);
  let result: any = undefined;

  if (source[numberSymbol]) {
    result = [];
  } else {
    result = {};
  }

  for (const [key, value] of Object.entries(source)) {
    if (typeof value !== 'object') {
      result[key] = value;
    } else {
      result[key] = addArrayStructureToTargetObject({
        source: value,
        numberSymbol,
      });
    }
  }
  return result;
}

export function convertObjectUsingModel({
  source: sourceObject,
  model: modelForConvertingObject,
}: {
  source: Record<string, unknown>;
  model: Record<string, BasicUnitOfModel>;
}) {
  const convertedObjectWithoutArray = {};
  const arrayFlag = Symbol('number');

  for (const basicUnitOfModel of Object.values(modelForConvertingObject)) {
    const { from, to } = basicUnitOfModel;

    let valueForTargetObject = from
      ? getValueFromObject(sourceObject, from.parents || from) // check
      : to.value;

    if (to.valueTable && to.valueTable[valueForTargetObject]) {
      valueForTargetObject = to.valueTable[valueForTargetObject];
    }

    if (to.valueReplace) {
      valueForTargetObject = valueForTargetObject.replace(
        //to.valueReplace.searchValue,
        new RegExp(to.valueReplace.searchValue),
        to.valueReplace.newValue
      );
      console.log(
        valueForTargetObject,
        valueForTargetObject.replace(
          to.valueReplace.searchValue,
          to.valueReplace.newValue
        ),
        to.valueReplace.searchValue,
        to.valueReplace.newValue
      );
    }

    addValueToTargetObject({
      // check
      targetObject: convertedObjectWithoutArray,
      parents: to.parents || to,
      value: valueForTargetObject,
      numberSymbol: arrayFlag,
    });
  }

  const targetObject = addArrayStructureToTargetObject({
    source: convertedObjectWithoutArray,
    numberSymbol: arrayFlag,
  });

  return targetObject;
}
