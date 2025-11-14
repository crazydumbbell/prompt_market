import { createAdminClient } from "@/lib/supabase/admin";
import { Prompt } from "@/types/database.types";
import PromptCard from "./components/PromptCard";
import { Heading, Text } from "./components/ui";

export default async function Home() {
  const supabase = createAdminClient();

  // Supabase에서 프롬프트 가져오기
  const { data: prompts, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // 에러 처리
  if (error) {
    console.error("❌ Supabase 프롬프트 조회 실패:", {
      message:
        error.message || "테이블이 존재하지 않거나 접근 권한이 없습니다.",
      hint: error.hint || "SETUP.md를 참고하여 Supabase 테이블을 생성해주세요.",
      code: error.code,
    });
  }

  console.log("📦 프롬프트 데이터 로드 완료:");
  console.log("  ✅ 전체:", prompts?.length || 0, "개");

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Hero Section */}
      <div className="bg-[var(--color-bg-secondary)] border-b-4 border-[var(--color-border-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center space-y-8">
            <Heading level="h1" className="text-6xl sm:text-7xl">
              AI 프롬프트 마켓
            </Heading>
            <Text
              size="large"
              color="secondary"
              className="max-w-2xl mx-auto text-xl"
            >
              전문가가 만든 고품질 AI 프롬프트를 구매하고,
              <br />더 나은 결과물을 만들어보세요
            </Text>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <a
                href="#prompts"
                className="px-8 py-4 bg-[var(--color-accent)] text-white border-2 border-[var(--color-border-primary)] font-bold uppercase tracking-wider hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.3)] transition-all text-center min-w-[200px]"
              >
                프롬프트 둘러보기
              </a>
              <a
                href="mailto:contact@promptmarket.com?subject=판매자 신청"
                className="px-8 py-4 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border-2 border-[var(--color-border-primary)] font-bold uppercase tracking-wider hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.2)] transition-all text-center min-w-[200px]"
              >
                판매자 되기
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-black text-[var(--color-bauhaus-red)] mb-2">
                  {prompts?.length || 0}+
                </div>
                <Text
                  size="small"
                  color="tertiary"
                  className="uppercase font-bold"
                >
                  프롬프트
                </Text>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-[var(--color-bauhaus-blue)] mb-2">
                  100+
                </div>
                <Text
                  size="small"
                  color="tertiary"
                  className="uppercase font-bold"
                >
                  만족한 고객
                </Text>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-[var(--color-bauhaus-yellow)] mb-2">
                  24/7
                </div>
                <Text
                  size="small"
                  color="tertiary"
                  className="uppercase font-bold"
                >
                  즉시 이용
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-[var(--color-bg-secondary)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-2 border-[var(--color-border-primary)] p-8 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_rgba(0,0,0,0.2)] transition-all">
              <div className="w-12 h-12 bg-[var(--color-bauhaus-red)] mb-4" />
              <Heading level="h3" className="mb-3">
                검증된 품질
              </Heading>
              <Text color="tertiary">
                전문가가 제작하고 테스트한 고품질 프롬프트만 제공합니다
              </Text>
            </div>
            <div className="border-2 border-[var(--color-border-primary)] p-8 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_rgba(0,0,0,0.2)] transition-all">
              <div className="w-12 h-12 bg-[var(--color-bauhaus-blue)] mb-4" />
              <Heading level="h3" className="mb-3">
                즉시 사용
              </Heading>
              <Text color="tertiary">
                구매 즉시 프롬프트를 확인하고 바로 사용할 수 있습니다
              </Text>
            </div>
            <div className="border-2 border-[var(--color-border-primary)] p-8 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_rgba(0,0,0,0.2)] transition-all">
              <div className="w-12 h-12 bg-[var(--color-bauhaus-yellow)] mb-4" />
              <Heading level="h3" className="mb-3">
                안전한 결제
              </Heading>
              <Text color="tertiary">
                토스페이먼츠를 통한 안전하고 빠른 결제를 지원합니다
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Prompts Section */}
      <div
        id="prompts"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        {prompts && prompts.length > 0 ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-[var(--color-accent)]" />
                <Heading level="h2">전체 프롬프트</Heading>
              </div>
              <Text color="tertiary">{prompts.length}개의 프롬프트</Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map((prompt: Prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-[var(--color-bg-tertiary)] mx-auto mb-6 flex items-center justify-center border-2 border-[var(--color-border-primary)]">
              <svg
                className="w-12 h-12 text-[var(--color-text-tertiary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <Heading level="h3" className="mb-4">
              프롬프트를 불러올 수 없습니다
            </Heading>
            <Text color="tertiary" className="mb-6">
              데이터를 불러오는 중 문제가 발생했습니다. 페이지를
              새로고침해주세요.
            </Text>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-[var(--color-accent)] border-t-4 border-b-4 border-[var(--color-border-primary)] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heading level="h2" className="text-white mb-4">
            당신의 프롬프트를 판매하세요
          </Heading>
          <Text size="large" className="text-white mb-8">
            전문 지식을 공유하고 수익을 창출할 수 있는 기회입니다
          </Text>
          <a
            href="mailto:contact@promptmarket.com?subject=판매자 신청&body=안녕하세요, 판매자로 등록하고 싶습니다.%0A%0A이름:%0A이메일:%0A전문 분야:%0A포트폴리오 링크:%0A"
            className="inline-block px-8 py-4 bg-white text-[var(--color-accent)] border-2 border-[var(--color-border-primary)] font-bold uppercase tracking-wider hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.5)] transition-all"
          >
            지금 신청하기
          </a>
        </div>
      </div>
    </div>
  );
}
