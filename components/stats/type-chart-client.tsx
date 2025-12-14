/**
 * @file components/stats/type-chart-client.tsx
 * @description 타입별 관광지 분포 차트 클라이언트 컴포넌트
 *
 * 이 컴포넌트는 recharts를 사용하여 타입별 관광지 개수와 비율을 Donut Chart로 렌더링합니다.
 * 섹션 클릭 시 해당 타입의 관광지 목록 페이지로 이동하는 인터랙션을 제공합니다.
 *
 * 주요 기능:
 * - recharts PieChart로 Donut Chart 렌더링
 * - 섹션 클릭 이벤트 처리
 * - 호버 시 Tooltip 표시 (타입명, 개수, 비율)
 * - 반응형 디자인
 * - 접근성 지원
 *
 * @dependencies
 * - recharts: PieChart, Pie, Cell, Tooltip, Legend
 * - components/ui/chart.tsx: Chart 컴포넌트
 * - next/navigation: useRouter
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.6.2 관광 타입별 분포)
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
import type { TypeStats } from "@/lib/types/stats";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

/**
 * 숫자를 천 단위 구분 기호가 있는 문자열로 변환
 * @param num 숫자
 * @returns 포맷팅된 문자열 (예: 1234567 → "1,234,567")
 */
function formatNumber(num: number): string {
  return new Intl.NumberFormat("ko-KR").format(num);
}

/**
 * 차트 색상 팔레트 (8개 타입 구분)
 * shadcn/ui Chart의 chart-1 ~ chart-8 색상 사용
 */
const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
] as const;

export interface TypeChartClientProps {
  /** 타입별 통계 데이터 */
  typeStats: TypeStats[];
}

/**
 * 타입별 관광지 분포 차트 클라이언트 컴포넌트
 * @param {TypeChartClientProps} props - 컴포넌트 props
 * @returns {JSX.Element} 차트 요소
 */
export function TypeChartClient({ typeStats }: TypeChartClientProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // 차트 데이터 변환
  const chartData = typeStats.map((stat) => ({
    name: stat.typeName,
    value: stat.count,
    percentage: stat.percentage,
    contentTypeId: stat.contentTypeId,
  }));

  // ChartConfig 생성 (각 타입별 색상 설정)
  const chartConfig = chartData.reduce((acc, entry, index) => {
    acc[entry.contentTypeId] = {
      label: entry.name,
      color: CHART_COLORS[index % CHART_COLORS.length],
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  // 섹션 클릭 핸들러
  const handleSectionClick = (entry: (typeof chartData)[0]) => {
    if (entry && entry.contentTypeId) {
      router.push(`/?contentTypeId=${entry.contentTypeId}`);
    }
  };

  // 호버 시 섹션 확대 효과
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <PieChartIcon className="h-4 w-4" aria-hidden="true" />
        <span>전체 {chartData.length}개 타입</span>
      </div>

      <ChartContainer
        config={chartConfig}
        className="h-[300px] md:h-[400px] w-full"
      >
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="80%"
            dataKey="value"
            labelLine={false}
            role="img"
            aria-label="타입별 관광지 분포 차트"
            activeIndex={activeIndex}
            activeShape={
              {
                outerRadius: "85%",
                stroke: "hsl(var(--foreground))",
                strokeWidth: 2,
              } as any
            }
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                onClick={() => handleSectionClick(entry)}
                style={{ cursor: "pointer" }}
                className="transition-opacity hover:opacity-80"
              />
            ))}
          </Pie>
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <ChartTooltipContent>
                    <div className="space-y-1">
                      <p className="font-medium">{data.name}</p>
                      <p className="text-sm text-muted-foreground">
                        관광지 개수: {formatNumber(data.value)}개
                      </p>
                      <p className="text-sm text-muted-foreground">
                        비율: {data.percentage.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        클릭하여 해당 타입 관광지 보기
                      </p>
                    </div>
                  </ChartTooltipContent>
                );
              }
              return null;
            }}
          />
          <ChartLegend
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              return (
                <ChartLegendContent
                  payload={payload}
                  nameKey="contentTypeId"
                  className="flex-wrap justify-center gap-2 md:gap-4"
                />
              );
            }}
            verticalAlign="bottom"
          />
        </PieChart>
      </ChartContainer>

      <p className="text-xs text-muted-foreground text-center">
        차트 섹션을 클릭하면 해당 타입의 관광지 목록을 볼 수 있습니다.
      </p>
    </div>
  );
}
