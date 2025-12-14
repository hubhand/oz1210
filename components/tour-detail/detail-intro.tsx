/**
 * @file components/tour-detail/detail-intro.tsx
 * @description 관광지 운영 정보 섹션 컴포넌트
 *
 * 이 컴포넌트는 관광지의 운영 정보를 표시하는 섹션입니다.
 * getDetailIntro() API를 사용하여 데이터를 가져오고,
 * 운영시간, 휴무일, 이용요금, 주차 정보, 수용인원, 체험 프로그램,
 * 유모차/반려동물 동반 가능 여부를 표시합니다.
 *
 * 주요 기능:
 * - 운영시간/개장시간 표시
 * - 휴무일 표시
 * - 이용요금 표시 (타입별 필드 다름)
 * - 주차 가능 여부 표시
 * - 수용인원 표시
 * - 체험 프로그램 표시
 * - 유모차 대여 여부 표시
 * - 반려동물 동반 가능 여부 표시
 * - 정보 없는 항목 숨김 처리
 *
 * @dependencies
 * - lib/api/tour-api.ts: getDetailIntro(), getDetailCommon() 함수
 * - lib/types/tour.ts: TourIntro, TourDetail 타입
 * - components/ui/error.tsx: ErrorDisplay 컴포넌트
 *
 * @example
 * ```tsx
 * <DetailIntro contentId="125266" />
 * ```
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.4.2 운영 정보 섹션)
 * @see {@link /docs/TODO.md} - 개발 TODO 리스트
 */

import {
  Clock,
  CalendarX,
  DollarSign,
  Car,
  Users,
  BookOpen,
  Baby,
  Heart,
  Info,
} from "lucide-react";
import {
  getDetailIntro,
  getDetailCommon,
  TourApiError,
} from "@/lib/api/tour-api";
import type { TourIntro, TourDetail } from "@/lib/types/tour";
import { ErrorDisplay } from "@/components/ui/error";

export interface DetailIntroProps {
  /** 관광지 콘텐츠 ID */
  contentId: string;
  /** 관광지 콘텐츠 타입 ID (선택, 없으면 내부에서 조회) */
  contentTypeId?: string;
}

/**
 * 관광지 운영 정보 섹션 컴포넌트
 * @param {DetailIntroProps} props - 컴포넌트 props
 * @returns {JSX.Element} 운영 정보 섹션 요소
 */
export async function DetailIntro({
  contentId,
  contentTypeId,
}: DetailIntroProps) {
  let intro: TourIntro | null = null;
  let error: Error | null = null;
  let actualContentTypeId = contentTypeId;

  try {
    // contentTypeId가 없으면 getDetailCommon()을 호출하여 획득
    if (!actualContentTypeId) {
      try {
        const detail: TourDetail = await getDetailCommon({ contentId });
        actualContentTypeId = detail.contenttypeid;
      } catch (err) {
        if (err instanceof TourApiError) {
          error = err;
        } else if (err instanceof Error) {
          error = err;
        } else {
          error = new Error("관광지 정보를 불러올 수 없습니다.");
        }
      }
    }

    // 에러가 없으면 getDetailIntro() 호출
    if (!error && actualContentTypeId) {
      intro = await getDetailIntro({
        contentId,
        contentTypeId: actualContentTypeId,
      });
    }
  } catch (err) {
    if (err instanceof TourApiError) {
      error = err;
    } else if (err instanceof Error) {
      error = err;
    } else {
      error = new Error("알 수 없는 오류가 발생했습니다.");
    }
  }

  // 에러 처리
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        title="운영 정보를 불러올 수 없습니다"
        retryLabel="다시 시도"
      />
    );
  }

  // 데이터가 없는 경우
  if (!intro) {
    return null; // 운영 정보가 없으면 섹션 자체를 숨김
  }

  // 이용요금 필드 찾기 (타입별로 필드명이 다를 수 있음)
  const feeFields = ["usefee", "usefeeleports", "usefeeaccom"];
  const useFee =
    intro.usefee ||
    intro.usefeeleports ||
    intro.usefeeaccom ||
    feeFields
      .map((field) => intro[field])
      .find((value) => value && value.trim() !== "");

  // 표시할 정보 항목들
  const infoItems = [
    {
      key: "usetime",
      label: "운영시간",
      value: intro.usetime,
      icon: Clock,
    },
    {
      key: "restdate",
      label: "휴무일",
      value: intro.restdate,
      icon: CalendarX,
    },
    {
      key: "usefee",
      label: "이용요금",
      value: useFee,
      icon: DollarSign,
    },
    {
      key: "parking",
      label: "주차",
      value: intro.parking,
      icon: Car,
    },
    {
      key: "accomcount",
      label: "수용인원",
      value: intro.accomcount,
      icon: Users,
    },
    {
      key: "expguide",
      label: "체험 프로그램",
      value: intro.expguide,
      icon: BookOpen,
    },
    {
      key: "chkbabycarriage",
      label: "유모차 대여",
      value: intro.chkbabycarriage,
      icon: Baby,
    },
    {
      key: "chkpet",
      label: "반려동물 동반",
      value: intro.chkpet,
      icon: Heart,
    },
  ].filter((item) => item.value && item.value.trim() !== ""); // 값이 있는 항목만 필터링

  // 모든 정보가 없으면 섹션을 숨김
  if (infoItems.length === 0) {
    return null;
  }

  return (
    <section
      className="rounded-lg border bg-card p-4 md:p-6 space-y-4"
      aria-labelledby="intro-heading"
    >
      {/* 섹션 제목 */}
      <h2 id="intro-heading" className="text-xl md:text-2xl font-bold">
        운영 정보
      </h2>

      {/* 운영 정보 목록 */}
      <div className="space-y-4" role="list">
        {infoItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="flex items-start gap-3"
              role="listitem"
            >
              <Icon
                className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0"
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-1">{item.label}</p>
                <p
                  className="text-sm text-muted-foreground break-words whitespace-pre-line"
                  aria-label={`${item.label}: ${item.value}`}
                >
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 문의처 (추가 정보) */}
      {intro.infocenter && (
        <div className="flex items-start gap-3 pt-2 border-t">
          <Info
            className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0"
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium mb-1">문의처</p>
            <p
              className="text-sm text-muted-foreground break-words"
              aria-label={`문의처: ${intro.infocenter}`}
            >
              {intro.infocenter}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
