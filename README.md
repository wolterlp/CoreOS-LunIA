# Cerebro Empresarial IA

Una plataforma de inteligencia artificial empresarial diseñada para convertirse en el principal asesor, analista, secretario, coordinador y sistema de automatización de una empresa.

## Visión General
No es un ERP tradicional, no es un chatbot y no es únicamente una IA. Su objetivo es convertirse en una capa inteligente por encima de toda la operación empresarial.

### Problema que resuelve
Actualmente las empresas tienen información dispersa (ERP, CRM, Inventario, Facturación, etc.). La información existe, pero no se transforma automáticamente en conocimiento útil para la toma de decisiones.

### Objetivo Principal
Construir un asistente empresarial inteligente que sea capaz de:
- Comprender la empresa y cómo funciona.
- Aprender y recordar decisiones anteriores.
- Analizar información y detectar problemas.
- Sugerir soluciones y automatizar tareas.
- Coordinar agentes IA y guiar el crecimiento.

### Filosofía del Sistema
"La empresa trabaja. La IA observa, aprende, analiza y ayuda a dirigir."
La IA funciona como Consejero, Analista, Secretario, Coordinador y Sistema de Monitoreo.

## Arquitectura del Sistema (8 Capas)

1. **Capa 1: Conectores de Datos**: Extracción automática de SQL, ERPs, APIs, Excel, etc.
2. **Capa 2: Motor de Comprensión Empresarial**: Construcción de un modelo interno de la organización.
3. **Capa 3: Memoria Empresarial**:
   - **Operativa**: Estado actual, ventas, inventario.
   - **Estratégica**: Objetivos a largo plazo, decisiones clave.
   - **Aprendizaje**: Registro de aciertos y fracasos de recomendaciones.
4. **Capa 4: Motor de Inteligencia Artificial**: Cerebro principal utilizando LLMs (Gemini, GPT, Claude) + Herramientas y Agentes.
5. **Capa 5: Analizador Automático de Bases de Datos**: Escaneo dinámico de estructuras y generación automática de consultas SQL (Solo lectura por defecto).
6. **Capa 6: Motor de Simulación Estratégica**: Visualización de futuros posibles y escenarios "What-if".
7. **Capa 7: Sistema de Automatización**: Ejecución de acciones (Ventas, Compras, Finanzas) con niveles de aprobación (Manual, Supervisado, Autónomo).
8. **Capa 8: Secretaria Virtual y Controlador de Agentes**: Gestión de agenda, recordatorios contextuales y coordinación de agentes especializados (Marketing, Comercial, Financiero, Operativo).

## Características Clave
- **Implementación On-Premise**: Privacidad total y soberanía de datos.
- **Optimización de Contexto**: Capa de resumen inteligente para manejar grandes volúmenes de datos.
- **Heartbeat (Pulso)**: Autonomía real con ejecución asíncrona 24/7.
- **Identidad Persistente**: Definida a través de `user.md` y `soul.md`.

## Roadmap de Desarrollo
- **Fase 1 (MVP)**: Conexión a BD, Chat inteligente, Consultas básicas, Memoria básica.
- **Fase 2**: Simulación, Alertas proactivas, Automatización básica.
- **Fase 3**: Agentes especializados, Secretaria virtual, Comunicación integrada.
- **Fase 4**: Aprendizaje avanzado, Coordinación autónoma total.

## Tech Stack
### Backend
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- AI Adapters (OpenAI, Gemini, Anthropic)

### Frontend
- React + Vite + TypeScript
- TailwindCSS
- Zustand for state management

### Asesoría Económica y Estratégica
El sistema no solo analiza datos, sino que actúa como un **Mentor Empresarial de alto nivel**. Utiliza marcos de trabajo de grandes corporaciones para guiar el crecimiento de la PyME, analizando Unit Economics, KPIs estratégicos y rutas de madurez empresarial.

---
*Este proyecto busca construir el "Sistema Operativo Inteligente para Empresas".*
