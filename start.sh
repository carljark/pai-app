#!/bin/bash

echo "🚀 Levantando todo el entorno de desarrollo PAI..."
echo "==================================================="
echo "📦 1. Iniciando base de datos (MongoDB)"
echo "⚙️  2. Iniciando servidor Backend (Node/Express)"
echo "🎨 3. Iniciando servidor Frontend (Angular)"
echo ""
echo "Los contenedores tienen recarga en caliente habilitada."
echo "Pulsa Ctrl+C para detener todo."
echo "==================================================="

docker-compose up --build
