import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * @file app/api/sync-user/route.ts
 * @description Clerk 사용자를 Supabase users 테이블에 동기화하는 API
 *
 * 클라이언트에서 로그인 후 이 API를 호출하여 사용자 정보를 Supabase에 저장합니다.
 * 이미 존재하는 경우 업데이트하고, 없으면 새로 생성합니다.
 *
 * 에러 응답 형식:
 * - success: false
 * - error: 사용자 친화적 에러 메시지
 * - errorType: 에러 타입 (AuthenticationError, DatabaseError, UnknownError)
 * - statusCode: HTTP 상태 코드
 */
export async function POST() {
  try {
    // Clerk 인증 확인
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "인증이 필요합니다. 로그인 후 다시 시도해주세요.",
          errorType: "AuthenticationError",
          statusCode: 401,
        },
        { status: 401 },
      );
    }

    // Supabase에 사용자 정보 동기화
    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          clerk_id: user.id,
          name:
            user.fullName ||
            user.username ||
            user.emailAddresses[0]?.emailAddress ||
            "Unknown",
        },
        {
          onConflict: "clerk_id",
        },
      )
      .select()
      .single();

    if (error) {
      // 개발 환경에서만 상세 에러 로깅
      if (process.env.NODE_ENV === "development") {
        console.error("Supabase sync error:", error);
      }

      // 프로덕션 환경에서는 일반적인 메시지만 반환
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? `사용자 동기화 실패: ${error.message}`
          : "사용자 정보를 저장하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          errorType: "DatabaseError",
          statusCode: 500,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      user: data,
    });
  } catch (error) {
    // 개발 환경에서만 상세 에러 로깅
    if (process.env.NODE_ENV === "development") {
      console.error("Sync user error:", error);
    }

    // 에러 타입 구분
    if (error instanceof Error) {
      const isNetworkError =
        error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("Network");

      return NextResponse.json(
        {
          success: false,
          error: isNetworkError
            ? "네트워크 연결을 확인해주세요."
            : process.env.NODE_ENV === "development"
            ? error.message
            : "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
          errorType: isNetworkError ? "NetworkError" : "UnknownError",
          statusCode: 500,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? "알 수 없는 에러가 발생했습니다."
            : "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        errorType: "UnknownError",
        statusCode: 500,
      },
      { status: 500 },
    );
  }
}
