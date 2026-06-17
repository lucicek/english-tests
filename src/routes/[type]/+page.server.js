import { data } from '../data.js';

export function load({ params }) {
  const questions =
    data[params.type]?.map(({ answer, ...q }) => q) ?? [];

  const types = [
    'grammar',
    'vocabulary',
    'reading1',
    'reading2',
    'reading3'
  ];

  const currentIndex = types.indexOf(params.type);
  const previousType =
    currentIndex > 0 ? types[currentIndex - 1] : undefined;

  const previousLength = previousType
    ? data[previousType]?.length
    : 0;

  // 👇 přidáme text pro reading sekce
  const text = data[`${params.type}Text`] ?? null;

  return {
    questions,
    text,
    length: questions.length,
    previousLength
  };
}