import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY_NAP } from "@/dictionaries/common";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  title: "Политика конфиденциальности | ADLight",
  description: "Политика обработки персональных данных компании ADLight — изготовление вывесок и наружной рекламы в Астане.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Политика конфиденциальности</h1>
        <p className="text-sm text-slate-400 mb-10">Последнее обновление: январь 2025 г.</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">1. Общие положения</h2>
            <p>
              Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных
              пользователей сайта <strong>adlight.kz</strong>, принадлежащего{" "}
              <strong>{COMPANY_NAP.owner}</strong> (ИИН: {COMPANY_NAP.iin}), далее — «Оператор».
            </p>
            <p>
              Используя сайт, вы соглашаетесь с условиями настоящей Политики. Если вы не согласны,
              пожалуйста, покиньте сайт.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">2. Какие данные мы собираем</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Имя и контактный телефон (при заполнении формы заявки).</li>
              <li>Сообщение или описание задачи, оставленное в форме.</li>
              <li>Технические данные браузера (через Яндекс.Метрику): IP-адрес, тип устройства, страницы просмотра.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">3. Цели обработки данных</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Обработка заявок и обратная связь с клиентом.</li>
              <li>Расчёт стоимости и подготовка коммерческого предложения.</li>
              <li>Улучшение работы сайта на основе статистики посещений.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">4. Передача данных третьим лицам</h2>
            <p>
              Мы не продаём и не передаём ваши персональные данные третьим лицам, за исключением случаев,
              предусмотренных законодательством Республики Казахстан. Данные форм передаются через
              защищённый канал в Telegram-бот компании исключительно для обработки заявки.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">5. Cookies и аналитика</h2>
            <p>
              Сайт использует Яндекс.Метрику для анализа посещаемости. Вы можете отключить сбор
              данных Яндекс.Метрики, установив браузерное расширение{" "}
              <a
                href="https://yandex.ru/support/metrica/general/opt-out.html"
                target="_blank"
                rel="nofollow noreferrer"
                className="text-orange-600 underline"
              >
                Яндекс.Метрика. Отказ от отслеживания
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">6. Хранение и защита данных</h2>
            <p>
              Данные хранятся только в период, необходимый для обработки заявки. После завершения
              взаимодействия данные удаляются. Мы применяем технические и организационные меры
              для защиты информации от несанкционированного доступа.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">7. Ваши права</h2>
            <p>
              Вы вправе запросить удаление или уточнение ваших данных, направив письмо на адрес:{" "}
              <a href={`mailto:${COMPANY_NAP.email}`} className="text-orange-600 underline">
                {COMPANY_NAP.email}
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">8. Контакты</h2>
            <p>
              По вопросам, связанным с обработкой персональных данных, обращайтесь:
            </p>
            <address className="not-italic mt-2 space-y-1">
              <p><strong>{COMPANY_NAP.owner}</strong></p>
              <p>{COMPANY_NAP.legalAddress}</p>
              <p>
                Тел.:{" "}
                <a href={`tel:${COMPANY_NAP.phoneRaw}`} className="text-orange-600">
                  {COMPANY_NAP.phone}
                </a>
              </p>
              <p>
                Email:{" "}
                <a href={`mailto:${COMPANY_NAP.email}`} className="text-orange-600">
                  {COMPANY_NAP.email}
                </a>
              </p>
            </address>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link href="/" className="text-sm text-slate-500 hover:text-orange-600 transition-colors">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </main>
  );
}
