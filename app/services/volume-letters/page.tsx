import Calculator from "../../../components/Calculator"; 
import Link from "next/link";
import { ArrowLeft, Layers, Zap, ShieldCheck } from "lucide-react";

export default function VolumeLettersPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] pb-20">
      
      {/* Хлебные крошки / Назад */}
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-orange-500 transition text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> На главную
        </Link>
      </div>

      <div className="container mx-auto px-4 grid lg:grid-cols-[1fr_1.2fr] gap-16">
          
          {/* Описание слева */}
          <div className="space-y-8">
            <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Объемные буквы <br/><span className="text-orange-500">в Астане</span>
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed">
                Самый популярный и надежный вид наружной рекламы. Мы используем только линзованные диоды и немецкий акрил, чтобы вывеска горела ярко и равномерно в любые морозы.
                </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-5 bg-slate-900 rounded-xl border border-slate-800 flex gap-4 hover:border-slate-700 transition">
                 <div className="bg-slate-800 p-3 h-min rounded-lg"><Layers className="text-orange-500 w-6 h-6"/></div>
                 <div>
                    <h4 className="text-white font-bold text-lg">Материалы</h4>
                    <p className="text-gray-400 text-sm mt-1">Лицевая часть: Акрил Plexiglas (Германия). Борт: Алюминий с полимерной покраской (не ржавеет).</p>
                 </div>
              </div>
              <div className="p-5 bg-slate-900 rounded-xl border border-slate-800 flex gap-4 hover:border-slate-700 transition">
                 <div className="bg-slate-800 p-3 h-min rounded-lg"><Zap className="text-blue-500 w-6 h-6"/></div>
                 <div>
                    <h4 className="text-white font-bold text-lg">Электрика</h4>
                    <p className="text-gray-400 text-sm mt-1">Герметичные модули IP67. Блоки питания с запасом мощности 30% (чтобы не перегорали).</p>
                 </div>
              </div>
              <div className="p-5 bg-slate-900 rounded-xl border border-slate-800 flex gap-4 hover:border-slate-700 transition">
                 <div className="bg-slate-800 p-3 h-min rounded-lg"><ShieldCheck className="text-green-500 w-6 h-6"/></div>
                 <div>
                    <h4 className="text-white font-bold text-lg">Гарантия</h4>
                    <p className="text-gray-400 text-sm mt-1">12 месяцев официальной гарантии на целостность конструкции и подсветку.</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Калькулятор справа */}
          <div className="lg:mt-4">
            <Calculator />
          </div>
      </div>
    </div>
  );
}