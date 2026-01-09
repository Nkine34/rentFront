```bash
# Installez nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Rechargez la configuration (ou redémarrez le terminal)
source ~/.bashrc

# Installez la dernière version LTS de Node.js
nvm install --lts

# Activez corepack (inclus avec Node.js récent) pour gérer pnpm
corepack enable
corepack prepare pnpm@latest --activate

# Si corepack ne fonctionne pas, utilisez npm classique :
# npm install -g pnpm

rm -rf node_modules
pnpm install
pnpm start
```
