import type { APIRoute } from 'astro';
import { extractContent } from '../../services/extractor';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    let { url } = body;

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'URL inválida o no proporcionada' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    url = url.trim();

    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    try {
      new URL(url);
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Formato de URL inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const extractedData = await extractContent(url);

    return new Response(
      JSON.stringify({ success: true, data: extractedData }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en /api/extract:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
