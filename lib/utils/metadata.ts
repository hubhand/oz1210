/**
 * @file lib/utils/metadata.ts
 * @description 메타데이터 생성 유틸리티 함수
 *
 * Open Graph 메타태그 생성을 위한 유틸리티 함수들을 제공합니다.
 */

/**
 * HTML 태그를 제거하고 텍스트만 추출
 * @param html HTML 문자열
 * @returns 태그가 제거된 텍스트
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * 텍스트를 지정된 길이로 자르고 말줄임표 추가
 * @param text 원본 텍스트
 * @param maxLength 최대 길이
 * @returns 잘린 텍스트
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * 텍스트에서 줄바꿈과 연속된 공백 제거
 * @param text 원본 텍스트
 * @returns 정리된 텍스트
 */
export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ") // 연속된 공백을 하나로
    .replace(/\n+/g, " ") // 줄바꿈을 공백으로
    .trim();
}

/**
 * HTML 태그를 제거하고 텍스트를 정리하여 지정된 길이로 자름
 * @param html HTML 문자열
 * @param maxLength 최대 길이 (기본값: 100)
 * @returns 정리된 텍스트
 */
export function prepareDescription(html: string, maxLength: number = 100): string {
  const text = stripHtmlTags(html);
  const cleaned = cleanText(text);
  return truncateText(cleaned, maxLength);
}

