import { Typography } from "@/shared/ui";

interface TrendingPaperItem {
  id: number;
  title: string;
  trendType: "single_up" | "double_up" | "double_down";
}

interface TrendingPapersProps {
  papers: TrendingPaperItem[];
}

export default function TrendingPapers({ papers }: TrendingPapersProps) {
  const getTrendIcon = (
    trendType: "single_up" | "double_up" | "double_down"
  ) => {
    switch (trendType) {
      case "single_up":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.52864 5.52857C7.78897 5.26823 8.21111 5.26823 8.47144 5.52857L12.4714 9.52858C12.7318 9.78891 12.7318 10.211 12.4714 10.4714C12.2111 10.7317 11.789 10.7317 11.5286 10.4714L8.00004 6.94278L4.47145 10.4714C4.21109 10.7317 3.78899 10.7317 3.52863 10.4714C3.26829 10.211 3.26829 9.78891 3.52863 9.52858L7.52864 5.52857Z"
              fill="#991B05"
            />
          </svg>
        );
      case "double_up":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.5286 3.52857C7.78893 3.26823 8.21107 3.26823 8.4714 3.52857L11.8047 6.86191C12.0651 7.12225 12.0651 7.54438 11.8047 7.80471C11.5444 8.06505 11.1223 8.06505 10.8619 7.80471L8 4.94279L5.13807 7.80471C4.87772 8.06505 4.45561 8.06505 4.19526 7.80471C3.93491 7.54438 3.93491 7.12225 4.19526 6.86191L7.5286 3.52857Z"
              fill="#991B05"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.5286 8.19525C7.78893 7.93492 8.21107 7.93492 8.4714 8.19525L11.8047 11.5286C12.0651 11.7889 12.0651 12.211 11.8047 12.4714C11.5444 12.7317 11.1223 12.7317 10.8619 12.4714L8 9.60945L5.13807 12.4714C4.87772 12.7317 4.45561 12.7317 4.19526 12.4714C3.93491 12.211 3.93491 11.7889 4.19526 11.5286L7.5286 8.19525Z"
              fill="#991B05"
            />
          </svg>
        );
      case "double_down":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.19526 3.52857C4.45561 3.26823 4.87772 3.26823 5.13807 3.52857L8 6.39051L10.8619 3.52857C11.1223 3.26823 11.5444 3.26823 11.8047 3.52857C12.0651 3.78893 12.0651 4.21103 11.8047 4.47139L8.4714 7.80471C8.21107 8.06505 7.78893 8.06505 7.5286 7.80471L4.19526 4.47139C3.93491 4.21103 3.93491 3.78893 4.19526 3.52857Z"
              fill="#7D7D7D"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.19526 8.19525C4.45561 7.93492 4.87772 7.93492 5.13807 8.19525L8 11.0572L10.8619 8.19525C11.1223 7.93492 11.5444 7.93492 11.8047 8.19525C12.0651 8.45558 12.0651 8.87772 11.8047 9.13805L8.4714 12.4714C8.21107 12.7317 7.78893 12.7317 7.5286 12.4714L4.19526 9.13805C3.93491 8.87772 3.93491 8.45558 4.19526 8.19525Z"
              fill="#7D7D7D"
            />
          </svg>
        );
    }
  };

  return (
    <div className="flex w-[286px] p-[var(--spacing-14)] px-[var(--spacing-16)] flex-col items-start gap-[var(--spacing-10)] rounded-[var(--radius-16)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
      <Typography.BodyLarge
        color="default"
        as="h3"
      >
        실시간 인기 논문
      </Typography.BodyLarge>

      <div className="flex flex-col items-start gap-[var(--spacing-12)] self-stretch">
        {papers.map((paper) => (
          <div
            key={paper.id}
            className="flex items-center justify-between self-stretch cursor-pointer hover:opacity-70 transition-opacity"
          >
            <div className="flex items-center gap-[var(--spacing-8)] flex-1 overflow-hidden">
              <Typography.Subtext
                color="subtle"
                className="w-[10px] flex-shrink-0"
              >
                {paper.id}
              </Typography.Subtext>
              <Typography.Subtext
                color="default"
                className="flex-1 line-clamp-1"
              >
                {paper.title}
              </Typography.Subtext>
            </div>
            <div className="flex items-center gap-[var(--spacing-4)] flex-shrink-0">
              {getTrendIcon(paper.trendType)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
