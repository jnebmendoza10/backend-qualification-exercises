export type Value = string | number | boolean | null | undefined |
  Date | Buffer | Map<unknown, unknown> | Set<unknown> |
  Array<Value> | { [key: string]: Value };

/**
 * Transforms JavaScript scalars and objects into JSON
 * compatible objects.
 */
export function serialize(value: Value): unknown {
  if (value instanceof Date) {
    // Serialize Date objects to ISO string
    return { __t: 'Date', __v: value.getTime() };
  } else if (value instanceof Buffer) {
    // Serialize Buffer objects to base64 string
    return { __t: 'Buffer', __v: Array.from(value)};
  } else if (value instanceof Map) {
    const serializedMap: [unknown, unknown][] = [];
    value.forEach((val: Value, key: Value) => {
      serializedMap.push([serialize(key), serialize(val)]);
    });
    return { __t: 'Map', __v: serializedMap};
  } else if (value instanceof Set) {
    // Serialize Set objects to arrays
    return { __t: 'Set', __v: Array.from(value).map(serialize) };
  } else if (Array.isArray(value)) {
    // Recursively serialize arrays
    return value.map(serialize);
  } else if (typeof value === 'object' && value !== null) {
    // Recursively serialize objects
    const obj: { [key: string]: unknown } = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        obj[key] = serialize(value[key]);
      }
    }
    return obj;
  } else {
    // Scalars can be directly serialized
    return value;
  }
}

/**
 * Transforms JSON compatible scalars and objects into JavaScript
 * scalar and objects.
 */
export function deserialize<T = unknown>(value: unknown): T {
  if (value === null || typeof value !== 'object' || value === undefined) {
    return value as T;
  } else if ('__t' in value && '__v' in value) {
    switch (value['__t']) {
      case 'Date':
        return new Date(value['__v'] as Date) as T;
      case 'Buffer':
        return Buffer.from(value['__v'] as number[]) as T;
      case 'Set':
        return new Set((value['__v'] as unknown[]).map(deserialize)) as T;
      case 'Map':
        return new Map(value['__v'] as [unknown, unknown][]) as T;
      default:
        throw new Error('Unknown serialized type');
    }
  } else if (Array.isArray(value)) {
    return value.map(deserialize) as T;
  } else {
    const deserializedObject: { [key: string]: unknown } = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        deserializedObject[key] = deserialize(value[key]);
      }
    }
    return deserializedObject as T;
  }
}
