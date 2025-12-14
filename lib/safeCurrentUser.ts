import { currentUser } from "@clerk/nextjs/server";

/**
 * Clerk의 currentUser가 undefined 내부 구조에서 SessionToken을 읽으며
 * 'Cannot read properties of undefined (reading "SessionToken")'
 * 오류를 일으키는 문제를 안전하게 우회하는 wrapper.
 */
export async function safeCurrentUser() {
  try {
    const user = await currentUser();
    if (!user) {
      return null;
    }
    return user;
  } catch (err) {
    // Clerk가 내부적으로 SessionToken 접근 실패할 때 여기로 옴
    console.error("safeCurrentUser() error:", err);
    return null;
  }
}
