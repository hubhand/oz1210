"use client";

/**
 * @file components/bookmarks/bookmark-list.tsx
 * @description 북마크 목록 컴포넌트
 *
 * 이 컴포넌트는 북마크한 관광지 목록을 카드 레이아웃으로 표시합니다.
 * 정렬 기능, 체크박스 선택, 일괄 삭제 기능을 제공합니다.
 *
 * 주요 기능:
 * - 북마크한 관광지 목록 표시 (카드 레이아웃)
 * - 정렬 기능 (최신순, 이름순, 지역별)
 * - 체크박스 선택 (전체 선택/해제, 개별 선택)
 * - 일괄 삭제 기능 (확인 다이얼로그 포함)
 * - 개별 삭제 기능 (각 카드의 삭제 버튼)
 * - 빈 상태 처리 (북마크 없을 때)
 * - 로딩 상태 (Skeleton UI)
 * - 반응형 디자인 (모바일/태블릿/데스크톱)
 * - 접근성 지원 (ARIA, 키보드 네비게이션)
 *
 * @dependencies
 * - components/tour-card.tsx: TourCard 컴포넌트
 * - components/ui/skeleton.tsx: Skeleton 컴포넌트
 * - components/ui/checkbox.tsx: Checkbox 컴포넌트
 * - components/ui/dialog.tsx: Dialog 컴포넌트
 * - components/ui/button.tsx: Button 컴포넌트
 * - lib/api/bookmark-api.ts: BookmarkedTourItem 타입
 * - actions/delete-bookmarks.ts: deleteBookmarks Server Action
 * - lib/utils/toast.ts: toast 함수
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.4.5 북마크 기능)
 * @see {@link /docs/TODO.md} - 개발 TODO 리스트
 */

import { useState, useTransition, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Inbox, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import type { BookmarkedTourItem } from "@/lib/api/bookmark-api";
import { TourCard } from "@/components/tour-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { deleteBookmarks } from "@/actions/delete-bookmarks";
import { cn } from "@/lib/utils";

export interface BookmarkListProps {
  /** 북마크한 관광지 목록 */
  tours: BookmarkedTourItem[];
  /** 정렬 옵션 (기본값: "latest") */
  sortBy?: "latest" | "name" | "region";
}

/**
 * 관광지 카드 스켈레톤 컴포넌트
 */
function TourCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 md:p-6 space-y-4">
      <Skeleton className="h-48 w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

/**
 * 북마크 목록 스켈레톤 컴포넌트
 */
export function BookmarkListSkeleton() {
  return (
    <div
      className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="로딩 중"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <TourCardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
}

/**
 * 빈 상태 컴포넌트
 */
function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 md:py-16 space-y-4"
      role="status"
      aria-live="polite"
      aria-label="북마크가 없습니다"
    >
      <div className="rounded-full bg-muted p-6">
        <Inbox className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold">북마크가 없습니다</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          관심 있는 관광지를 북마크하여 나중에 쉽게 찾아보세요.
        </p>
      </div>
      <Button asChild variant="default" size="default" className="min-h-[44px]">
        <Link href="/">관광지 둘러보기</Link>
      </Button>
    </div>
  );
}

/**
 * 관광지 목록 정렬 함수
 * @param tours 북마크한 관광지 목록
 * @param sortBy 정렬 옵션
 * @returns 정렬된 관광지 목록
 */
function sortTours(
  tours: BookmarkedTourItem[],
  sortBy: "latest" | "name" | "region" = "latest",
): BookmarkedTourItem[] {
  const sorted = [...tours];

  switch (sortBy) {
    case "latest":
      // 북마크 생성 시간 기준 내림차순 (최신순)
      return sorted.sort((a, b) => {
        const timeA = new Date(a.bookmarkCreatedAt).getTime();
        const timeB = new Date(b.bookmarkCreatedAt).getTime();
        return timeB - timeA; // 내림차순 (최신이 먼저)
      });

    case "name":
      // 이름순 (가나다순)
      return sorted.sort((a, b) => a.title.localeCompare(b.title, "ko"));

    case "region":
      // 지역별 (areacode 기준) 정렬 후 이름순
      // areacode가 빈 문자열인 경우 맨 뒤로 배치
      return sorted.sort((a, b) => {
        const aCode = a.areacode || "";
        const bCode = b.areacode || "";

        // 빈 문자열 처리: 빈 문자열은 맨 뒤로
        if (aCode === "" && bCode !== "") return 1;
        if (aCode !== "" && bCode === "") return -1;
        if (aCode === "" && bCode === "") {
          // 둘 다 빈 문자열이면 이름순으로 정렬
          return a.title.localeCompare(b.title, "ko");
        }

        // areacode 기준 정렬
        const regionCompare = aCode.localeCompare(bCode);
        if (regionCompare !== 0) return regionCompare;

        // 같은 지역이면 이름순으로 정렬
        return a.title.localeCompare(b.title, "ko");
      });

    default:
      return sorted;
  }
}

/**
 * 북마크 목록 컴포넌트
 * @param {BookmarkListProps} props - 컴포넌트 props
 * @returns {JSX.Element} 북마크 목록 요소
 */
export function BookmarkList({ tours, sortBy = "latest" }: BookmarkListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // 개별 삭제를 위한 상태
  const [singleDeleteTarget, setSingleDeleteTarget] = useState<{
    bookmarkId: string;
    tourTitle: string;
  } | null>(null);
  const [isSingleDeleteDialogOpen, setIsSingleDeleteDialogOpen] =
    useState(false);

  // 정렬 적용 (useMemo로 메모이제이션) - hooks는 항상 같은 순서로 호출되어야 함
  const sortedTours = useMemo(() => sortTours(tours, sortBy), [tours, sortBy]);

  // 전체 선택/해제 상태 (useMemo로 메모이제이션)
  const allSelected = useMemo(
    () => sortedTours.length > 0 && selectedIds.size === sortedTours.length,
    [sortedTours.length, selectedIds.size],
  );

  // 전체 선택/해제 핸들러 (useCallback으로 메모이제이션)
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        // bookmarkId가 있는 항목만 선택
        const allIds = new Set(
          sortedTours
            .map((tour) => tour.bookmarkId)
            .filter((id): id is string => Boolean(id)),
        );
        setSelectedIds(allIds);
      } else {
        setSelectedIds(new Set());
      }
    },
    [sortedTours],
  );

  // 개별 선택/해제 핸들러 (useCallback으로 메모이제이션)
  const handleToggleSelect = useCallback((bookmarkId: string) => {
    setSelectedIds((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(bookmarkId)) {
        newSelected.delete(bookmarkId);
      } else {
        newSelected.add(bookmarkId);
      }
      return newSelected;
    });
  }, []);

  // 일괄 삭제 핸들러 (useCallback으로 메모이제이션)
  const handleDelete = useCallback(() => {
    if (selectedIds.size === 0) return;

    startTransition(async () => {
      const bookmarkIds = Array.from(selectedIds);
      const result = await deleteBookmarks(bookmarkIds);

      if (result.success) {
        toast.success(`${result.deletedCount}개의 북마크가 삭제되었습니다.`);
        setSelectedIds(new Set());
        setIsDeleteDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "북마크 삭제에 실패했습니다.");
      }
    });
  }, [selectedIds, router, startTransition]);

  // 개별 삭제 핸들러 (useCallback으로 메모이제이션)
  const handleDeleteSingle = useCallback(
    (bookmarkId: string, tourTitle: string) => {
      setSingleDeleteTarget({ bookmarkId, tourTitle });
      setIsSingleDeleteDialogOpen(true);
    },
    [],
  );

  // 개별 삭제 실행 핸들러 (useCallback으로 메모이제이션)
  const handleConfirmSingleDelete = useCallback(() => {
    if (!singleDeleteTarget) return;

    startTransition(async () => {
      const result = await deleteBookmarks([singleDeleteTarget.bookmarkId]);

      if (result.success) {
        toast.success("북마크가 삭제되었습니다.");
        setIsSingleDeleteDialogOpen(false);
        setSingleDeleteTarget(null);
        // 선택된 항목에서도 제거 (있는 경우)
        setSelectedIds((prev) => {
          const newSelected = new Set(prev);
          newSelected.delete(singleDeleteTarget.bookmarkId);
          return newSelected;
        });
        router.refresh();
      } else {
        toast.error(result.error || "북마크 삭제에 실패했습니다.");
      }
    });
  }, [singleDeleteTarget, router, startTransition]);

  // 빈 상태 처리 - 모든 hooks 호출 후에 early return
  if (tours.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="w-full space-y-4">
      {/* 선택 헤더 */}
      {selectedIds.size > 0 && (
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border bg-card p-4"
          role="toolbar"
          aria-label="선택된 북마크 관리"
        >
          <div className="flex items-center gap-4">
            <Checkbox
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              aria-label="전체 선택"
              className="h-5 w-5"
            />
            <span className="text-sm text-muted-foreground">
              {selectedIds.size}개 선택됨
            </span>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isPending}
            aria-label={`선택한 ${selectedIds.size}개의 북마크 삭제`}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
                삭제 중...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                삭제
              </>
            )}
          </Button>
        </div>
      )}

      {/* 전체 선택 헤더 (선택된 항목이 없을 때) */}
      {selectedIds.size === 0 && (
        <div
          className="flex items-center gap-2 rounded-lg border bg-card p-4"
          role="toolbar"
          aria-label="북마크 선택 도구"
        >
          <Checkbox
            checked={allSelected}
            onCheckedChange={handleSelectAll}
            aria-label="전체 선택"
            className="h-5 w-5"
          />
          <span className="text-sm text-muted-foreground">전체 선택</span>
        </div>
      )}

      {/* 북마크 목록 */}
      <div
        className={cn(
          "grid gap-4",
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        )}
        role="list"
        aria-label="북마크한 관광지 목록"
        aria-live="polite"
      >
        {sortedTours.map((tour) => {
          // bookmarkId가 없으면 선택할 수 없음 (북마크 삭제에 UUID 필요)
          const bookmarkId = tour.bookmarkId;
          if (!bookmarkId) {
            // bookmarkId가 없는 경우 체크박스 없이 표시
            return (
              <div key={tour.contentid} role="listitem">
                <TourCard tour={tour} />
              </div>
            );
          }

          const isSelected = selectedIds.has(bookmarkId);

          return (
            <div
              key={tour.contentid}
              role="listitem"
              className="relative group"
            >
              {/* 체크박스 */}
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleToggleSelect(bookmarkId)}
                  aria-label={`${tour.title} 선택`}
                  className="h-5 w-5 md:h-4 md:w-4 bg-background/90 backdrop-blur-sm"
                />
              </div>

              {/* 개별 삭제 버튼 */}
              {/* 모바일: 항상 표시, 데스크톱: 호버 시 표시 */}
              <div className="absolute top-2 right-2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteSingle(bookmarkId, tour.title);
                  }}
                  disabled={isPending}
                  className="h-9 w-9 md:h-8 md:w-8 bg-background/90 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                  aria-label={`${tour.title} 북마크 삭제`}
                  title={`${tour.title} 북마크 삭제`}
                >
                  {isPending &&
                  singleDeleteTarget?.bookmarkId === bookmarkId ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* 카드 (선택 상태에 따라 하이라이트) */}
              <div
                className={cn(
                  "transition-all",
                  isSelected &&
                    "ring-2 ring-primary border-primary shadow-lg scale-[1.02]",
                )}
              >
                <TourCard tour={tour} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 일괄 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent aria-describedby="batch-delete-description">
          <DialogHeader>
            <DialogTitle>북마크 삭제 확인</DialogTitle>
            <DialogDescription id="batch-delete-description">
              선택한 {selectedIds.size}개의 북마크를 삭제하시겠습니까?
              <br />이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isPending}
              aria-label="삭제 취소"
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
              aria-label={`${selectedIds.size}개의 북마크 삭제`}
            >
              {isPending ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  삭제 중...
                </>
              ) : (
                "삭제"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 개별 삭제 확인 다이얼로그 */}
      <Dialog
        open={isSingleDeleteDialogOpen}
        onOpenChange={setIsSingleDeleteDialogOpen}
      >
        <DialogContent aria-describedby="single-delete-description">
          <DialogHeader>
            <DialogTitle>북마크 삭제 확인</DialogTitle>
            <DialogDescription id="single-delete-description">
              <span className="font-semibold">
                {singleDeleteTarget?.tourTitle}
              </span>
              의 북마크를 삭제하시겠습니까?
              <br />이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsSingleDeleteDialogOpen(false);
                setSingleDeleteTarget(null);
              }}
              disabled={isPending}
              aria-label="삭제 취소"
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmSingleDelete}
              disabled={isPending}
              aria-label={`${singleDeleteTarget?.tourTitle} 북마크 삭제`}
            >
              {isPending ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  삭제 중...
                </>
              ) : (
                "삭제"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
