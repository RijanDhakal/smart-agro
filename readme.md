# SmartAgro

A voice-powered agricultural marketplace platform connecting farmers directly with consumers, eliminating middlemen and ensuring fair pricing for all parties.

## Problem Statement

The current agricultural supply chain presents significant challenges:

- Farmers sell crops at extremely low prices to middlemen
- Middlemen drastically increase prices before products reach consumers
- Off-season pricing becomes prohibitively expensive for consumers
- Farmers lack technical expertise to leverage e-commerce platforms
- Traditional market structures disadvantage both farmers and end users

## Solution

SmartAgro is an AI voice-powered platform that enables farmers to list their products in three simple clicks and monitor sales effectively. Users can purchase agricultural products at rates lower than market prices while ensuring farmers receive fair compensation.

### Core Features

**For Farmers:**
- Voice-powered product listing interface
- Simple three-click product upload process
- Real-time sales monitoring dashboard
- Direct connection to consumers without intermediaries

**For Consumers:**
- Access to fresh agricultural products at competitive prices
- Direct purchase from verified farmers
- Transparent pricing and product information
- Location-based product availability

**Verification System:**
- Citizenship document verification for farmer accounts
- Phone number-based authentication
- Immutable farmer location tracking to prevent false origin claims
- Product verification through photo uploads and admin approval

**Cold Storage Mapping:**
- Interactive map showing nearby cold storage facilities
- Detailed information about storage capacity and availability
- Strategic logistics planning support

## Future Development

### 1. Dynamic Pricing Algorithm

An AI-powered pricing system that analyzes:
- Order frequency patterns across regions
- Seasonal demand fluctuations
- Product freshness based on expected lifespan
- Market hotspots and consumer behavior

This system will automatically adjust prices to optimize sales while maintaining profitability for farmers and affordability for consumers.

### 2. Intelligent Logistics Management

AI-driven logistics system handling:
- Optimal delivery route calculation
- Cold storage allocation and management
- Automated shipping coordination
- Seasonal product preservation strategies

The system will enable storing seasonal products for off-season sales, generating significant profits while maintaining prices 50-200% lower than average retail markets.

### 3. Community Forum

A knowledge-sharing platform featuring:
- Question and answer system for agricultural queries
- AI-powered assistance for common farming issues
- Human expert consultation for complex problems
- Agricultural subsidy news and updates
- Government scheme notifications

**Current Progress:** News section implemented, displaying information about agricultural subsidies available to farmers.

## Technology Stack

### Frontend
- React
- Shadcn UI Component Library
- GSAP (Animation)
- Framer Motion (Animation)
- Maplibre GL (Mapping)
- Swiper (Carousel)

### Backend
- Node.js
- Express
- PostgreSQL (Database)
- Prisma (ORM)

### AI Integration
- ElevenLabs (Voice Interface)
- Google Gemini (AI Processing)

## Project Structure

```
TetraMan/
├── backend/          # Server-side application
│   ├── prisma/
│   ├── src/
│   ├── package.json
│   └── ...etc
│
└── frontend/         # Client-side application
    ├── src/
    ├── public/
    ├── package.json
    └── ...etc
```

## Team

This project was developed during a 48-hour hackathon with the theme "Smart Agriculture".

- **Sambhav Aryal** - Frontend Development
- **Rijan Dhakal** - Backend Development
- **Pratish Subedi** - Research
- **Pujan Pandey** - Assets and Design

## Links

- Presentation: [PPT](https://www.canva.com/design/DAG3Wrvb6l4/UoUrO-JtxU2Kw-A0hXf_Dg/edit)
- Live Website: [Website](http://localhost:5173) // Localhost

## Development Context

Developed as part of a 48-hour closed-theme hackathon focused on Smart Agriculture solutions. The project aims to address critical inefficiencies in the agricultural supply chain through technology-driven innovation.
