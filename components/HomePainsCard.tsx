import Image from "next/image";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface PillarItem {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  desc: string;
  buttonText: string;
  buttonHref: string;
  image: string;
  imageAlt: string;
  points: string[];
}

interface HomePainsCardProps {
  item: PillarItem;
  isEven: boolean;
}

export default function HomePainsCard({ item, isEven }: HomePainsCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row items-center gap-8 lg:gap-16 py-12 md:py-16 first:pt-0 last:pb-0 border-b border-slate-100 last:border-0",
        isEven ? "lg:flex-row" : "lg:flex-row-reverse"
      )}
    >
      {/* ТЕКСТОВАЯ КОЛОНКА */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-5">
        {/* Бадж-тег */}
        <div className="inline-flex">
          <span className="px-3.5 py-1 text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200/50 rounded-full">
            {item.tag}
          </span>
        </div>

        {/* Заголовок и подзаголовок */}
        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl md:text-3.5xl font-black text-slate-950 tracking-tight leading-tight">
            {item.title}
          </h3>
          <p className="text-sm sm:text-base font-bold text-slate-500 uppercase tracking-wider">
            {item.subtitle}
          </p>
        </div>

        {/* Описание */}
        <p className="text-slate-700 text-sm sm:text-base md:text-md leading-relaxed font-medium">
          {item.desc}
        </p>

        {/* Ключевые преимущества (Bullet Points) */}
        <ul className="space-y-2.5">
          {item.points.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-slate-800 text-sm sm:text-base font-semibold">
              <span className="text-orange-500 font-extrabold shrink-0 mt-0.5">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>


        {/* Кнопка действия */}
        <div className="pt-2">
          <Button href={item.buttonHref} variant="solid" size="md">
            {item.buttonText}
          </Button>
        </div>
      </div>

      {/* ГРАФИЧЕСКАЯ КОЛОНКА */}
      <div className="w-full lg:w-1/2 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
        {/* Декоративное свечение */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.04)_0%,transparent_70%)] rounded-full pointer-events-none" />

        <div className="w-full h-full rounded-3xl overflow-hidden border border-slate-200/80 shadow-[0_15px_40px_rgba(15,23,42,0.06)] hover:shadow-[0_30px_60px_rgba(15,23,42,0.12)] transition-all duration-500 relative bg-slate-50 group">
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            className="object-cover rounded-3xl group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
            loading="lazy"
          />
          {/* Тонкий блик по контуру */}
          <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none z-20" />
        </div>
      </div>
    </div>
  );
}
