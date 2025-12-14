/**
 * @file components/tour-search.tsx
 * @description 관광지 검색 컴포넌트
 *
 * 이 컴포넌트는 관광지 검색을 위한 UI를 제공합니다.
 * 검색 키워드 입력 및 검색 실행 기능을 포함합니다.
 *
 * 주요 기능:
 * - 검색창 UI (Input 컴포넌트)
 * - 검색 아이콘 표시
 * - 엔터 키 또는 검색 버튼으로 검색 실행
 * - URL 쿼리 파라미터와 동기화
 * - 검색어 초기화 (X 버튼)
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TourSearchProps {
  /** 추가 CSS 클래스 */
  className?: string;
  /** 검색창 너비 제한 (Navbar용) */
  compact?: boolean;
}

/**
 * 관광지 검색 컴포넌트
 * @param {TourSearchProps} props - 컴포넌트 props
 * @returns {JSX.Element} 검색 UI 요소
 */
export function TourSearch({ className, compact = false }: TourSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // URL에서 초기 검색어 읽기
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword") || "";
    setKeyword(urlKeyword);
  }, [searchParams]);

  /**
   * 검색 실행
   */
  const handleSearch = () => {
    if (!keyword.trim()) {
      // 검색어가 비어있으면 URL에서 keyword 제거
      const params = new URLSearchParams(searchParams.toString());
      params.delete("keyword");
      params.delete("pageNo"); // 페이지 번호 초기화
      router.push(`/?${params.toString()}`);
      return;
    }

    setIsSearching(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("keyword", keyword.trim());
    params.delete("pageNo"); // 페이지 번호 초기화
    router.push(`/?${params.toString()}`);

    // 검색 완료 후 로딩 상태 해제 (약간의 지연)
    setTimeout(() => setIsSearching(false), 500);
  };

  /**
   * 엔터 키 입력 핸들러
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  /**
   * 검색어 초기화
   */
  const handleClear = () => {
    setKeyword("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("keyword");
    params.delete("pageNo");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        {/* 검색 아이콘 */}
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />

        {/* 검색 입력창 */}
        <Input
          type="search"
          placeholder="관광지명, 주소, 설명으로 검색..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "pl-10 pr-20",
            compact && "w-full",
            !compact && "w-full max-w-lg",
          )}
          aria-label="관광지 검색"
        />

        {/* 검색어 삭제 버튼 (검색어가 있을 때만 표시) */}
        {keyword && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="검색어 삭제"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}

        {/* 검색 버튼 */}
        <Button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-3"
          aria-label="검색 실행"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
