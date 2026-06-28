import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Inicialización diferida / segura de Gemini
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn('GEMINI_API_KEY no está configurada en las variables de entorno.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key || 'MOCK_KEY_FOR_BUILD',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Cargar la base de conocimiento para inyectar al prompt de Gemini
let bsgManualData: any = null;
async function loadManualData() {
  if (!bsgManualData) {
    try {
      // Importar dinámicamente o leer el archivo src/data/bsgManual.ts para evitar fallos de compilación
      // Dado que bsgManual es un archivo TS, podemos importar su versión compilada o simplemente importar directamente si estamos usando tsx.
      const bsgModule = await import('./src/data/bsgManual.js').catch(() => import('./src/data/bsgManual.ts'));
      bsgManualData = {
        glossary: bsgModule.GLOSSARY,
        chapters: bsgModule.CHAPTERS
      };
    } catch (err) {
      console.error('Error al cargar bsgManual:', err);
      bsgManualData = { glossary: [], chapters: [] };
    }
  }
  return bsgManualData;
}

// Ruta API para el asistente inteligente
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Mensajes inválidos o ausentes.' });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.json({
        reply: "⚠️ **Error de configuración**: El asistente de IA requiere la clave API `GEMINI_API_KEY` para responder. Por favor configure su API Key en el panel de **Settings > Secrets** para habilitar la funcionalidad de chat."
      });
    }

    const manual = await loadManualData();
    const cleanContext = {
      glosario: manual.glossary.map((g: any) => ({ t: g.term, d: g.definition })),
      capitulos: manual.chapters.map((c: any) => ({
        t: c.title,
        s: c.summary,
        secciones: c.sections.map((sec: any) => ({
          t: sec.title,
          c: sec.content,
          b: sec.bullets || [],
          ti: sec.tips || []
        }))
      }))
    };

    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      config: {
        systemInstruction: `Actúas como un asistente de IA oficial, experto en la metodología de "The Business Strategy Game" (BSG) para la carrera de Ingeniería Civil Industrial.
Tu único objetivo es ayudar al estudiante a comprender el funcionamiento del simulador y los conceptos que aparecen en el manual, basándote exclusivamente en la información contenida en la "Guía del Gerente".

REGLAS DE RESPUESTA CRÍTICAS:
1. Responde ÚNICA y EXCLUSIVAMENTE basándote en la información de la Guía del Gerente provista a continuación.
2. Si una pregunta NO puede responderse con la información del manual, o si el usuario te pide consejos externos, estrategias ganadoras mágicas para vencer a sus compañeros, o trucos fuera del manual, debes indicarlo clara y amablemente en español: "Lo siento, pero esa información o estrategia específica no está contemplada en la Guía del Gerente de BSG. Como asistente de estudio oficial, solo puedo responder preguntas basándome estrictamente en el contenido del manual."
3. NUNCA inventes datos, porcentajes, reglas o interpretaciones. Si no está en el manual, declina responder de manera asertiva.
4. Explica con claridad, de forma profesional, estructurada y utilizando negritas, listas o tablas si facilita la asimilación del concepto por parte del estudiante.
5. El tono debe ser de un profesor o mentor universitario experto en BSG de Ingeniería Civil Industrial: formal, preciso y alentador.

CONTEXTO DE LA GUÍA DEL GERENTE (JSON):
${JSON.stringify(cleanContext)}
`
      }
    });

    const reply = response.text || 'No se pudo generar respuesta en este momento.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Error en Gemini API:', error);
    res.status(500).json({ error: 'Error del servidor al procesar la solicitud de IA: ' + error.message });
  }
});

const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

async function bootstrap() {
  if (!isProd) {
    // En desarrollo, configurar Vite Dev Server programáticamente
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    
    app.use(vite.middlewares);
    
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await fs.readFile(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // En producción, servir los archivos construidos por Vite
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor full-stack iniciado en http://localhost:${PORT} (Modo: ${isProd ? 'Producción' : 'Desarrollo'})`);
  });
}

bootstrap().catch(err => {
  console.error('Fallo en el arranque del servidor:', err);
});
