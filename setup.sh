#!/bin/bash

echo "🚀 Iniciando setup do Cyberhouse..."

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não encontrado. Por favor, instale o Docker primeiro.${NC}"
    exit 1
fi

if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não encontrado. Por favor, instale o Docker Compose primeiro.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker e Docker Compose encontrados${NC}"

if [ ! -f .env ]; then
    echo -e "${BLUE}📝 Criando arquivo .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Arquivo .env criado. Por favor, configure as variáveis antes de continuar.${NC}"
    echo -e "${BLUE}Deseja editar o arquivo .env agora? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        ${EDITOR:-nano} .env
    fi
fi

echo -e "${BLUE}📁 Criando diretórios de dados...${NC}"
mkdir -p ./data/{postgres,uploads,logs/nginx,ssl}
echo -e "${GREEN}✅ Diretórios criados${NC}"

echo -e "${BLUE}🐳 Construindo e iniciando containers Docker...${NC}"
docker compose up -d --build

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Setup concluído com sucesso!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}🌐 Site disponível em: ${NC}http://localhost:8071"
echo -e "${BLUE}🔐 Painel Admin: ${NC}http://localhost:8071/painel"
echo ""
echo -e "${BLUE}📧 Credenciais padrão:${NC}"
echo -e "   Email: admin@cyberhouse.com.br"
echo -e "   Senha: admin123456"
echo ""
echo -e "${RED}⚠️  IMPORTANTE: Altere as credenciais padrão em produção!${NC}"
echo ""
echo -e "${BLUE}📊 Ver logs: ${NC}docker compose logs -f"
echo -e "${BLUE}🛑 Parar: ${NC}docker compose down"
echo ""
