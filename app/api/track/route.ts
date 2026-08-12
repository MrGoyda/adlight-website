import { NextResponse } from 'next/server';

// Edge runtime — выполняется на ближайшем Vercel CDN-узле, мгновенный старт
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventName, eventData = {}, clientId, fbp } = body;

    // Реальный IP и User-Agent пользователя (критично для GA4 геопозиции и Meta)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '';
    const userAgent = request.headers.get('user-agent') || '';

    const ga4Secret = process.env.GA4_API_SECRET;
    const ga4MeasurementId = process.env.GA4_MEASUREMENT_ID; // G-8HHR00E9DN

    const fbToken = process.env.META_ACCESS_TOKEN;
    const fbPixelId = process.env.META_PIXEL_ID;

    // --- 1. Google Analytics 4 Measurement Protocol ---
    // Все запросы fire-and-forget (без await), чтобы не блокировать ответ клиенту
    if (ga4Secret && ga4MeasurementId && clientId) {
      fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${ga4MeasurementId}&api_secret=${ga4Secret}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: clientId,
            // Передаём IP и UA для корректной геолокации и сегментации устройств
            user_ip_override: ip,
            user_agent: userAgent,
            events: [
              {
                name: eventName,
                params: {
                  ...eventData,
                  engagement_time_msec: '1',
                  debug_mode: 1,
                },
              },
            ],
          }),
        }
      ).catch(console.error);
    }

    // --- 2. Meta (Facebook) Conversions API ---
    if (fbToken && fbPixelId) {
      // Маппинг наших событий → стандартные события Meta
      const metaEventMap: Record<string, string> = {
        generate_lead: 'Lead',
        form_header_consultation: 'Lead',
        form_quiz_calculator: 'Lead',
        form_cta_bottom: 'Lead',
        form_calculate_price: 'Lead',
        purchase:      'Purchase',
        page_view:     'PageView',
        click_whatsapp: 'Contact',
        click_phone:   'Contact',
        click_telegram: 'Contact',
        click_instagram: 'Contact',
        calculator_submit: 'Lead',
      };
      const metaEventName = metaEventMap[eventName] ?? 'CustomEvent';

      fetch(
        `https://graph.facebook.com/v19.0/${fbPixelId}/events?access_token=${fbToken}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: [
              {
                event_name: metaEventName,
                event_time: Math.floor(Date.now() / 1000),
                event_id: `${eventName}_${Date.now()}`, // Дедупликация
                user_data: {
                  client_ip_address: ip,
                  client_user_agent: userAgent,
                  // fbp берётся из куки _fbp (если пользователь ранее видел пиксель)
                  ...(fbp ? { fbp } : {}),
                },
                custom_data: eventData,
                action_source: 'website',
              },
            ],
          }),
        }
      ).catch(console.error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[/api/track] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
