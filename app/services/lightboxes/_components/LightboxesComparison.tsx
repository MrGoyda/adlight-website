// app/services/lightboxes/_components/LightboxesComparison.tsx

import { Layers, Maximize, CheckCircle } from "lucide-react";
import { lightboxesDetails } from "@/dictionaries/services/details/lightboxes";

export default function LightboxesComparison() {
  return (
    <section id="comparison" className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4 text-center tracking-tight">
          Сравнение материалов вывески: акриловое стекло или транслюцентный баннер
        </h2>
        <p className="text-slate-500 text-lg text-center mb-16 max-w-xl mx-auto leading-relaxed">
          {lightboxesDetails.comparisonDesc}
        </p>

        <div className="max-w-5xl mx-auto overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200">
                  <th className="p-6 text-sm font-bold text-slate-900 w-1/4">Характеристика</th>
                  <th className="p-6 text-sm font-bold text-orange-600 w-3/8 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> {lightboxesDetails.comparisonA.title}
                  </th>
                  <th className="p-6 text-sm font-bold text-slate-800 w-3/8">
                    <div className="flex items-center gap-2">
                      <Maximize className="w-4 h-4 text-slate-500" /> {lightboxesDetails.comparisonB.title}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                <tr className="hover:bg-slate-50/30 transition">
                  <td className="p-6 font-semibold text-slate-900">Лицевая панель</td>
                  <td className="p-6">Акриловое стекло Plexiglas (Германия) 3-4 мм. Идеальный глянец.</td>
                  <td className="p-6">Транслюцентная светорассеивающая ткань Backlit (650 г/м²).</td>
                </tr>
                <tr className="hover:bg-slate-50/30 transition">
                  <td className="p-6 font-semibold text-slate-900">Ограничение по размеру</td>
                  <td className="p-6">Ограничено размером листа (3.05 х 2.05 м). При больших габаритах нужен стык.</td>
                  <td className="p-6">Без ограничений. Натяжка единым полотном до 50 метров в длину.</td>
                </tr>
                <tr className="hover:bg-slate-50/30 transition">
                  <td className="p-6 font-semibold text-slate-900">Качество свечения</td>
                  <td className="p-6">Максимальное светопропускание, глубокий и насыщенный цвет, идеальное рассеивание.</td>
                  <td className="p-6">Равномерное свечение, высокая яркость, легкий матовый эффект.</td>
                </tr>
                <tr className="hover:bg-slate-50/30 transition">
                  <td className="p-6 font-semibold text-slate-900">Стыки и швы</td>
                  <td className="p-6 text-red-650">Заметные технологические швы при длине вывески свыше 3 метров.</td>
                  <td className="p-6 text-green-650 font-medium">100% бесшовная конструкция при любых габаритах.</td>
                </tr>
                <tr className="hover:bg-slate-50/30 transition">
                  <td className="p-6 font-semibold text-slate-900">Ценовая категория</td>
                  <td className="p-6">Выше среднего (от 80 000 ₸ / м²). Оптимально для премиальных бутиков.</td>
                  <td className="p-6">Экономичнее на больших площадях (от 90 000 ₸ / м²). Дешевле в обслуживании.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
