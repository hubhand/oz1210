/**
 * @file components/ui/toast.tsx
 * @description Toast 알림 컴포넌트 및 유틸리티
 *
 * 이 파일은 Sonner를 사용한 Toast 알림 기능을 제공합니다.
 * 성공, 에러, 경고, 정보 메시지를 표시할 수 있습니다.
 *
 * 사용 방법:
 * 1. app/layout.tsx에 <Toaster /> 추가
 * 2. toast.success(), toast.error() 등으로 알림 표시
 *
 * @example
 * ```tsx
 * // layout.tsx
 * import { Toaster } from '@/components/ui/toast';
 *
 * export default function Layout() {
 *   return (
 *     <>
 *       <Toaster />
 *       {children}
 *     </>
 *   );
 * }
 *
 * // 컴포넌트에서 사용
 * import { toast } from '@/components/ui/toast';
 *
 * toast.success('저장되었습니다!');
 * toast.error('오류가 발생했습니다.');
 * ```
 */
"use client";

import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { toast as sonnerToast } from "sonner";

/**
 * Toast 알림을 표시하는 함수들
 * Sonner의 toast 함수를 래핑하여 타입 안전성을 제공합니다.
 */
export const toast = {
  /**
   * 성공 메시지 표시
   * @param message - 표시할 메시지
   * @param options - 추가 옵션
   */
  success: (
    message: string,
    options?: Parameters<typeof sonnerToast.success>[1],
  ) => {
    return sonnerToast.success(message, options);
  },

  /**
   * 에러 메시지 표시
   * @param message - 표시할 메시지
   * @param options - 추가 옵션
   */
  error: (
    message: string,
    options?: Parameters<typeof sonnerToast.error>[1],
  ) => {
    return sonnerToast.error(message, options);
  },

  /**
   * 정보 메시지 표시
   * @param message - 표시할 메시지
   * @param options - 추가 옵션
   */
  info: (message: string, options?: Parameters<typeof sonnerToast.info>[1]) => {
    return sonnerToast.info(message, options);
  },

  /**
   * 경고 메시지 표시
   * @param message - 표시할 메시지
   * @param options - 추가 옵션
   */
  warning: (
    message: string,
    options?: Parameters<typeof sonnerToast.warning>[1],
  ) => {
    return sonnerToast.warning(message, options);
  },

  /**
   * 기본 메시지 표시
   * @param message - 표시할 메시지
   * @param options - 추가 옵션
   */
  message: (
    message: string,
    options?: Parameters<typeof sonnerToast.message>[1],
  ) => {
    return sonnerToast.message(message, options);
  },

  /**
   * Promise를 기반으로 한 로딩/성공/에러 토스트
   * @param promise - Promise 객체
   * @param messages - 로딩, 성공, 에러 메시지 객체
   * @param options - 추가 옵션
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    // options는 현재 사용하지 않음 (sonner의 promise는 2개의 인자만 받음)
  ) => {
    return sonnerToast.promise(promise, messages);
  },

  /**
   * 토스트 닫기
   * @param toastId - 닫을 토스트 ID (없으면 모든 토스트 닫기)
   */
  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },
};

/**
 * Toast 컨테이너 컴포넌트
 * app/layout.tsx에 추가하여 사용합니다.
 *
 * @example
 * ```tsx
 * import { Toaster } from '@/components/ui/toast';
 *
 * export default function Layout() {
 *   return (
 *     <>
 *       <Toaster />
 *       {children}
 *     </>
 *   );
 * }
 * ```
 */
export function Toaster() {
  return (
    <SonnerToaster position="top-right" expand={true} richColors closeButton />
  );
}
