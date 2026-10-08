export type Subject = {
  code: string;
  title: string;
  file: string;
  unlockCost: number;
  available: boolean;
};

export const subjects: Subject[] = [
  {
    code: 'MLN111',
    title: 'Triết học Mác - Lênin',
    file: 'mln111.json',
    unlockCost: 29,
    available: true,
  },
  {
    code: 'MLN112',
    title: 'Kinh tế chính trị',
    file: 'mln112.json',
    unlockCost: 29,
    available: false,
  },
];

export function getSubject(code: string): Subject | undefined {
  return subjects.find(s => s.code === code);
}

export function getAvailableSubjects(): Subject[] {
  return subjects.filter(s => s.available);
}
