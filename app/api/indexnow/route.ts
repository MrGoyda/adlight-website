import { NextResponse } from 'next/server';
import { submitToIndexNow } from '@/lib/indexnow';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const urls: string[] = body.urls || [];

    if (!urls || urls.length === 0) {
      return NextResponse.json(
        { error: 'Укажите массив urls в теле запроса' },
        { status: 400 }
      );
    }

    const result = await submitToIndexNow(urls);

    if (result.success) {
      return NextResponse.json({
        message: 'URLs успешно отправлены в IndexNow (Bing + Yandex)',
        details: result,
      });
    } else {
      return NextResponse.json(
        { error: 'Ошибка при отправке в IndexNow', details: result },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
