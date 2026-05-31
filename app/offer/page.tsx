import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY_NAP } from "@/dictionaries/common";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  title: "Договор публичной оферты | ADLight",
  description: "Договор публичной оферты на оказание услуг по изготовлению и монтажу наружной рекламы компанией ADLight в Астане.",
  alternates: { canonical: `${SITE_URL}/offer` },
  robots: { index: false },
};

export default function OfferPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Договор публичной оферты</h1>
        <p className="text-sm text-slate-400 mb-10">Последнее обновление: январь 2025 г.</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">1. Стороны договора</h2>
            <p>
              <strong>Исполнитель:</strong> {COMPANY_NAP.owner}, ИИН {COMPANY_NAP.iin},
              юридический адрес: {COMPANY_NAP.legalAddress}.
            </p>
            <p>
              <strong>Заказчик:</strong> любое физическое или юридическое лицо, принявшее условия
              настоящей оферты путём подачи заявки через сайт <strong>adlight.kz</strong>,
              по телефону или в мессенджере.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">2. Предмет договора</h2>
            <p>
              Исполнитель обязуется по заданию Заказчика изготовить и/или произвести монтаж
              рекламных конструкций (вывески, объёмные буквы, световые короба, баннеры и иные
              виды наружной рекламы), а Заказчик обязуется принять и оплатить результат работ
              в соответствии с согласованной сметой.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">3. Порядок заключения договора</h2>
            <p>
              Договор считается заключённым с момента подтверждения Заказчиком согласованной
              сметы и внесения авансового платежа (предоплаты). Подтверждением может служить
              ответ в мессенджере, электронная переписка или подписанный счёт.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">4. Стоимость и оплата</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Стоимость определяется индивидуально на основании согласованного технического задания.</li>
              <li>Предоплата составляет 50% от стоимости заказа.</li>
              <li>Оставшаяся сумма вносится после готовности изделия, до монтажа.</li>
              <li>Оплата производится наличными, переводом на карту или банковским переводом.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">5. Сроки выполнения</h2>
            <p>
              Сроки изготовления согласовываются индивидуально при оформлении заказа и зависят от
              сложности конструкции. Стандартный срок изготовления — от 3 до 14 рабочих дней.
              Срок монтажа оговаривается дополнительно.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">6. Гарантии</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Гарантия на светодиодные модули — до 36 месяцев.</li>
              <li>Гарантия на конструктивные элементы и монтаж — 12 месяцев.</li>
              <li>Гарантия не распространяется на механические повреждения, возникшие по вине третьих лиц или вследствие форс-мажора.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">7. Права и обязанности сторон</h2>
            <p><strong>Исполнитель обязуется:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Выполнить работы в согласованные сроки.</li>
              <li>Обеспечить качество, соответствующее согласованному макету.</li>
              <li>Уведомить Заказчика о готовности изделия.</li>
            </ul>
            <p className="mt-3"><strong>Заказчик обязуется:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Своевременно предоставить необходимые материалы (фото места, логотип, ТЗ).</li>
              <li>Произвести оплату в согласованные сроки.</li>
              <li>Обеспечить доступ к месту монтажа.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">8. Ответственность сторон</h2>
            <p>
              Стороны несут ответственность за неисполнение обязательств в соответствии с
              законодательством Республики Казахстан. Исполнитель не несёт ответственности за
              задержки, вызванные несвоевременным предоставлением информации Заказчиком или
              форс-мажорными обстоятельствами.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">9. Разрешение споров</h2>
            <p>
              Все споры разрешаются путём переговоров. При невозможности достижения согласия —
              в судебном порядке по месту нахождения Исполнителя в соответствии с законодательством
              Республики Казахстан.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">10. Реквизиты Исполнителя</h2>
            <address className="not-italic space-y-1">
              <p><strong>{COMPANY_NAP.owner}</strong></p>
              <p>ИИН: {COMPANY_NAP.iin}</p>
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
              <p>Банк: {COMPANY_NAP.bankName}</p>
              <p>ИИК: {COMPANY_NAP.iik}</p>
              <p>БИК: {COMPANY_NAP.bik}</p>
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
