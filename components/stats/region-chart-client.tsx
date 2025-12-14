/**
 * @file components/stats/region-chart-client.tsx
 * @description 지역별 관광지 분포 차트 클라이언트 컴포넌트
 *
 * 이 컴포넌트는 recharts를 사용하여 지역별 관광지 개수를 Bar Chart로 렌더링합니다.
 * 바 클릭 시 해당 지역의 관광지 목록 페이지로 이동하는 인터랙션을 제공합니다.
 *
 * 주요 기능:
 * - recharts Bar Chart 렌더링
 * - 바 클릭 이벤트 처리
 * - 호버 시 Tooltip 표시
 * - 반응형 디자인
 * - 접근성 지원
 *
 * @dependencies
 * - recharts: BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
 * - components/ui/chart.tsx: Chart 컴포넌트
 * - next/navigation: useRouter
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.6.1 지역별 관광지 분포)
 */

"use client";

import { useRouter } from "next/navigation";
import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import type { RegionStats } from "@/lib/types/stats";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

/**
 * 숫자를 천 단위 구분 기호가 있는 문자열로 변환
 * @param num 숫자
 * @returns 포맷팅된 문자열 (예: 1234567 → "1,234,567")
 */
function formatNumber(num: number): string {
  return new Intl.NumberFormat("ko-KR").format(num);
}

export interface RegionChartClientProps {
  /** 지역별 통계 데이터 */
  regionStats: RegionStats[];
}

/**
 * 지역별 관광지 분포 차트 클라이언트 컴포넌트
 * @param {RegionChartClientProps} props - 컴포넌트 props
 * @returns {JSX.Element} 차트 요소
 */
export function RegionChartClient({ regionStats }: RegionChartClientProps) {
  const router = useRouter();

  // 상위 10개 지역만 표시
  const topRegions = regionStats.slice(0, 10);

  // 차트 데이터 변환
  const chartData = topRegions.map((stat) => ({
    name: stat.name,
    count: stat.count,
    code: stat.code,
  }));

  // 바 클릭 핸들러
  const handleBarClick = (entry: typeof chartData[0]) => {
    if (entry && entry.code) {
      router.push(`/?areaCode=${entry.code}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <BarChart3 className="h-4 w-4" aria-hidden="true" />
        <span>상위 {topRegions.length}개 지역</span>
      </div>

      <ChartContainer
        config={{
          count: {
            label: "관광지 개수",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-[300px] md:h-[400px] w-full"
      >
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          role="img"
          aria-label="지역별 관광지 분포 차트"
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            className="text-xs"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(value) => formatNumber(value)}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <ChartTooltipContent>
                    <div className="space-y-1">
                      <p className="font-medium">{data.name}</p>
                      <p className="text-sm text-muted-foreground">
                        관광지 개수: {formatNumber(data.count)}개
                      </p>
                      <p className="text-xs text-muted-foreground">
                        클릭하여 해당 지역 관광지 보기
                      </p>
                    </div>
                  </ChartTooltipContent>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="count"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
            className="cursor-pointer transition-opacity hover:opacity-80"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                onClick={() => handleBarClick(entry)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>

      <p className="text-xs text-muted-foreground text-center">
        막대를 클릭하면 해당 지역의 관광지 목록을 볼 수 있습니다.
      </p>
    </div>
  );
}

