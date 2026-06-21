
# Proteger Segurança Patrimonial - TKSISTENS

Este é um sistema de gestão operacional e estratégica desenvolvido para a Proteger Segurança Patrimonial.

## 🚀 Tecnologias Utilizadas

- **Framework**: Next.js 15+ (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS / ShadCN UI
- **Banco de Dados**: Google Cloud Firestore (Firebase)
- **Autenticação**: Firebase Authentication
- **IA**: Genkit / Google Gemini

## 💻 Rodando Localmente

1. Tenha o **Node.js 20 LTS** instalado.
2. No terminal da pasta do projeto:
   ```bash
   npm install
   npm run build
   npm run dev
   ```
3. Acesse `http://localhost:9002`.

## ☁️ Deploy na K2Host (cPanel / CloudLinux) - CHECKLIST

Para configurar corretamente no painel **"Setup Node.js App"** do cPanel:

1. **Application root**: O nome da pasta onde você subiu os arquivos (ex: `sistema`).
2. **Application URL**: Seu domínio principal ou subdomínio.
3. **Application startup file**: Digite exatamente `index.js` (ou `server.js`).
4. **Passenger log file**: Digite `passenger.log`.
5. **Node.js Version**: Selecione **20.x**.

### 🛠️ Estrutura de Compatibilidade (IMPORTANTE)
O sistema inclui uma pasta `/bin/sh/node` que atua como um "shim" para redirecionar as chamadas do servidor para o binário correto do Node.js, resolvendo erros de "No such file or directory" em ambientes CloudLinux restritos da K2Host.

### 🔑 Variáveis de Ambiente (Environment Variables)
Adicione no painel do cPanel:
- `NODE_ENV`: `production`
- `GOOGLE_GENAI_API_KEY`: `SUA_CHAVE_AQUI` (Obtenha em aistudio.google.com)

### ⚠️ REGRAS DO CLOUDLINUX (K2HOST)
- **NUNCA suba a pasta node_modules**. O servidor cria um link simbólico para ela.
- Se o servidor reclamar de `/usr/bin/node`, pare o app, mude a versão do Node para 18, salve, e volte para 20. Isso reseta os caminhos internos do cPanel.
- **ERRO 403 FORBIDDEN?**: O arquivo `.htaccess` foi adicionado à raiz para forçar o `PassengerEnabled on`. Verifique se ele está presente no seu Gerenciador de Arquivos.

### 🛠️ Passo a Passo para Iniciar (IMPORTANTE)

1. No painel "Setup Node.js App", clique em **"STOP APP"**.
2. Clique no botão azul **"Run NPM Install"**.
3. No terminal (ou via botão de scripts), rode:
   ```bash
   npm run build
   ```
4. Após o build terminar, clique em **"START APP"**.
5. Verifique o arquivo `passenger.log` no Gerenciador de Arquivos para confirmar que a mensagem "INTEGRAÇÃO CONCLUÍDA" apareceu.

---
"Cuidando de você e dos seus bens!"
