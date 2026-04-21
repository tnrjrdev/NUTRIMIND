import type { IfoodCategory } from "../types/ifood.types";

type IfoodCategoryCardProps = {
  category: IfoodCategory;
};

export function IfoodCategoryCard({ category }: IfoodCategoryCardProps) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between rounded-[22px] border border-transparent bg-[#f7eed5] px-5 py-5 text-left text-sm font-semibold text-[#3f3b34] shadow-[0_10px_30px_rgba(145,101,21,0.08)] transition hover:bg-[#f2e6c5]"
    >
      <span className="inline-flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e9d9a5] text-emerald-800 shadow-sm">
          ✓
        </span>
        <div>
          <p>{category.title}</p>
          <p className="mt-1 text-xs font-normal text-[#7f723d]">{category.description}</p>
        </div>
      </span>
      <span className="text-lg font-semibold text-emerald-800">›</span>
    </button>
  );
}
