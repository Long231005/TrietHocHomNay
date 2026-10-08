export const PRACTICE_CONFIG = {
  // Chuỗi học
  LEARN_CHAIN_SIZE: 7,
  
  // Thưởng shards
  LEARN_CHAIN_COMPLETE: 1,      // Hoàn thành chuỗi 7 câu
  EXAM_COMPLETE_THRESHOLD: 0.5, // Ngưỡng >=50% để nhận thưởng
  EXAM_GOOD_THRESHOLD: 0.8,    // Ngưỡng >=80% để nhận thưởng cao hơn
  EXAM_COMPLETE_SHARDS: 5,      // Thưởng khi >=50%
  EXAM_GOOD_SHARDS: 10,          // Thưởng khi >=80%
  
  // Bài kiểm tra
  EXAM_QUESTION_COUNT: 60,
  
  // Lưu lịch sử
  EXAM_HISTORY_LIMIT: 5,
} as const;

export type PracticeConfig = typeof PRACTICE_CONFIG;
