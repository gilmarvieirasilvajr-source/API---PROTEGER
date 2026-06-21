
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')
const path = require('path')

// Força o ambiente para production se não estiver em desenvolvimento local
const dev = process.env.NODE_ENV === 'development'
const hostname = 'localhost'
const port = process.env.PORT || 9002

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production'
}

console.log('------------------------------------------------------------');
console.log(`>>> SISTEMA PROTEGER: Iniciando motor em modo ${process.env.NODE_ENV}...`);
console.log(`>>> PORTA: ${port}`);
console.log(`>>> IA API KEY: ${process.env.GOOGLE_GENAI_API_KEY ? 'CONFIGURADA' : 'AUSENTE (IA desativada)'}`);
console.log('------------------------------------------------------------');

// Verificação de segurança para o diretório .next (crítico para cPanel)
const nextDir = path.join(__dirname, '.next');
if (!dev && !fs.existsSync(nextDir)) {
  console.error('>>> ERRO DE INTEGRAÇÃO: Pasta ".next" não encontrada.');
  
  // Servidor de fallback para evitar 403/500 genérico e informar o usuário
  createServer((req, res) => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`
      <div style="font-family:sans-serif; padding: 40px; text-align: center; background: #fff;">
        <h1 style="color: #e11d48; font-size: 24px;">⚠️ Build não encontrado</h1>
        <p style="color: #64748b;">O diretório de produção <strong>.next</strong> está ausente.</p>
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; display: inline-block; margin-top: 20px; text-align: left;">
          <strong>Como resolver na K2Host:</strong>
          <ol>
            <li>No painel "Setup Node.js App", clique em <strong>STOP APP</strong>.</li>
            <li>Clique em <strong>Run NPM Install</strong>.</li>
            <li>No terminal (ou botão de scripts), execute: <code>npm run build</code></li>
            <li>Após terminar, clique em <strong>START APP</strong>.</li>
          </ol>
        </div>
      </div>
    `);
  }).listen(port);
  return;
}

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Erro ao processar requisição:', req.url, err)
      res.statusCode = 500
      res.end('Erro Interno de Servidor')
    }
  })
    .once('error', (err) => {
      console.error('Erro Crítico no Servidor:', err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`>>> INTEGRAÇÃO CONCLUÍDA: Sistema rodando em http://${hostname}:${port}`);
    })
}).catch((err) => {
  console.error('>>> FALHA NA PREPARAÇÃO DO NEXT.JS:');
  console.error(err);
  createServer((req, res) => {
    res.statusCode = 500;
    res.end('Falha na preparação do Next.js. Verifique o arquivo passenger.log.');
  }).listen(port);
});
