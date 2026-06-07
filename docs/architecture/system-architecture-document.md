# Financial Market Forecasting — System Architecture Document

> **Document Type**: Software Architecture Document (SAD) + Technical Design Document (TDD) + Machine Learning Design Document  
> **Version**: 1.0  
> **Author**: Senior Architecture Review  
> **Date**: June 6, 2026  
> **Project**: Financial-Marketing-Forecasting  
> **Status**: ✅ APPROVED — June 6, 2026

---

## Table of Contents

1. [Product Requirements](#1-product-requirements)
2. [Architecture Design](#2-architecture-design)
3. [Technology Selection](#3-technology-selection)
4. [Database Design](#4-database-design)
5. [Machine Learning Architecture](#5-machine-learning-architecture)
6. [Feature Engineering](#6-feature-engineering)
7. [Data Pipeline Design](#7-data-pipeline-design)
8. [Model Training Pipeline](#8-model-training-pipeline)
9. [Prediction Service Design](#9-prediction-service-design)
10. [Frontend Design](#10-frontend-design)
11. [Real-Time Data Architecture](#11-real-time-data-architecture)
12. [Authentication & Security](#12-authentication--security)
13. [Scalability Design](#13-scalability-design)
14. [MLOps Architecture](#14-mlops-architecture)
15. [DevOps Design](#15-devops-design)
16. [Monitoring & Observability](#16-monitoring--observability)
17. [Backtesting Engine](#17-backtesting-engine)
18. [AI Market Insights](#18-ai-market-insights)
19. [Project Folder Structure](#19-project-folder-structure)
20. [Development Roadmap](#20-development-roadmap)
21. [Critical Reality Check](#21-critical-reality-check)
22. [Final Recommendation](#22-final-recommendation)

---

## 1. Product Requirements

### 1.1 Target Users

| Persona | Description | Primary Need |
|---------|-------------|--------------|
| **Retail Trader** | Individual investor trading stocks/crypto/forex with ₹50K–₹50L portfolio | Directional signals, confidence scores, simple UI |
| **Quantitative Analyst** | Quant at a prop trading desk or hedge fund | Backtesting, model comparison, alpha signal analysis |
| **Data Science Student** | Final-year student or early-career ML engineer | Learning, experimentation, project portfolio |
| **Financial Advisor** | RIA or wealth manager serving multiple clients | Portfolio view, multi-asset insights, client reporting |
| **Algo Trading Developer** | Developer building automated trading systems | API access, model integration, low-latency predictions |

### 1.2 User Stories

**Epic 1 — Data Management**
- As a trader, I want to upload my historical CSV/Excel trading data so I can run predictions on my preferred assets.
- As a quant, I want to connect to live market APIs (Yahoo Finance, Alpha Vantage) so I can stream real-time OHLCV data.
- As a user, I want the system to validate and clean my uploaded data so I don't get garbage predictions.

**Epic 2 — Visualization**
- As a trader, I want to see interactive candlestick charts with technical indicators (RSI, MACD, Bollinger Bands) so I can perform visual analysis.
- As a user, I want to overlay prediction signals on price charts so I can see where the model predicts UP or DOWN.

**Epic 3 — Predictions**
- As a trader, I want to select an asset and time horizon and get a UP/DOWN prediction with a confidence score.
- As a quant, I want to see which features contributed most to a prediction (feature importance / SHAP values).
- As a user, I want to view historical prediction accuracy so I can assess model reliability.

**Epic 4 — Backtesting**
- As a quant, I want to run a strategy backtest on historical data and see Sharpe Ratio, Max Drawdown, Win Rate, and equity curve.
- As a trader, I want to compare multiple model strategies side-by-side to pick the best one.

**Epic 5 — Portfolio & Persistence**
- As a user, I want to save my predictions, watchlists, and portfolios so I can track performance over time.
- As an advisor, I want to manage multiple portfolios for different clients.

**Epic 6 — AI Insights**
- As a trader, I want AI-generated market summaries explaining what's happening and why the model predicts what it does.

### 1.3 Functional Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| FR-01 | Upload CSV/Excel historical data with validation | P0 |
| FR-02 | Connect to Yahoo Finance, Alpha Vantage, FRED APIs | P0 |
| FR-03 | Interactive charting with 15+ technical indicators | P0 |
| FR-04 | Binary classification prediction (UP/DOWN) with confidence | P0 |
| FR-05 | Multi-model inference (Random Forest, XGBoost, LSTM, Transformer) | P0 |
| FR-06 | Backtesting engine with Sharpe, Drawdown, Win Rate metrics | P1 |
| FR-07 | Portfolio management with position tracking | P1 |
| FR-08 | AI-generated market insights using LLM | P2 |
| FR-09 | User authentication with JWT/OAuth | P0 |
| FR-10 | Real-time price updates via WebSocket | P1 |
| FR-11 | Model comparison dashboard | P1 |
| FR-12 | Alert system for price/prediction thresholds | P2 |
| FR-13 | Admin panel for model management and user administration | P1 |
| FR-14 | Export predictions and reports (PDF, CSV) | P2 |
| FR-15 | Multi-horizon predictions (1-day, 5-day, 15-day) | P1 |

### 1.4 Non-Functional Requirements

| Category | Requirement | Target |
|----------|------------|--------|
| **Performance** | Prediction API latency | < 500ms p95 |
| **Performance** | Chart rendering time | < 2s for 5 years data |
| **Performance** | Data upload processing | < 30s for 10MB file |
| **Availability** | System uptime | 99.5% (MVP), 99.9% (enterprise) |
| **Scalability** | Concurrent users | 1,000 (Phase 1) → 100,000 (Phase 4) |
| **Security** | Data encryption | AES-256 at rest, TLS 1.3 in transit |
| **Security** | Auth token expiry | Access: 15min, Refresh: 7 days |
| **Compliance** | Data retention | User data purged on account deletion (GDPR) |
| **Reliability** | Model retraining | Weekly automated, with drift detection triggers |
| **Observability** | Log retention | 30 days hot, 1 year cold storage |

### 1.5 Business Goals

1. **Democratize quantitative analysis** — Make ML-powered trading insights accessible to non-technical retail traders.
2. **Build a research platform** — Provide quants and students a sandbox for strategy experimentation.
3. **Establish credibility** — Track and display transparent model accuracy metrics; never oversell predictions.
4. **Scale to enterprise** — Design for eventual B2B licensing to advisory firms and prop desks.

### 1.6 Monetization Possibilities

| Tier | Price | Features |
|------|-------|----------|
| **Free** | ₹0 | 3 predictions/day, basic charts, 1 portfolio |
| **Pro** | ₹499/mo | Unlimited predictions, backtesting, all indicators, 10 portfolios |
| **Enterprise** | ₹4,999/mo | API access, custom models, priority support, white-label, SLA |
| **API-only** | ₹1,999/mo | RESTful API access, rate-limited, for algo traders |

> [!WARNING]
> **Regulatory Risk**: In India, SEBI regulates investment advice. This platform must display disclaimers that predictions are for educational/informational purposes only and do NOT constitute financial advice. Consult a SEBI-registered advisor before trading.

### 1.7 Risks and Limitations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Overfitting** | Models appear accurate in backtests but fail live | Walk-forward validation, out-of-sample testing, ensemble methods |
| **Data Leakage** | Future data leaks into training, inflating accuracy | Strict time-based splits, pipeline audits, feature store timestamps |
| **Market Regime Change** | Models trained on bull market fail in bear market | Volatility-regime-specific models (already in your notebook pipeline) |
| **API Rate Limits** | Yahoo Finance / Alpha Vantage throttling | Caching, request queuing, fallback data sources |
| **Regulatory** | SEBI compliance for investment advice | Disclaimers, no automated order execution, educational framing |
| **Survivorship Bias** | Training only on currently listed stocks | Include delisted stocks in historical data |
| **Latency** | ML inference too slow for real-time use | Model quantization, ONNX export, batch prediction caching |

---

## 2. Architecture Design

### 2.1 High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A["Next.js Frontend<br/>(React 19, TypeScript)"]
    end

    subgraph "API Gateway"
        B["Nginx / Traefik<br/>Load Balancer + SSL"]
    end

    subgraph "Backend Services"
        C["NestJS API Server<br/>(Node.js, TypeScript)"]
        D["FastAPI ML Service<br/>(Python 3.11+)"]
    end

    subgraph "Data Layer"
        E["TimescaleDB<br/>(Time-Series + Relational)"]
        F["Redis<br/>(Cache + Pub/Sub + Queue)"]
        G["MongoDB Atlas<br/>(Feature Store + Documents)"]
    end

    subgraph "ML Infrastructure"
        H["MLflow<br/>(Experiment Tracking)"]
        I["Model Registry<br/>(Versioned Artifacts)"]
        J["Celery Workers<br/>(Training Jobs)"]
    end

    subgraph "External APIs"
        K["Yahoo Finance"]
        L["Alpha Vantage"]
        M["FRED API"]
        N["GDELT"]
    end

    subgraph "Auth & Security"
        O["JWT + OAuth 2.0<br/>(Passport.js)"]
    end

    subgraph "Monitoring"
        P["Prometheus + Grafana<br/>OpenTelemetry + Loki"]
    end

    A -->|"HTTPS/WSS"| B
    B --> C
    B --> D
    C --> E
    C --> F
    C --> G
    C -->|"gRPC/REST"| D
    D --> E
    D --> F
    D --> G
    D --> H
    D --> I
    D --> J
    C --> K
    C --> L
    C --> M
    C --> N
    C --> O
    C --> P
    D --> P
```

### 2.2 Request Flow Architecture

```mermaid
sequenceDiagram
    participant U as User Browser
    participant NG as Nginx
    participant FE as Next.js SSR
    participant BE as NestJS API
    participant RD as Redis Cache
    participant ML as FastAPI ML Service
    participant DB as TimescaleDB
    participant MF as MLflow

    U->>NG: HTTPS Request
    NG->>FE: Static/SSR Route
    FE->>BE: API Call (JWT in header)
    BE->>BE: Validate JWT + RBAC
    BE->>RD: Check Cache
    alt Cache Hit
        RD-->>BE: Cached Result
    else Cache Miss
        BE->>ML: POST /predict
        ML->>DB: Fetch Features
        ML->>ML: Run Inference
        ML->>MF: Log Prediction
        ML-->>BE: Prediction Response
        BE->>RD: Store in Cache (TTL: 5min)
    end
    BE-->>FE: JSON Response
    FE-->>U: Rendered Page
```

### 2.3 Data Flow Architecture

```mermaid
graph LR
    subgraph "Data Sources"
        A1["Yahoo Finance API"]
        A2["Alpha Vantage API"]
        A3["FRED API"]
        A4["GDELT API"]
        A5["User CSV Upload"]
    end

    subgraph "Ingestion Layer"
        B1["Data Validators"]
        B2["Schema Enforcement"]
        B3["Rate Limiter"]
    end

    subgraph "Processing Layer"
        C1["Cleaning Pipeline"]
        C2["Feature Engineering"]
        C3["Normalization"]
    end

    subgraph "Storage Layer"
        D1["TimescaleDB<br/>(OHLCV + Predictions)"]
        D2["MongoDB Atlas<br/>(Feature Store)"]
        D3["Redis<br/>(Hot Cache)"]
    end

    subgraph "ML Layer"
        E1["Model Inference"]
        E2["Batch Predictions"]
        E3["Retraining Pipeline"]
    end

    A1 & A2 & A3 & A4 & A5 --> B1
    B1 --> B2 --> B3
    B3 --> C1 --> C2 --> C3
    C3 --> D1 & D2
    D1 & D2 --> E1 & E2 & E3
    E1 --> D3
    E3 --> D2
```

### 2.4 Microservice Communication

```mermaid
graph TB
    subgraph "Synchronous (REST/gRPC)"
        S1["Client → NestJS: User actions, auth"]
        S2["NestJS → FastAPI: Single predictions"]
        S3["NestJS → TimescaleDB: CRUD operations"]
    end

    subgraph "Asynchronous (Redis Streams / Celery)"
        A1["NestJS → Redis Queue: Backtest job"]
        A2["Redis Queue → Celery Worker: Execute backtest"]
        A3["NestJS → Redis Queue: Retraining trigger"]
        A4["Redis Queue → Celery Worker: Model training"]
    end

    subgraph "Real-Time (WebSocket / SSE)"
        R1["Market Data Feed → NestJS Gateway"]
        R2["NestJS Gateway → Client: Price updates"]
        R3["ML Service → Redis Pub/Sub: Prediction updates"]
        R4["NestJS → Client: Prediction push"]
    end
```

---

## 3. Technology Selection

### 3.1 Frontend

| Criteria | React (CRA) | Next.js | Vue.js |
|----------|-------------|---------|--------|
| **SSR/SSG** | ❌ Requires additional setup | ✅ Built-in (App Router) | ⚠️ Nuxt.js needed |
| **SEO** | ❌ Poor (SPA) | ✅ Excellent | ⚠️ Requires Nuxt |
| **Performance** | ⚠️ Client-side only | ✅ Server components, streaming | ✅ Good |
| **TypeScript** | ✅ Good | ✅ First-class | ✅ Good |
| **Ecosystem** | ✅ Largest | ✅ Inherits React ecosystem | ⚠️ Smaller |
| **Charting** | ✅ Many options | ✅ Many options | ✅ Many options |
| **Learning Curve** | ✅ Moderate | ⚠️ Moderate-High | ✅ Low |
| **Community** | ✅ Very large | ✅ Very large | ⚠️ Large |
| **Real-time** | ✅ Manual setup | ✅ Built-in WS support | ✅ Manual setup |

> **✅ Recommendation: Next.js 16 (Already in use)**
>
> **Rationale**: Your project already uses Next.js 16 with React 19 and TypeScript. Next.js provides SSR for SEO-critical landing pages, Server Components for reducing client bundle size (important when loading heavy charting libraries), and the App Router for intuitive file-based routing. The React ecosystem gives access to TradingView's Lightweight Charts, Recharts, and Plotly.js for financial visualization.

### 3.2 Backend

| Criteria | Node.js (Express) | NestJS | FastAPI (Python) | Django |
|----------|-------------------|--------|-----------------|--------|
| **Architecture** | ❌ No opinion | ✅ Opinionated (Angular-style) | ⚠️ Minimal | ✅ Batteries-included |
| **TypeScript** | ⚠️ Optional | ✅ Native | ❌ Python only | ❌ Python only |
| **Performance** | ✅ High (V8) | ✅ High (built on Express/Fastify) | ✅ Very High (async) | ⚠️ Moderate |
| **WebSockets** | ✅ ws/socket.io | ✅ Built-in Gateway | ✅ Built-in | ⚠️ Channels needed |
| **Auth/RBAC** | ⚠️ Manual | ✅ Guards, decorators | ⚠️ Manual | ✅ Built-in |
| **Validation** | ⚠️ Manual | ✅ class-validator, pipes | ✅ Pydantic | ✅ Serializers |
| **Testing** | ⚠️ Manual setup | ✅ Jest integration | ✅ pytest | ✅ Built-in |
| **ML Integration** | ❌ Poor | ⚠️ Via REST to Python | ✅ Native Python | ✅ Native Python |
| **Team Skills** | ✅ JS/TS | ✅ JS/TS | ✅ Python | ✅ Python |

> **✅ Recommendation: NestJS (Backend API) + FastAPI (ML Service)**
>
> **Rationale**: Using a hybrid approach leverages the best of both worlds. NestJS provides enterprise-grade structure (modules, guards, interceptors, pipes) for the business logic API, authentication, WebSocket gateway, and data management — all in TypeScript, sharing types with your Next.js frontend. FastAPI handles the ML inference service in Python where your models (sklearn, XGBoost, PyTorch, TensorFlow) natively run. This avoids the anti-pattern of serializing ML models across language boundaries.

### 3.3 ML Service

| Criteria | FastAPI | Flask | Ray Serve |
|----------|---------|-------|-----------|
| **Async Support** | ✅ Native async/await | ❌ Synchronous (needs Celery) | ✅ Async |
| **Validation** | ✅ Pydantic models | ❌ Manual | ⚠️ Custom |
| **Auto Docs** | ✅ OpenAPI/Swagger | ❌ Manual | ❌ None |
| **Performance** | ✅ ASGI (uvicorn) | ⚠️ WSGI | ✅ Very high |
| **ML Integration** | ✅ Excellent | ✅ Good | ✅ Excellent |
| **Scaling** | ⚠️ Horizontal (multiple instances) | ⚠️ Same | ✅ Built-in autoscaling |
| **Complexity** | ✅ Low | ✅ Very Low | ❌ High (Ray cluster) |
| **Production Ready** | ✅ Yes | ⚠️ Needs extensions | ✅ Yes |

> **✅ Recommendation: FastAPI**
>
> **Rationale**: FastAPI is the industry standard for ML serving. Pydantic models enforce strict request/response validation (critical for financial data), async support handles concurrent inference requests without blocking, and automatic OpenAPI documentation accelerates frontend integration. Ray Serve is overkill at current scale — if you hit >10K concurrent predictions/second, migrate inference to Ray Serve or Triton behind FastAPI.

### 3.4 Database

| Criteria | PostgreSQL | TimescaleDB | MongoDB |
|----------|-----------|-------------|---------|
| **Time-Series** | ⚠️ Possible with partitioning | ✅ Native hypertables, compression | ❌ Poor |
| **Relational** | ✅ Full ACID | ✅ Full ACID (is PostgreSQL) | ❌ No joins |
| **OHLCV Queries** | ⚠️ Slow at scale | ✅ Optimized (continuous aggregates) | ⚠️ Aggregation pipeline |
| **Compression** | ⚠️ Manual | ✅ 90%+ compression on time-series | ⚠️ WiredTiger |
| **SQL** | ✅ Full | ✅ Full PostgreSQL SQL | ❌ MQL only |
| **Scaling** | ✅ Read replicas | ✅ Read replicas + chunking | ✅ Sharding |
| **Ecosystem** | ✅ Massive | ✅ Inherits PostgreSQL | ✅ Large |

> **✅ Recommendation: TimescaleDB (Primary) + MongoDB Atlas (Feature Store)**
>
> **Rationale**: Your data is fundamentally time-series (OHLCV prices, predictions, indicators). TimescaleDB is PostgreSQL with time-series superpowers — hypertables auto-partition by time, continuous aggregates pre-compute candlestick rollups, and columnar compression achieves 90%+ storage reduction. You keep full SQL and ACID compliance for user/auth/portfolio tables. MongoDB Atlas is already in your stack for the feature store and document-oriented data (model metadata, experiment configs). This is a proven pattern in quantitative finance.

### 3.5 Caching

| Criteria | Redis | Memcached |
|----------|-------|-----------|
| **Data Structures** | ✅ Strings, Lists, Sets, Hashes, Sorted Sets, Streams | ❌ Strings only |
| **Pub/Sub** | ✅ Built-in | ❌ None |
| **Persistence** | ✅ RDB + AOF | ❌ None |
| **Message Queue** | ✅ Redis Streams | ❌ None |
| **Cluster Mode** | ✅ Redis Cluster | ✅ Consistent hashing |
| **Memory Efficiency** | ⚠️ Higher overhead per key | ✅ More efficient for simple KV |

> **✅ Recommendation: Redis**
>
> **Rationale**: Redis serves triple duty — caching (prediction results, API responses), pub/sub (real-time price broadcasting to WebSocket clients), and job queuing (via Redis Streams or Bull/BullMQ for NestJS). Memcached is faster for simple string caching but lacks the data structures and pub/sub needed for real-time features.

### 3.6 Message Queue

| Criteria | Kafka | RabbitMQ | Redis Streams |
|----------|-------|----------|---------------|
| **Throughput** | ✅ Millions/sec | ⚠️ Tens of thousands/sec | ✅ Hundreds of thousands/sec |
| **Ordering** | ✅ Per partition | ⚠️ Per queue | ✅ Per stream |
| **Persistence** | ✅ Disk-based log | ✅ Configurable | ✅ AOF |
| **Complexity** | ❌ High (ZooKeeper/KRaft) | ⚠️ Moderate | ✅ Low (already have Redis) |
| **Use Case** | ✅ Event streaming, CDC | ✅ Task queues, routing | ✅ Lightweight streaming |
| **Ops Overhead** | ❌ High | ⚠️ Moderate | ✅ Zero additional infra |

> **✅ Recommendation: Redis Streams (Phase 1–3) → Kafka (Phase 4)**
>
> **Rationale**: At MVP scale (1K–10K users), Redis Streams eliminates an entire infrastructure component. Since Redis is already required for caching and pub/sub, using Streams for task queuing (backtest jobs, retraining triggers) and event streaming (market data ingestion) is operationally simpler. Migrate to Kafka only when you need true event sourcing, multi-datacenter replication, or >100K events/second throughput (Phase 4 enterprise scale).

---

## 4. Database Design

### 4.1 Entity-Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ PORTFOLIOS : owns
    USERS ||--o{ PREDICTIONS : requests
    USERS ||--o{ BACKTESTS : runs
    USERS ||--o{ ALERTS : creates
    USERS ||--o{ AUDIT_LOGS : generates
    USERS ||--o{ API_KEYS : has

    PORTFOLIOS ||--o{ PORTFOLIO_POSITIONS : contains

    PREDICTIONS }o--|| ML_MODELS : uses
    PREDICTIONS }o--|| TRADING_DATA : references

    BACKTESTS }o--|| ML_MODELS : uses
    BACKTESTS ||--o{ BACKTEST_RESULTS : produces

    ML_MODELS ||--o{ MODEL_VERSIONS : has
    ML_MODELS ||--o{ MODEL_METRICS : tracks

    TRADING_DATA ||--o{ TECHNICAL_INDICATORS : has

    USERS {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar full_name
        enum role "free|pro|enterprise|admin"
        jsonb preferences
        timestamp created_at
        timestamp updated_at
        timestamp last_login
        boolean is_active
        boolean email_verified
    }

    TRADING_DATA {
        bigint id PK
        varchar symbol
        varchar market "stock|crypto|forex"
        timestamp datetime
        decimal open
        decimal high
        decimal low
        decimal close
        bigint volume
        decimal adj_close
        varchar source "yahoo|alphavantage|upload"
        timestamp ingested_at
    }

    TECHNICAL_INDICATORS {
        bigint id PK
        bigint trading_data_id FK
        decimal rsi_14
        decimal macd
        decimal macd_signal
        decimal macd_histogram
        decimal ema_12
        decimal ema_26
        decimal sma_20
        decimal sma_50
        decimal sma_200
        decimal bb_upper
        decimal bb_middle
        decimal bb_lower
        decimal atr_14
        decimal vwap
        decimal obv
        decimal adx
        decimal stoch_k
        decimal stoch_d
    }

    PREDICTIONS {
        uuid id PK
        uuid user_id FK
        uuid model_id FK
        varchar symbol
        enum direction "UP|DOWN"
        decimal confidence
        integer horizon_days
        jsonb feature_importance
        jsonb shap_values
        decimal actual_result "null until resolved"
        boolean is_correct "null until resolved"
        timestamp predicted_at
        timestamp resolved_at
    }

    ML_MODELS {
        uuid id PK
        varchar name
        varchar algorithm "rf|xgboost|lstm|transformer"
        varchar version
        enum status "training|active|retired|failed"
        jsonb hyperparameters
        jsonb training_config
        varchar artifact_path
        timestamp created_at
        timestamp retired_at
    }

    MODEL_VERSIONS {
        uuid id PK
        uuid model_id FK
        varchar version_tag
        decimal accuracy
        decimal precision_score
        decimal recall
        decimal f1_score
        decimal sharpe_ratio
        varchar artifact_uri
        jsonb metadata
        timestamp trained_at
    }

    MODEL_METRICS {
        bigint id PK
        uuid model_id FK
        varchar metric_name
        decimal metric_value
        timestamp recorded_at
    }

    BACKTESTS {
        uuid id PK
        uuid user_id FK
        uuid model_id FK
        varchar symbol
        timestamp start_date
        timestamp end_date
        jsonb strategy_config
        enum status "pending|running|completed|failed"
        timestamp created_at
        timestamp completed_at
    }

    BACKTEST_RESULTS {
        uuid id PK
        uuid backtest_id FK
        decimal total_return
        decimal sharpe_ratio
        decimal max_drawdown
        decimal win_rate
        integer total_trades
        integer winning_trades
        integer losing_trades
        decimal avg_win
        decimal avg_loss
        decimal profit_factor
        decimal calmar_ratio
        jsonb equity_curve
        jsonb daily_returns
        jsonb trade_log
    }

    PORTFOLIOS {
        uuid id PK
        uuid user_id FK
        varchar name
        text description
        decimal initial_capital
        decimal current_value
        timestamp created_at
        timestamp updated_at
    }

    PORTFOLIO_POSITIONS {
        uuid id PK
        uuid portfolio_id FK
        varchar symbol
        decimal quantity
        decimal avg_entry_price
        decimal current_price
        decimal unrealized_pnl
        timestamp opened_at
        timestamp updated_at
    }

    ALERTS {
        uuid id PK
        uuid user_id FK
        varchar symbol
        enum alert_type "price_above|price_below|prediction_up|prediction_down"
        decimal threshold
        boolean is_triggered
        boolean is_active
        timestamp created_at
        timestamp triggered_at
    }

    API_KEYS {
        uuid id PK
        uuid user_id FK
        varchar key_hash UK
        varchar key_prefix
        varchar name
        enum permissions "read|write|admin"
        integer rate_limit
        boolean is_active
        timestamp created_at
        timestamp expires_at
        timestamp last_used_at
    }

    AUDIT_LOGS {
        bigint id PK
        uuid user_id FK
        varchar action
        varchar resource_type
        varchar resource_id
        jsonb old_value
        jsonb new_value
        inet ip_address
        varchar user_agent
        timestamp created_at
    }
```

### 4.2 Index Strategy

```sql
-- Trading Data: Time-series queries are the hottest path
CREATE INDEX idx_trading_data_symbol_datetime ON trading_data (symbol, datetime DESC);
CREATE INDEX idx_trading_data_market_datetime ON trading_data (market, datetime DESC);

-- Predictions: User dashboard queries
CREATE INDEX idx_predictions_user_date ON predictions (user_id, predicted_at DESC);
CREATE INDEX idx_predictions_symbol_date ON predictions (symbol, predicted_at DESC);
CREATE INDEX idx_predictions_unresolved ON predictions (resolved_at) WHERE resolved_at IS NULL;

-- Backtests: User history
CREATE INDEX idx_backtests_user_status ON backtests (user_id, status, created_at DESC);

-- Audit: Compliance queries
CREATE INDEX idx_audit_user_date ON audit_logs (user_id, created_at DESC);
CREATE INDEX idx_audit_action ON audit_logs (action, created_at DESC);

-- TimescaleDB Hypertable (for trading_data)
SELECT create_hypertable('trading_data', 'datetime', chunk_time_interval => INTERVAL '1 month');
SELECT add_compression_policy('trading_data', INTERVAL '3 months');
```

### 4.3 TimescaleDB Continuous Aggregates

```sql
-- Pre-compute daily OHLCV from tick data (if ingesting tick-level)
CREATE MATERIALIZED VIEW daily_ohlcv
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 day', datetime) AS bucket,
    symbol,
    first(open, datetime) AS open,
    max(high) AS high,
    min(low) AS low,
    last(close, datetime) AS close,
    sum(volume) AS volume
FROM trading_data
GROUP BY bucket, symbol;

-- Refresh policy
SELECT add_continuous_aggregate_policy('daily_ohlcv',
    start_offset => INTERVAL '3 days',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour');
```

---

## 5. Machine Learning Architecture

### 5.1 Model Comparison

| Model | Pros | Cons | Complexity | Accuracy Potential | Recommendation |
|-------|------|------|------------|-------------------|----------------|
| **Logistic Regression** | Fast, interpretable, baseline | Linear boundaries, weak with interactions | ⭐ Very Low | ⭐⭐ Low | Baseline only |
| **Random Forest** | Handles non-linearity, robust to outliers, feature importance | Memory intensive, slow on large data | ⭐⭐ Low | ⭐⭐⭐ Moderate | ✅ Baseline |
| **XGBoost** | Best tabular performance, regularization, handles missing values | Requires careful tuning, overfitting risk | ⭐⭐⭐ Moderate | ⭐⭐⭐⭐ High | ✅ Primary |
| **LightGBM** | Faster than XGBoost, lower memory, categorical feature support | Less stable with small data | ⭐⭐⭐ Moderate | ⭐⭐⭐⭐ High | ✅ Ensemble |
| **CatBoost** | Best with categoricals, less tuning needed, symmetric trees | Slower training | ⭐⭐ Low | ⭐⭐⭐⭐ High | Consider for mixed features |
| **LSTM** | Captures temporal dependencies, sequence modeling | Vanishing gradients, slow training, overfitting | ⭐⭐⭐⭐ High | ⭐⭐⭐ Moderate | ✅ Sequence model |
| **GRU** | Faster than LSTM, fewer parameters, similar performance | Less expressive than LSTM for long sequences | ⭐⭐⭐ Moderate | ⭐⭐⭐ Moderate | Alternative to LSTM |
| **Transformer** | Attention mechanism, parallelizable, captures long-range deps | Data hungry, expensive, overkill for short sequences | ⭐⭐⭐⭐⭐ Very High | ⭐⭐⭐⭐ High* | ✅ Advanced |

> *Transformer accuracy potential is high but requires substantially more data and compute than gradient-boosted trees for marginal improvement.

### 5.2 Recommended Architecture: Multi-Model Ensemble

```mermaid
graph TB
    subgraph "Feature Store"
        F1["Technical Features<br/>(RSI, MACD, BB, etc.)"]
        F2["Market Features<br/>(Volume, Volatility, Momentum)"]
        F3["Sentiment Features<br/>(News, GDELT)"]
        F4["Macro Features<br/>(Rates, Inflation, GDP)"]
    end

    subgraph "Regime Detection"
        R1["Volatility Clustering<br/>(HMM / K-Means)"]
    end

    subgraph "Model Layer"
        M1["XGBoost<br/>(Primary — Tabular)"]
        M2["LightGBM<br/>(Ensemble Member)"]
        M3["LSTM/GRU<br/>(Sequence Patterns)"]
        M4["Transformer<br/>(Long-Range Dependencies)"]
    end

    subgraph "Ensemble Layer"
        E1["Stacking Meta-Learner<br/>(Logistic Regression)"]
        E2["Confidence Calibration<br/>(Platt Scaling / Isotonic)"]
    end

    subgraph "Output"
        O1["Direction: UP/DOWN"]
        O2["Confidence: 0.0–1.0"]
        O3["Feature Importance"]
    end

    F1 & F2 & F3 & F4 --> R1
    R1 -->|"Regime Label"| M1 & M2 & M3 & M4
    F1 & F2 & F3 & F4 --> M1 & M2
    F1 & F2 & F3 & F4 -->|"Sequence"| M3 & M4
    M1 & M2 & M3 & M4 -->|"Raw Probabilities"| E1
    E1 --> E2
    E2 --> O1 & O2 & O3
```

> [!IMPORTANT]
> **Critical Design Decision**: Use **regime-specific models**. Your notebook pipeline (notebooks 12, 22, 23) already clusters stocks by volatility regime. The production system should route predictions through the correct regime-specific model, not a single global model. This is one of the most impactful architectural decisions for financial ML.

### 5.3 Recommended Primary Model: XGBoost + LightGBM Ensemble

**Why not deep learning first?**

1. **Data volume**: With ~5 years of daily data × 100 stocks = ~125,000 samples. This is small by deep learning standards. XGBoost/LightGBM excel at this scale.
2. **Feature importance**: Gradient-boosted trees provide native feature importance and integrate cleanly with SHAP. This is critical for explainability in financial applications.
3. **Training speed**: XGBoost trains in seconds/minutes vs. hours for Transformer on similar data.
4. **Robustness**: Tree models are more robust to noise in financial data (high signal-to-noise ratio problem).

**When to use LSTM/Transformer**: As ensemble members for capturing temporal patterns that trees miss (e.g., multi-day momentum patterns, regime transitions). The meta-learner combines their outputs with tree predictions.

---

## 6. Feature Engineering

### 6.1 Technical Indicators

| Feature | Formula / Description | Impact on Prediction | Implementation |
|---------|----------------------|---------------------|----------------|
| **RSI (14)** | Relative Strength Index — momentum oscillator [0, 100] | Identifies overbought (>70) / oversold (<30) conditions. Strong mean-reversion signal. | `ta.momentum.RSIIndicator` |
| **MACD** | EMA(12) - EMA(26), with Signal line = EMA(9) of MACD | Trend-following signal. Crossovers predict direction changes. MACD histogram captures momentum shifts. | `ta.trend.MACD` |
| **EMA (12, 26, 50)** | Exponential Moving Average — weighted recent prices | Faster trend identification than SMA. EMA crossovers (12/26, 50/200) are classic signals. | `ta.trend.EMAIndicator` |
| **SMA (20, 50, 200)** | Simple Moving Average — equal-weighted | SMA-200 is the "institutional" trend line. Price above SMA-200 = bullish bias. Golden/Death cross (50/200). | `pandas.rolling().mean()` |
| **VWAP** | Volume-Weighted Average Price | Institutional reference price. Price > VWAP = buying pressure. More relevant for intraday, less for daily. | `ta.volume.VolumeWeightedAveragePrice` |
| **ATR (14)** | Average True Range — volatility measure | Quantifies volatility. Used for position sizing and stop-loss placement. High ATR = uncertain prediction. | `ta.volatility.AverageTrueRange` |
| **Bollinger Bands (20, 2)** | SMA(20) ± 2×StdDev(20) | Band width = volatility proxy. Price touching bands = potential reversal. Squeeze = pending breakout. | `ta.volatility.BollingerBands` |
| **ADX** | Average Directional Index — trend strength | ADX > 25 = trending market (momentum models work). ADX < 20 = ranging (mean-reversion models work). | `ta.trend.ADXIndicator` |
| **Stochastic Oscillator** | %K and %D lines — momentum comparison | Identifies overbought/oversold with momentum confirmation. Divergence from price = reversal signal. | `ta.momentum.StochasticOscillator` |
| **OBV** | On-Balance Volume — cumulative volume direction | Volume leading price. Rising OBV + flat price = accumulation (bullish). | `ta.volume.OnBalanceVolumeIndicator` |

### 6.2 Market Features

| Feature | Description | Impact |
|---------|-------------|--------|
| **Volume Ratio** | `Volume / SMA(Volume, 20)` | Abnormal volume = institutional activity. >2x = significant event. Strong predictor of next-day volatility. |
| **Realized Volatility** | `StdDev(returns, 20)` annualized | High volatility = wider prediction intervals. Models should output lower confidence in high-vol regimes. |
| **Momentum (10, 20)** | `Close / Close_Ndays_ago - 1` | Captures trend persistence. Works in trending markets, fails in mean-reverting markets. Must pair with ADX. |
| **Trend Strength** | `abs(Close - SMA_50) / ATR_14` | Normalized distance from trend. High values = extended trend (potential reversal). |
| **Volume-Price Correlation** | `corr(Volume, abs(Return), 20)` | Measures conviction. High correlation = price moves backed by volume (sustainable). |

### 6.3 Time Features

| Feature | Encoding | Impact |
|---------|----------|--------|
| **Day of Week** | Cyclical: `sin(2π × day/5)`, `cos(2π × day/5)` | Monday effect (historically negative), Friday effect (position squaring). Cyclical encoding avoids ordinal assumption. |
| **Week of Month** | Integer [1-5] or one-hot | Options expiry week (3rd Friday in US, last Thursday in India) = higher volatility. |
| **Trading Session** | Is market open, pre-market, after-hours | Only relevant for intraday. For daily predictions, encode if data includes after-hours. |
| **Days to Expiry** | Integer — days until F&O expiry | Critical for Indian markets (Nifty weekly/monthly expiry). Expiry week = significantly different behavior. |
| **Month** | Cyclical: `sin(2π × month/12)`, `cos(2π × month/12)` | "Sell in May" effect, year-end window dressing, budget month (February in India). |

### 6.4 Statistical Features

| Feature | Formula | Impact |
|---------|---------|--------|
| **Rolling Mean (5, 10, 20)** | `SMA(Close, N)` | Smoothed price trend — reduces noise for model input. |
| **Rolling Std (5, 10, 20)** | `StdDev(Close, N)` | Local volatility measure. Expanding std = increasing uncertainty. |
| **Log Returns** | `ln(Close_t / Close_{t-1})` | Normalizes price changes across assets. Approximately normal distribution. **Use returns, not raw prices, as features.** |
| **Lag Features (1, 2, 3, 5, 10)** | `Return_{t-N}` | Auto-correlation signal. If lag-1 return is positive AND lag-2 is positive, momentum continuation is more likely. |
| **Return Skewness (20)** | `Skew(returns, 20)` | Positive skew = more upside outliers. Negative skew = tail risk (crash risk). |
| **Return Kurtosis (20)** | `Kurt(returns, 20)` | High kurtosis = fat tails (extreme moves more likely). Model should reduce confidence. |

> [!CAUTION]
> **Data Leakage Danger**: Never use features that look into the future. Common mistakes:
> - Using `Close_tomorrow` or any future value as a feature
> - Computing rolling statistics without ensuring the window only looks backward
> - Normalizing features using the full dataset's min/max (use only training set statistics)
> - Including the target variable's lagged form without proper alignment

---

## 7. Data Pipeline Design

### 7.1 End-to-End Pipeline

```mermaid
graph TB
    subgraph "1. Raw Data Ingestion"
        A1["Yahoo Finance API"] -->|"yfinance"| B1["Raw OHLCV"]
        A2["Alpha Vantage"] -->|"REST"| B2["Raw Sentiment"]
        A3["FRED API"] -->|"fredapi"| B3["Raw Macro"]
        A4["GDELT"] -->|"gdelt"| B4["Raw Events"]
        A5["User Upload"] -->|"CSV/Excel"| B5["Raw User Data"]
    end

    subgraph "2. Validation"
        B1 & B2 & B3 & B4 & B5 --> C1["Schema Validation<br/>(Pydantic Models)"]
        C1 --> C2["Data Quality Checks"]
        C2 --> C3{"Pass?"}
        C3 -->|"No"| C4["Quarantine + Alert"]
        C3 -->|"Yes"| D1
    end

    subgraph "3. Cleaning"
        D1["Handle Missing Values<br/>(Forward-fill OHLCV)"]
        D1 --> D2["Remove Duplicates"]
        D2 --> D3["Outlier Detection<br/>(Z-score > 5)"]
        D3 --> D4["Date Alignment<br/>(Business days only)"]
    end

    subgraph "4. Feature Engineering"
        D4 --> E1["Technical Indicators<br/>(RSI, MACD, BB, etc.)"]
        E1 --> E2["Market Features<br/>(Volatility, Momentum)"]
        E2 --> E3["Time Features<br/>(Cyclical encoding)"]
        E3 --> E4["Statistical Features<br/>(Returns, Lags, Rolling)"]
        E4 --> E5["Sentiment Features<br/>(Score aggregation)"]
    end

    subgraph "5. Feature Store"
        E5 --> F1["MongoDB Atlas<br/>(Feature Vectors)"]
        E5 --> F2["TimescaleDB<br/>(Time-Indexed Features)"]
    end

    subgraph "6. Training"
        F1 & F2 --> G1["Train/Val/Test Split<br/>(Time-based)"]
        G1 --> G2["Model Training<br/>(XGBoost, LSTM, etc.)"]
        G2 --> G3["Hyperparameter Tuning<br/>(Optuna)"]
    end

    subgraph "7. Evaluation"
        G3 --> H1["Metrics Calculation<br/>(Accuracy, F1, Sharpe)"]
        H1 --> H2["Comparison vs Champion"]
        H2 --> H3{"Better?"}
        H3 -->|"No"| H4["Archive as Challenger"]
        H3 -->|"Yes"| I1
    end

    subgraph "8. Model Registry"
        I1["Register in MLflow"]
        I1 --> I2["Version Tag"]
        I2 --> I3["Stage: Staging"]
    end

    subgraph "9. Deployment"
        I3 --> J1["Shadow Mode<br/>(24h parallel inference)"]
        J1 --> J2["Canary Deployment<br/>(10% traffic)"]
        J2 --> J3["Full Deployment<br/>(100% traffic)"]
    end

    subgraph "10. Monitoring"
        J3 --> K1["Prediction Drift<br/>(Evidently)"]
        K1 --> K2["Feature Drift"]
        K2 --> K3{"Drift?"}
        K3 -->|"Yes"| G1
        K3 -->|"No"| K4["Continue Serving"]
    end
```

### 7.2 Data Quality Checks

```python
# Validation rules applied at ingestion
VALIDATION_RULES = {
    "ohlcv": {
        "open_positive": lambda df: (df["open"] > 0).all(),
        "high_gte_low": lambda df: (df["high"] >= df["low"]).all(),
        "high_gte_open": lambda df: (df["high"] >= df["open"]).all(),
        "high_gte_close": lambda df: (df["high"] >= df["close"]).all(),
        "low_lte_open": lambda df: (df["low"] <= df["open"]).all(),
        "low_lte_close": lambda df: (df["low"] <= df["close"]).all(),
        "volume_non_negative": lambda df: (df["volume"] >= 0).all(),
        "no_future_dates": lambda df: (df["datetime"] <= pd.Timestamp.now()).all(),
        "no_duplicate_dates": lambda df: ~df.duplicated(subset=["symbol", "datetime"]).any(),
        "max_gap_days": lambda df: df.groupby("symbol")["datetime"].diff().max() < pd.Timedelta("10 days"),
    }
}
```

---

## 8. Model Training Pipeline

### 8.1 Data Split Strategy

```mermaid
graph LR
    subgraph "Time-Based Split (NO random shuffle)"
        A["Full Dataset<br/>2019-01 to 2026-06"]
        A --> B["Train<br/>2019-01 to 2024-06<br/>(~70%)"]
        A --> C["Validation<br/>2024-07 to 2025-06<br/>(~15%)"]
        A --> D["Test<br/>2025-07 to 2026-06<br/>(~15%)"]
    end

    subgraph "Walk-Forward Validation"
        E["Window 1: Train 2019–2022, Val 2023-H1"]
        F["Window 2: Train 2019–2023-H1, Val 2023-H2"]
        G["Window 3: Train 2019–2023, Val 2024-H1"]
        H["Window 4: Train 2019–2024-H1, Val 2024-H2"]
        I["Window 5: Train 2019–2024, Val 2025-H1"]
        E --> F --> G --> H --> I
    end
```

> [!IMPORTANT]
> **Never use random train/test split for time-series**. This causes catastrophic data leakage — the model sees future patterns during training. Always use time-based splits where training data is strictly before validation/test data.

### 8.2 Time-Series Cross-Validation

```mermaid
graph TB
    subgraph "Expanding Window Cross-Validation"
        direction LR
        F1["Fold 1"] --- F1T["Train: Y1-Y2"] --- F1V["Val: Y3"]
        F2["Fold 2"] --- F2T["Train: Y1-Y3"] --- F2V["Val: Y4"]
        F3["Fold 3"] --- F3T["Train: Y1-Y4"] --- F3V["Val: Y5"]
        F4["Fold 4"] --- F4T["Train: Y1-Y5"] --- F4V["Val: Y6"]
    end

    subgraph "Purged Cross-Validation (Recommended)"
        direction LR
        P1["Fold with Gap"] --- P1T["Train: Y1-Y2"] --- P1G["⚠️ Gap: 5 days"] --- P1V["Val: Y3"]
    end
```

**Purged CV** adds a gap between train and validation to prevent label leakage from overlapping feature windows.

### 8.3 Hyperparameter Tuning

| Method | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **Grid Search** | Exhaustive, reproducible | Exponentially expensive, combinatorial explosion | ❌ Not recommended for >3 hyperparams |
| **Random Search** | Better coverage than grid, faster | No learning from past trials | ⚠️ Acceptable baseline |
| **Bayesian Optimization (Optuna)** | Learns from past trials, efficient, pruning support | More complex, may overfit to validation set | ✅ **Recommended** |

> **✅ Recommendation: Optuna with TPE (Tree-structured Parzen Estimator)**
>
> **Rationale**: Optuna's TPE sampler is specifically designed for hyperparameter optimization — it builds a probabilistic model of the objective function and focuses search on promising regions. Key advantages:
> - **Pruning**: MedianPruner stops unpromising trials early (saves 60%+ compute)
> - **Multi-objective**: Can optimize for both accuracy AND inference latency
> - **Integration**: Native integration with XGBoost, LightGBM, PyTorch
> - **Visualization**: Built-in parameter importance, optimization history, parallel coordinate plots

```python
# Example Optuna study for XGBoost
import optuna

def objective(trial):
    params = {
        "max_depth": trial.suggest_int("max_depth", 3, 10),
        "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.3, log=True),
        "n_estimators": trial.suggest_int("n_estimators", 100, 1000),
        "min_child_weight": trial.suggest_int("min_child_weight", 1, 10),
        "subsample": trial.suggest_float("subsample", 0.6, 1.0),
        "colsample_bytree": trial.suggest_float("colsample_bytree", 0.6, 1.0),
        "reg_alpha": trial.suggest_float("reg_alpha", 1e-8, 10.0, log=True),
        "reg_lambda": trial.suggest_float("reg_lambda", 1e-8, 10.0, log=True),
    }
    # Use time-series CV, NOT random CV
    cv_score = time_series_cv(params, X_train, y_train, n_splits=5)
    return cv_score

study = optuna.create_study(
    direction="maximize",
    sampler=optuna.samplers.TPESampler(seed=42),
    pruner=optuna.pruners.MedianPruner(n_startup_trials=10)
)
study.optimize(objective, n_trials=200, timeout=3600)
```

---

## 9. Prediction Service Design

### 9.1 API Endpoints

#### `POST /api/v1/predict`

**Purpose**: Generate a prediction for a given symbol and time horizon.

```json
// Request
{
    "symbol": "RELIANCE.NS",
    "market": "stock",
    "horizon_days": 1,
    "model_id": "xgboost-v3.2",  // optional, uses champion model if omitted
    "include_shap": true,
    "include_feature_importance": true
}

// Response (200 OK)
{
    "prediction_id": "pred_a1b2c3d4",
    "symbol": "RELIANCE.NS",
    "direction": "UP",
    "confidence": 0.73,
    "horizon_days": 1,
    "model": {
        "id": "xgboost-v3.2",
        "algorithm": "xgboost",
        "accuracy_30d": 0.61
    },
    "features": {
        "rsi_14": 42.3,
        "macd": -1.24,
        "regime": "stable"
    },
    "feature_importance": {
        "rsi_14": 0.15,
        "macd_histogram": 0.12,
        "volume_ratio": 0.10,
        "sma_50_distance": 0.09
    },
    "shap_values": {
        "rsi_14": -0.08,
        "macd_histogram": 0.12,
        "volume_ratio": 0.05
    },
    "metadata": {
        "predicted_at": "2026-06-06T16:30:00Z",
        "data_as_of": "2026-06-06T15:30:00+05:30",
        "disclaimer": "This prediction is for educational purposes only and does not constitute financial advice."
    }
}

// Error Response (422 Unprocessable Entity)
{
    "error": "INSUFFICIENT_DATA",
    "message": "Symbol UNKNOWN.NS has less than 200 trading days of data. Minimum required: 200.",
    "details": {
        "available_days": 45,
        "required_days": 200
    }
}
```

**Validation Rules**:
- `symbol`: Must exist in the trading data with ≥200 data points
- `market`: Must be one of `stock`, `crypto`, `forex`
- `horizon_days`: Must be one of `[1, 5, 15]`
- `model_id`: If provided, must be an active model
- Rate limit: 10 requests/minute (free), 100/minute (pro), 1000/minute (enterprise)

---

#### `POST /api/v1/backtest`

**Purpose**: Run a strategy backtest on historical data. This is an asynchronous endpoint.

```json
// Request
{
    "symbol": "RELIANCE.NS",
    "start_date": "2023-01-01",
    "end_date": "2025-12-31",
    "model_id": "xgboost-v3.2",
    "strategy": {
        "type": "threshold",
        "buy_threshold": 0.6,
        "sell_threshold": 0.4,
        "initial_capital": 1000000,
        "position_size": 0.1,
        "stop_loss": 0.05,
        "take_profit": 0.10
    }
}

// Response (202 Accepted)
{
    "backtest_id": "bt_x7y8z9",
    "status": "pending",
    "estimated_time_seconds": 45,
    "poll_url": "/api/v1/backtest/bt_x7y8z9/status"
}

// Poll Response (200 OK — completed)
{
    "backtest_id": "bt_x7y8z9",
    "status": "completed",
    "results": {
        "total_return": 0.2847,
        "annualized_return": 0.0912,
        "sharpe_ratio": 1.42,
        "max_drawdown": -0.1234,
        "win_rate": 0.583,
        "total_trades": 156,
        "winning_trades": 91,
        "losing_trades": 65,
        "avg_win": 0.0234,
        "avg_loss": -0.0178,
        "profit_factor": 1.83,
        "calmar_ratio": 0.74,
        "equity_curve": [...],
        "monthly_returns": [...],
        "trade_log": [...]
    },
    "benchmark": {
        "buy_and_hold_return": 0.2156,
        "nifty_50_return": 0.1834
    }
}
```

**Validation**:
- Date range must be ≥ 90 days and ≤ 10 years
- `position_size` must be between 0.01 and 1.0
- `stop_loss` and `take_profit` must be between 0.01 and 0.50
- Maximum 5 concurrent backtests per user (free), 50 (pro)

---

#### `POST /api/v1/train`

**Purpose**: Trigger model retraining (admin/enterprise only).

```json
// Request
{
    "model_type": "xgboost",
    "symbols": ["RELIANCE.NS", "TCS.NS", "INFY.NS"],
    "training_config": {
        "start_date": "2019-01-01",
        "end_date": "2025-12-31",
        "validation_split": 0.15,
        "hyperparameter_tuning": true,
        "optuna_trials": 100
    }
}

// Response (202 Accepted)
{
    "training_job_id": "train_abc123",
    "status": "queued",
    "estimated_time_minutes": 30
}
```

**Validation**:
- Requires `admin` role or `enterprise` subscription
- `model_type` must be one of `["rf", "xgboost", "lightgbm", "lstm", "transformer"]`
- Maximum 1 concurrent training job per user

---

#### `GET /api/v1/metrics`

**Purpose**: Retrieve model performance metrics.

```json
// Response (200 OK)
{
    "models": [
        {
            "id": "xgboost-v3.2",
            "algorithm": "xgboost",
            "status": "active",
            "metrics": {
                "accuracy_all_time": 0.593,
                "accuracy_30d": 0.612,
                "accuracy_7d": 0.571,
                "f1_score": 0.587,
                "precision": 0.601,
                "recall": 0.574,
                "total_predictions": 15243,
                "correct_predictions": 9039
            },
            "drift_status": "stable",
            "last_retrained": "2026-06-01T00:00:00Z"
        }
    ]
}
```

---

#### `GET /api/v1/model-status`

**Purpose**: Health check and operational status of ML models.

```json
// Response (200 OK)
{
    "service_status": "healthy",
    "models_loaded": 4,
    "inference_latency_p50_ms": 23,
    "inference_latency_p95_ms": 87,
    "inference_latency_p99_ms": 156,
    "last_prediction_at": "2026-06-06T16:29:00Z",
    "feature_store_status": "connected",
    "models": [
        {
            "id": "xgboost-v3.2",
            "status": "loaded",
            "memory_mb": 45,
            "version": "3.2.0"
        },
        {
            "id": "lstm-v2.1",
            "status": "loaded",
            "memory_mb": 128,
            "version": "2.1.0"
        }
    ]
}
```

---

## 10. Frontend Design

### 10.1 Page Architecture

```mermaid
graph TB
    subgraph "Public Pages"
        L["Landing Page<br/>/"]
        LG["Login<br/>/login"]
        RG["Register<br/>/register"]
    end

    subgraph "Authenticated Pages"
        D["Dashboard<br/>/dashboard"]
        P["Predictions<br/>/predict"]
        PF["Portfolio<br/>/portfolio"]
        BT["Backtesting<br/>/backtest"]
        S["Settings<br/>/settings"]
    end

    subgraph "Admin Pages"
        A["Admin Panel<br/>/admin"]
        AM["Model Management<br/>/admin/models"]
        AU["User Management<br/>/admin/users"]
    end

    L --> LG --> D
    L --> RG --> D
    D --> P & PF & BT & S
    D --> A
```

### 10.2 Page Specifications

#### Landing Page (`/`)

| Component | Description | State |
|-----------|-------------|-------|
| **Hero Section** | Animated gradient background, headline "AI-Powered Market Intelligence", CTA buttons | Static |
| **Feature Showcase** | 3-column grid: Predictions, Backtesting, AI Insights with Lottie animations | Static |
| **Live Demo** | Embedded mini-chart with real-time price ticker and sample prediction overlay | WebSocket → live price feed |
| **Social Proof** | Prediction accuracy stats (dynamically computed), user count | API: `GET /stats` |
| **Pricing Cards** | Tier comparison with feature matrix | Static |
| **Footer** | Disclaimer, legal links, SEBI notice | Static |

**Loading State**: Skeleton UI with shimmer effect for dynamic sections
**Error State**: Graceful fallback to static content with "Data temporarily unavailable" badge

---

#### Dashboard (`/dashboard`)

| Component | Description | State Management |
|-----------|-------------|-----------------|
| **Market Overview** | Top gainers/losers, index performance (Nifty 50, S&P 500, BTC) | `useQuery` + WebSocket for live prices |
| **Recent Predictions** | Table of last 10 predictions with direction, confidence, outcome | `useQuery('/predictions?limit=10')` |
| **Portfolio Summary** | Total value, P&L, allocation pie chart | `useQuery('/portfolios/summary')` |
| **Model Performance** | Accuracy trend chart (7d, 30d, 90d) | `useQuery('/metrics')` |
| **Quick Predict** | Symbol search + predict button | `useMutation('/predict')` |
| **Active Alerts** | List of triggered and pending alerts | `useQuery('/alerts')` |

**State Management**: React Query (TanStack Query) for server state, Zustand for client-side UI state.

**API Calls**:
```typescript
// Parallel data fetching in Server Component
async function DashboardPage() {
    const [predictions, portfolio, metrics] = await Promise.all([
        api.get('/predictions?limit=10'),
        api.get('/portfolios/summary'),
        api.get('/metrics'),
    ]);
    return <DashboardClient data={{ predictions, portfolio, metrics }} />;
}
```

**Loading State**: Full-page skeleton with animated placeholder cards
**Error State**: Per-widget error boundaries with retry buttons

---

#### Prediction Screen (`/predict`)

| Component | Description |
|-----------|-------------|
| **Symbol Search** | Autocomplete search with debounced API calls, recent searches |
| **Interactive Chart** | TradingView Lightweight Charts — candlestick with indicator overlays |
| **Indicator Panel** | Toggle indicators (RSI, MACD, BB, etc.) with parameter customization |
| **Prediction Card** | Large UP/DOWN arrow with confidence gauge (animated radial chart) |
| **Feature Importance** | Horizontal bar chart showing top 10 contributing features |
| **SHAP Waterfall** | SHAP waterfall plot explaining prediction direction |
| **Historical Accuracy** | Mini line chart showing model accuracy for this specific symbol |
| **Prediction History** | Scrollable timeline of past predictions for this symbol |

---

#### Portfolio Screen (`/portfolio`)

| Component | Description |
|-----------|-------------|
| **Portfolio Selector** | Dropdown to switch between portfolios |
| **Holdings Table** | Sortable table: Symbol, Qty, Avg Price, Current Price, P&L, Weight |
| **Allocation Chart** | Donut chart with sector/asset class breakdown |
| **Performance Chart** | Equity curve vs benchmark (Nifty 50) |
| **Add Position** | Modal form: Symbol, Quantity, Entry Price |
| **Risk Metrics** | Portfolio beta, Sharpe, max drawdown |

---

#### Backtesting Screen (`/backtest`)

| Component | Description |
|-----------|-------------|
| **Strategy Builder** | Form: symbol, date range, model, thresholds, position sizing |
| **Run Backtest Button** | Triggers async backtest job, shows progress bar |
| **Results Dashboard** | Key metrics: Sharpe, Drawdown, Win Rate, Total Return |
| **Equity Curve** | Interactive chart comparing strategy vs buy-and-hold vs index |
| **Trade Log** | Expandable table of every trade: entry, exit, P&L, holding period |
| **Monthly Returns Heatmap** | Color-coded grid of monthly returns |
| **Comparison Mode** | Side-by-side comparison of two backtest runs |

---

#### Admin Panel (`/admin`)

| Component | Description |
|-----------|-------------|
| **System Health** | API latency, error rates, active users (Grafana embed or custom) |
| **Model Manager** | List models, view metrics, promote/retire, trigger retraining |
| **User Manager** | User list, role assignment, usage stats, ban/suspend |
| **Data Pipeline Status** | Last ingestion time, data freshness, validation failures |
| **Audit Log Viewer** | Searchable, filterable audit trail |

---

#### Settings (`/settings`)

| Component | Description |
|-----------|-------------|
| **Profile** | Name, email, avatar, password change |
| **API Keys** | Generate, view (prefix only), revoke API keys |
| **Notifications** | Email/push preferences for alerts and predictions |
| **Subscription** | Current plan, upgrade/downgrade, billing history |
| **Data Export** | Download all user data (GDPR compliance) |

---

## 11. Real-Time Data Architecture

### 11.1 Technology Comparison

| Criteria | WebSockets | SSE (Server-Sent Events) | Polling |
|----------|-----------|--------------------------|---------|
| **Direction** | ✅ Bidirectional | ❌ Server → Client only | ❌ Client-initiated only |
| **Latency** | ✅ Lowest (~50ms) | ✅ Low (~100ms) | ❌ High (interval-dependent) |
| **Connection** | Persistent TCP | Persistent HTTP | New request each time |
| **Browser Support** | ✅ All modern | ✅ All modern (except IE) | ✅ Universal |
| **Load Balancing** | ⚠️ Sticky sessions needed | ✅ Standard HTTP LB | ✅ Stateless |
| **Scalability** | ⚠️ 10K connections per server | ✅ Better (lighter) | ✅ Best (stateless) |
| **Reconnection** | ⚠️ Manual | ✅ Built-in | ✅ Inherent |
| **Firewall Friendly** | ⚠️ Possible issues | ✅ HTTP-based | ✅ HTTP-based |

> **✅ Recommendation: WebSockets (primary) + SSE (fallback)**
>
> **Rationale**: Financial data requires bidirectional communication — users need to subscribe/unsubscribe to specific symbols, and the server needs to push price updates and prediction alerts. WebSockets provide the lowest latency for this use case. Use SSE as a fallback for environments where WebSocket connections are blocked (corporate firewalls).

### 11.2 WebSocket Architecture

```mermaid
graph TB
    subgraph "Clients"
        C1["Browser 1<br/>Watching: RELIANCE, TCS"]
        C2["Browser 2<br/>Watching: INFY, WIPRO"]
        C3["Browser 3<br/>Watching: RELIANCE"]
    end

    subgraph "NestJS WebSocket Gateway"
        G1["Connection Manager<br/>(Socket.io / ws)"]
        G2["Room Manager<br/>(per-symbol rooms)"]
        G3["Auth Middleware<br/>(JWT validation)"]
    end

    subgraph "Redis Pub/Sub"
        R1["Channel: prices:RELIANCE"]
        R2["Channel: prices:TCS"]
        R3["Channel: predictions:RELIANCE"]
    end

    subgraph "Data Producers"
        P1["Market Data Ingester<br/>(cron: every 1s during market hours)"]
        P2["ML Prediction Service<br/>(on new bar close)"]
    end

    C1 & C2 & C3 -->|"WSS"| G3
    G3 --> G1 --> G2
    G2 -.->|"Subscribe"| R1 & R2 & R3
    P1 -->|"Publish"| R1 & R2
    P2 -->|"Publish"| R3
    R1 -->|"Push"| G2 -->|"Broadcast to room"| C1 & C3
```

### 11.3 Scaling Concerns

| Scale | Challenge | Solution |
|-------|-----------|----------|
| **1K connections** | Single NestJS instance handles it | No special handling needed |
| **10K connections** | Memory pressure, CPU for serialization | 3 NestJS instances behind Nginx with sticky sessions, Redis adapter for Socket.io |
| **100K connections** | Connection limit per server (~65K ports) | Dedicated WebSocket tier (4+ servers), Redis Cluster for pub/sub, consider switching to SSE for read-only price feeds |

---

## 12. Authentication & Security

### 12.1 Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant BE as NestJS API
    participant DB as Database
    participant RD as Redis

    Note over U,RD: Registration Flow
    U->>FE: Register (email, password)
    FE->>BE: POST /auth/register
    BE->>BE: Hash password (bcrypt, 12 rounds)
    BE->>DB: Insert user
    BE->>BE: Generate email verification token
    BE-->>U: Verification email

    Note over U,RD: Login Flow
    U->>FE: Login (email, password)
    FE->>BE: POST /auth/login
    BE->>DB: Fetch user by email
    BE->>BE: Verify password hash
    BE->>BE: Generate JWT (access: 15min)
    BE->>BE: Generate refresh token (7 days)
    BE->>RD: Store refresh token (hash)
    BE-->>FE: { access_token, refresh_token }
    FE->>FE: Store access_token in memory
    FE->>FE: Store refresh_token in httpOnly cookie

    Note over U,RD: Token Refresh
    FE->>BE: POST /auth/refresh (cookie: refresh_token)
    BE->>RD: Validate refresh token
    BE->>BE: Generate new access_token
    BE->>BE: Rotate refresh_token
    BE->>RD: Invalidate old, store new
    BE-->>FE: { new_access_token, new_refresh_token }
```

### 12.2 JWT Structure

```json
// Access Token Payload
{
    "sub": "user_uuid",
    "email": "user@example.com",
    "role": "pro",
    "permissions": ["predict", "backtest", "portfolio"],
    "iat": 1717689600,
    "exp": 1717690500  // 15 minutes
}

// Signed with RS256 (asymmetric — public key for verification, private key for signing)
```

### 12.3 Role-Based Access Control (RBAC)

```mermaid
graph TB
    subgraph "Roles"
        R1["Free User"]
        R2["Pro User"]
        R3["Enterprise User"]
        R4["Admin"]
    end

    subgraph "Permissions"
        P1["predict:read (3/day)"]
        P2["predict:read (unlimited)"]
        P3["backtest:run"]
        P4["portfolio:manage"]
        P5["api_key:manage"]
        P6["model:train"]
        P7["user:manage"]
        P8["system:admin"]
    end

    R1 --> P1 & P4
    R2 --> P2 & P3 & P4
    R3 --> P2 & P3 & P4 & P5 & P6
    R4 --> P2 & P3 & P4 & P5 & P6 & P7 & P8
```

### 12.4 Security Measures

| Threat | Mitigation | Implementation |
|--------|------------|----------------|
| **SQL Injection** | Parameterized queries, ORM | TypeORM with query builder (NestJS), SQLAlchemy (FastAPI) — never raw string concatenation |
| **XSS** | Content Security Policy, output encoding | Next.js auto-escapes JSX, CSP headers via Helmet middleware, `DOMPurify` for user-generated content |
| **CSRF** | SameSite cookies, CSRF tokens | `SameSite=Strict` on cookies, `csurf` middleware for form submissions |
| **Rate Limiting** | Token bucket algorithm | `@nestjs/throttler` — 100 req/min per user, 1000 req/min per IP |
| **DDoS Protection** | WAF, rate limiting, Cloudflare | Cloudflare proxy (free tier available), Nginx rate limiting as second layer |
| **Brute Force** | Account lockout, exponential backoff | Lock account after 5 failed attempts for 15 minutes, CAPTCHA after 3 failures |
| **Data Encryption** | AES-256 at rest, TLS 1.3 in transit | TimescaleDB with pgcrypto, Nginx TLS termination, Let's Encrypt certificates |
| **API Key Security** | Hash storage, prefix display | Store bcrypt hash of API key, show only prefix (`fmf_prod_a1b2...`) to user |
| **Dependency Vulnerabilities** | Automated scanning | `npm audit`, `pip audit`, Snyk/Dependabot in CI/CD |

---

## 13. Scalability Design

### 13.1 Scaling Strategy by User Count

```mermaid
graph TB
    subgraph "Phase 1: 1,000 Users"
        A1["1x NestJS (2 CPU, 4GB)"]
        A2["1x FastAPI (4 CPU, 8GB)"]
        A3["1x TimescaleDB (4 CPU, 16GB)"]
        A4["1x Redis (2 CPU, 4GB)"]
        A5["1x Next.js (2 CPU, 4GB)"]
    end

    subgraph "Phase 2: 10,000 Users"
        B1["3x NestJS + Nginx LB"]
        B2["2x FastAPI + model replicas"]
        B3["TimescaleDB Primary + 2 Read Replicas"]
        B4["Redis Sentinel (1 primary + 2 replicas)"]
        B5["2x Next.js + CDN (Cloudflare)"]
        B6["2x Celery Workers"]
    end

    subgraph "Phase 3: 100,000 Users"
        C1["K8s: 5-10 NestJS pods (HPA)"]
        C2["K8s: 3-5 FastAPI pods (HPA) + GPU node"]
        C3["TimescaleDB Cluster + Connection Pooler (PgBouncer)"]
        C4["Redis Cluster (6 nodes)"]
        C5["CDN + Edge Functions"]
        C6["Kafka for event streaming"]
        C7["5+ Celery Workers (auto-scaling)"]
    end
```

### 13.2 Detailed Scaling Strategies

| Component | 1K Users | 10K Users | 100K Users |
|-----------|----------|-----------|------------|
| **Frontend** | Single Next.js instance, Vercel free tier | CDN for static assets, 2 instances | Edge deployment (Vercel/Cloudflare), ISR for data pages |
| **Backend API** | Single NestJS instance | 3 instances, Nginx round-robin LB | K8s HPA (5-10 pods), scale on CPU >70% |
| **ML Service** | Single FastAPI instance, models in memory | 2 instances, model caching in Redis | GPU-accelerated pods, ONNX Runtime, batch prediction pipeline |
| **Database** | Single TimescaleDB | Primary + 2 read replicas, read queries to replicas | Partitioned by symbol, PgBouncer connection pooling, archival to S3 |
| **Cache** | Single Redis | Redis Sentinel (HA) | Redis Cluster (6 nodes), separate cache vs pub/sub instances |
| **Job Queue** | Redis Streams, 1 worker | Redis Streams, 2 workers | Kafka + 5 Celery workers with K8s autoscaling |
| **WebSockets** | Single gateway, <1K connections | 3 gateways with Redis adapter | Dedicated WS tier, 100K connections across 5+ servers |
| **Cost Estimate** | $50-100/mo | $300-500/mo | $2,000-5,000/mo |

### 13.3 Caching Strategy

```mermaid
graph TB
    subgraph "Cache Layers"
        L1["Browser Cache<br/>(Static assets: 1 year)"]
        L2["CDN Cache<br/>(HTML: 5 min, API: disabled)"]
        L3["Application Cache (Redis)"
        ]
        L4["Database Query Cache<br/>(TimescaleDB continuous aggregates)"]
    end

    subgraph "Redis Cache Keys"
        K1["prediction:{symbol}:{horizon}:{model}<br/>TTL: 5 minutes"]
        K2["market_data:{symbol}:latest<br/>TTL: 1 second"]
        K3["user:{id}:portfolio<br/>TTL: 30 seconds"]
        K4["metrics:{model_id}<br/>TTL: 5 minutes"]
        K5["feature_vector:{symbol}:{date}<br/>TTL: 24 hours"]
    end

    L1 --> L2 --> L3 --> L4
```

**Cache Invalidation Strategy**:
- **Time-based**: Predictions cached for 5 min, market data for 1s
- **Event-based**: Invalidate portfolio cache on trade execution
- **Write-through**: New predictions write to cache AND database simultaneously

---

## 14. MLOps Architecture

### 14.1 MLOps Pipeline

```mermaid
graph TB
    subgraph "1. Experiment Tracking"
        A1["MLflow Tracking Server"]
        A2["Log: params, metrics, artifacts"]
        A3["Compare experiments"]
    end

    subgraph "2. Model Registry"
        B1["MLflow Model Registry"]
        B2["Stages: None → Staging → Production → Archived"]
        B3["Version metadata + lineage"]
    end

    subgraph "3. Model Versioning"
        C1["Semantic Versioning<br/>(major.minor.patch)"]
        C2["Git tag per model version"]
        C3["Artifact storage (S3/GCS)"]
    end

    subgraph "4. Monitoring"
        D1["Evidently AI<br/>(Data & Model Monitoring)"]
        D2["Prediction Drift Detection"]
        D3["Feature Drift Detection"]
        D4["Performance Degradation Alerts"]
    end

    subgraph "5. Retraining Pipeline"
        E1["Scheduled: Weekly (Sunday)"]
        E2["Triggered: Drift detected"]
        E3["Manual: Admin request"]
    end

    A1 --> A2 --> A3
    A3 --> B1 --> B2 --> B3
    B3 --> C1 & C2 & C3
    C3 --> D1 --> D2 & D3 --> D4
    D4 -->|"Auto-trigger"| E2
    E1 & E2 & E3 --> A1
```

### 14.2 Production Deployment Workflow

```mermaid
graph LR
    subgraph "Training"
        T1["Data Pipeline Run"]
        T2["Model Training"]
        T3["Evaluation"]
    end

    subgraph "Validation"
        V1["Automated Tests<br/>(accuracy > threshold)"]
        V2["Shadow Mode<br/>(24h parallel inference)"]
        V3["A/B Test<br/>(10% traffic)"]
    end

    subgraph "Deployment"
        D1["Promote to Production"]
        D2["Blue-Green Deployment"]
        D3["Rollback on regression"]
    end

    T1 --> T2 --> T3
    T3 --> V1 --> V2 --> V3
    V3 --> D1 --> D2
    D2 -.->|"Regression"| D3
```

### 14.3 Drift Detection

| Drift Type | Detection Method | Threshold | Action |
|-----------|-----------------|-----------|--------|
| **Data Drift** | Kolmogorov-Smirnov test on feature distributions | p-value < 0.01 | Alert + schedule retraining |
| **Prediction Drift** | Chi-squared test on prediction distribution | p-value < 0.01 | Alert + immediate investigation |
| **Concept Drift** | Sliding window accuracy degradation | Accuracy drops >5% from baseline | Auto-trigger retraining pipeline |
| **Feature Drift** | Population Stability Index (PSI) | PSI > 0.2 | Alert + feature investigation |

---

## 15. DevOps Design

### 15.1 Docker Setup

```dockerfile
# ml-service/Dockerfile
FROM python:3.11-slim AS base

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Production stage
FROM base AS production
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./client
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:4000
    depends_on: [backend]

  backend:
    build: ./server
    ports: ["4000:4000"]
    environment:
      - DATABASE_URL=postgresql://user:pass@timescaledb:5432/fmf
      - REDIS_URL=redis://redis:6379
      - ML_SERVICE_URL=http://ml-service:8000
    depends_on: [timescaledb, redis, ml-service]

  ml-service:
    build: ./ml_core/ml_pipeline
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=postgresql://user:pass@timescaledb:5432/fmf
      - MLFLOW_TRACKING_URI=http://mlflow:5000
      - MONGODB_URI=mongodb+srv://...
    volumes:
      - model-artifacts:/app/models
    depends_on: [timescaledb, mlflow]

  timescaledb:
    image: timescale/timescaledb:latest-pg16
    ports: ["5432:5432"]
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=fmf
    volumes:
      - timescale-data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data

  mlflow:
    image: ghcr.io/mlflow/mlflow:latest
    ports: ["5000:5000"]
    command: mlflow server --host 0.0.0.0 --port 5000 --backend-store-uri postgresql://user:pass@timescaledb:5432/mlflow

volumes:
  timescale-data:
  redis-data:
  model-artifacts:
```

### 15.2 Kubernetes Setup

```yaml
# k8s/ml-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-service
  labels:
    app: ml-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ml-service
  template:
    metadata:
      labels:
        app: ml-service
    spec:
      containers:
        - name: ml-service
          image: ghcr.io/priyanshu/fmf-ml-service:latest
          ports:
            - containerPort: 8000
          resources:
            requests:
              cpu: "500m"
              memory: "1Gi"
            limits:
              cpu: "2000m"
              memory: "4Gi"
          readinessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 30
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 60
            periodSeconds: 30
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-credentials
                  key: url
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ml-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ml-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

### 15.3 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Stage 1: Lint & Type Check
  lint:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [client, server, ml-service]
    steps:
      - uses: actions/checkout@v4
      - name: Lint Frontend
        if: matrix.service == 'client'
        run: |
          cd client
          npm ci
          npm run lint
          npx tsc --noEmit
      - name: Lint Backend
        if: matrix.service == 'server'
        run: |
          cd server
          npm ci
          npm run lint
          npx tsc --noEmit
      - name: Lint ML Service
        if: matrix.service == 'ml-service'
        run: |
          cd ml_core/ml_pipeline
          pip install ruff mypy
          ruff check .
          mypy . --ignore-missing-imports

  # Stage 2: Unit Tests
  test:
    needs: lint
    runs-on: ubuntu-latest
    services:
      postgres:
        image: timescale/timescaledb:latest-pg16
        env:
          POSTGRES_PASSWORD: test
        ports: [5432:5432]
      redis:
        image: redis:7-alpine
        ports: [6379:6379]
    steps:
      - uses: actions/checkout@v4
      - name: Test Backend
        run: |
          cd server
          npm ci
          npm run test:cov
      - name: Test ML Service
        run: |
          cd ml_core/ml_pipeline
          pip install -r requirements.txt
          pytest tests/ -v --cov=fmf

  # Stage 3: Security Scan
  security:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: npm audit
        run: |
          cd client && npm audit --audit-level=high
          cd ../server && npm audit --audit-level=high
      - name: pip audit
        run: |
          cd ml_core/ml_pipeline
          pip install pip-audit
          pip-audit -r requirements.txt
      - name: Trivy container scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'

  # Stage 4: Build & Push Docker Images
  build:
    needs: [test, security]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [client, server, ml-service]
    steps:
      - uses: actions/checkout@v4
      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: ./${{ matrix.service == 'ml-service' && 'ml_core/ml_pipeline' || matrix.service }}
          push: true
          tags: ghcr.io/${{ github.repository }}/${{ matrix.service }}:${{ github.sha }}

  # Stage 5: Deploy
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/frontend frontend=ghcr.io/${{ github.repository }}/client:${{ github.sha }}
          kubectl set image deployment/backend backend=ghcr.io/${{ github.repository }}/server:${{ github.sha }}
          kubectl set image deployment/ml-service ml-service=ghcr.io/${{ github.repository }}/ml-service:${{ github.sha }}
          kubectl rollout status deployment/frontend
          kubectl rollout status deployment/backend
          kubectl rollout status deployment/ml-service
```

---

## 16. Monitoring & Observability

### 16.1 Monitoring Stack

```mermaid
graph TB
    subgraph "Applications"
        A1["NestJS API"]
        A2["FastAPI ML Service"]
        A3["Next.js Frontend"]
        A4["Celery Workers"]
    end

    subgraph "Collection"
        B1["OpenTelemetry SDK<br/>(Traces + Metrics)"]
        B2["Promtail / Fluent Bit<br/>(Log collection)"]
        B3["Prometheus<br/>(Metrics scraping)"]
    end

    subgraph "Storage"
        C1["Prometheus TSDB<br/>(Metrics — 30 day retention)"]
        C2["Loki<br/>(Logs — 30 day retention)"]
        C3["Tempo / Jaeger<br/>(Traces — 7 day retention)"]
    end

    subgraph "Visualization & Alerting"
        D1["Grafana<br/>(Dashboards)"]
        D2["AlertManager<br/>(Alert routing)"]
        D3["PagerDuty / Slack<br/>(Notifications)"]
    end

    A1 & A2 & A3 & A4 --> B1
    A1 & A2 & A3 & A4 --> B2
    B1 --> C1 & C3
    B2 --> C2
    B3 --> C1
    C1 & C2 & C3 --> D1
    C1 --> D2 --> D3
```

### 16.2 Key Metrics

| Category | Metric | Alert Threshold |
|----------|--------|-----------------|
| **API Health** | Request rate (req/s) | > 1000 req/s sustained |
| **API Health** | Error rate (5xx) | > 1% of requests |
| **API Health** | Latency p95 | > 2 seconds |
| **ML Service** | Inference latency p95 | > 500ms |
| **ML Service** | Model accuracy (rolling 7d) | < 52% (near random) |
| **ML Service** | Prediction distribution skew | > 80% same direction |
| **Database** | Connection pool usage | > 80% of max_connections |
| **Database** | Query latency p95 | > 100ms |
| **Database** | Disk usage | > 80% capacity |
| **Cache** | Redis memory usage | > 80% of maxmemory |
| **Cache** | Cache hit ratio | < 60% |
| **WebSocket** | Active connections | > 80% of max |
| **Infrastructure** | CPU utilization | > 80% sustained 5min |
| **Infrastructure** | Memory utilization | > 85% |
| **Business** | Predictions served/hour | < 10 (system might be down) |
| **Business** | User sign-ups/day | Anomaly detection |

### 16.3 Logging Standards

```typescript
// Structured JSON logging format (NestJS)
{
    "timestamp": "2026-06-06T16:30:00.123Z",
    "level": "info",
    "service": "backend-api",
    "traceId": "abc123def456",
    "spanId": "789ghi",
    "userId": "user_uuid",
    "method": "POST",
    "path": "/api/v1/predict",
    "statusCode": 200,
    "latencyMs": 234,
    "message": "Prediction served successfully",
    "metadata": {
        "symbol": "RELIANCE.NS",
        "model": "xgboost-v3.2",
        "direction": "UP",
        "confidence": 0.73
    }
}
```

---

## 17. Backtesting Engine

### 17.1 Architecture

```mermaid
graph TB
    subgraph "Input"
        A1["Strategy Config<br/>(model, thresholds, sizing)"]
        A2["Historical Data<br/>(OHLCV + features)"]
        A3["Model Predictions<br/>(historical inference)"]
    end

    subgraph "Simulation Engine"
        B1["Event-Driven Backtest Loop"]
        B2["Signal Generator<br/>(prediction → signal)"]
        B3["Position Manager<br/>(entry, exit, sizing)"]
        B4["Risk Manager<br/>(stop-loss, take-profit)"]
        B5["Transaction Cost Model<br/>(slippage + commission)"]
    end

    subgraph "Analytics Engine"
        C1["Return Calculator"]
        C2["Risk Metrics"]
        C3["Trade Analyzer"]
    end

    subgraph "Output"
        D1["Equity Curve"]
        D2["Performance Metrics"]
        D3["Trade Log"]
        D4["Monthly Returns Heatmap"]
    end

    A1 & A2 & A3 --> B1
    B1 --> B2 --> B3 --> B4 --> B5
    B5 --> C1 & C2 & C3
    C1 & C2 & C3 --> D1 & D2 & D3 & D4
```

### 17.2 Key Metrics

| Metric | Formula | Interpretation |
|--------|---------|----------------|
| **Sharpe Ratio** | `(Rp - Rf) / σp` | Risk-adjusted return. > 1.0 = good, > 2.0 = excellent. Rf = risk-free rate (Indian T-bill ~7%) |
| **Maximum Drawdown** | `max(peak - trough) / peak` | Worst peak-to-trough decline. < 20% = acceptable for conservative strategies |
| **Win Rate** | `winning_trades / total_trades` | % of profitable trades. > 55% is strong for directional strategies |
| **Profit Factor** | `gross_profits / gross_losses` | > 1.5 = good. > 2.0 = excellent |
| **Calmar Ratio** | `annualized_return / max_drawdown` | Return per unit drawdown risk. > 1.0 = acceptable |
| **Sortino Ratio** | `(Rp - Rf) / σ_downside` | Like Sharpe but only penalizes downside volatility |

### 17.3 Transaction Cost Model

```python
class TransactionCostModel:
    """Realistic cost model for Indian equity markets"""
    
    BROKERAGE_PERCENT = 0.03 / 100     # Discount broker (Zerodha-style)
    STT_BUY = 0.1 / 100               # Securities Transaction Tax (delivery buy)
    STT_SELL = 0.1 / 100              # STT (delivery sell)
    EXCHANGE_CHARGE = 0.00345 / 100   # NSE transaction charge
    GST = 18 / 100                     # GST on brokerage + exchange charges
    SEBI_CHARGE = 0.0001 / 100        # SEBI regulatory charge
    STAMP_DUTY = 0.015 / 100          # Stamp duty (buy side only)
    SLIPPAGE_PERCENT = 0.05 / 100     # Estimated slippage for liquid stocks
```

> [!WARNING]
> **Backtesting Traps**:
> - **Survivorship bias**: Only testing on stocks that still exist. Solution: Include delisted stocks in the universe.
> - **Look-ahead bias**: Using data that wouldn't have been available at the time of the trade. Solution: Strict point-in-time feature store.
> - **Overfitting to backtest**: Optimizing strategy parameters to fit historical data. Solution: Out-of-sample validation, walk-forward analysis.
> - **Ignoring transaction costs**: Strategies that look great without costs may be unprofitable. Solution: Always include realistic cost model.

---

## 18. AI Market Insights

### 18.1 Architecture

```mermaid
graph TB
    subgraph "Data Sources"
        A1["Model Predictions<br/>(direction, confidence, features)"]
        A2["Market Data<br/>(prices, volumes, indicators)"]
        A3["News Sentiment<br/>(Alpha Vantage)"]
        A4["Macro Data<br/>(FRED)"]
    end

    subgraph "Context Builder"
        B1["RAG Pipeline"]
        B2["Vector Store<br/>(Chroma / Pinecone)"]
        B3["Context Retrieval"]
    end

    subgraph "LLM Layer"
        C1["Prompt Template Engine"]
        C2["LLM API<br/>(GPT-4o-mini / Gemini Flash)"]
        C3["Response Parser"]
    end

    subgraph "Output"
        D1["Market Summary"]
        D2["Prediction Explanation"]
        D3["Trading Insight"]
    end

    A1 & A2 & A3 & A4 --> B1
    B1 --> B2 --> B3
    B3 --> C1 --> C2 --> C3
    C3 --> D1 & D2 & D3
```

### 18.2 Prompt Architecture

```python
# Market Summary Prompt
MARKET_SUMMARY_PROMPT = """
You are a financial analyst assistant. Based on the following market data, 
provide a concise market summary.

## Current Market Data
- Symbol: {symbol}
- Current Price: ₹{price}
- Daily Change: {change_pct}%
- Volume vs Average: {volume_ratio}x

## Technical Indicators
- RSI (14): {rsi} ({rsi_signal})
- MACD: {macd} (Signal: {macd_signal})
- Trend: {trend_direction} (ADX: {adx})
- Bollinger Band Position: {bb_position}

## Model Prediction
- Direction: {direction}
- Confidence: {confidence}%
- Top Features: {top_features}

## Recent News Sentiment
- Overall: {sentiment_score} ({sentiment_label})
- Key Headlines: {headlines}

## Instructions
1. Summarize the current market condition for {symbol}
2. Explain why the model predicts {direction}
3. Highlight key risk factors
4. Keep the tone professional and educational
5. Include a disclaimer that this is NOT financial advice
6. Maximum 200 words

## Response Format
**Market Condition**: [1-2 sentences]
**Model View**: [2-3 sentences explaining the prediction]
**Key Risks**: [Bullet points]
**Disclaimer**: This analysis is for educational purposes only.
"""
```

### 18.3 RAG Architecture

```mermaid
graph LR
    subgraph "Document Ingestion"
        A1["Financial News Articles"]
        A2["Research Reports"]
        A3["Historical Market Commentary"]
    end

    subgraph "Processing"
        B1["Text Chunking<br/>(512 tokens, 50 overlap)"]
        B2["Embedding<br/>(text-embedding-3-small)"]
    end

    subgraph "Vector Store"
        C1["ChromaDB / Pinecone"]
    end

    subgraph "Retrieval"
        D1["Query: Symbol + Date + Context"]
        D2["Similarity Search (top-5)"]
        D3["Re-ranking"]
    end

    subgraph "Generation"
        E1["Context + Prompt → LLM"]
        E2["Structured Output"]
    end

    A1 & A2 & A3 --> B1 --> B2 --> C1
    D1 --> C1 --> D2 --> D3
    D3 --> E1 --> E2
```

### 18.4 Cost Optimization

| Strategy | Implementation | Savings |
|----------|---------------|---------|
| **Use smaller models** | GPT-4o-mini instead of GPT-4o for summaries | ~90% cost reduction |
| **Cache responses** | Cache insights per symbol per day in Redis | ~70% fewer API calls |
| **Batch requests** | Generate insights for top 100 symbols nightly, not on-demand | Predictable cost |
| **Rate limiting** | 5 AI insights per day (free), 50 (pro) | Controls usage |
| **Prompt optimization** | Shorter prompts, structured output format | ~30% token reduction |

**Estimated cost**: ~$50-100/month for 10K users with aggressive caching.

---

## 19. Project Folder Structure

```
Financial-Marketing-Forecasting/
│
├── client/                          # Next.js 16 Frontend
│   ├── app/                         # App Router pages
│   │   ├── (auth)/                  # Auth route group
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/             # Authenticated route group
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── predict/page.tsx
│   │   │   ├── portfolio/page.tsx
│   │   │   ├── backtest/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── (admin)/                 # Admin route group
│   │   │   └── admin/
│   │   │       ├── page.tsx
│   │   │       ├── models/page.tsx
│   │   │       └── users/page.tsx
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Landing page
│   │   └── globals.css              # Global styles
│   ├── components/                  # Reusable UI components
│   │   ├── ui/                      # Base UI (buttons, inputs, cards)
│   │   ├── charts/                  # Financial charts (candlestick, equity curve)
│   │   ├── dashboard/               # Dashboard-specific components
│   │   ├── prediction/              # Prediction display components
│   │   └── layout/                  # Navigation, sidebar, footer
│   ├── lib/                         # Utility functions
│   │   ├── api.ts                   # API client (axios/fetch wrapper)
│   │   ├── auth.ts                  # Auth utilities
│   │   ├── hooks/                   # Custom React hooks
│   │   └── utils.ts                 # General utilities
│   ├── stores/                      # Zustand state stores
│   ├── types/                       # TypeScript type definitions
│   ├── public/                      # Static assets
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
│
├── server/                          # NestJS Backend API
│   ├── src/
│   │   ├── main.ts                  # Application entry point
│   │   ├── app.module.ts            # Root module
│   │   ├── auth/                    # Authentication module
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/          # Passport strategies (JWT, OAuth)
│   │   │   ├── guards/              # Auth guards (JWT, RBAC)
│   │   │   └── dto/                 # Data Transfer Objects
│   │   ├── users/                   # User management module
│   │   ├── predictions/             # Prediction module
│   │   │   ├── predictions.controller.ts
│   │   │   ├── predictions.service.ts
│   │   │   └── dto/
│   │   ├── portfolio/               # Portfolio module
│   │   ├── backtest/                # Backtesting module
│   │   ├── market-data/             # Market data ingestion module
│   │   ├── alerts/                  # Alert system module
│   │   ├── admin/                   # Admin module
│   │   ├── websocket/               # WebSocket gateway
│   │   ├── common/                  # Shared utilities
│   │   │   ├── filters/             # Exception filters
│   │   │   ├── interceptors/        # Logging, transform interceptors
│   │   │   ├── pipes/               # Validation pipes
│   │   │   └── decorators/          # Custom decorators
│   │   └── config/                  # Configuration module
│   ├── test/                        # E2E tests
│   ├── package.json
│   ├── nest-cli.json
│   └── tsconfig.json
│
├── ml_core/                         # ML Service (Python)
│   ├── ml_pipeline/                 # Core ML package
│   │   ├── fmf/                     # Main Python package
│   │   │   ├── components/          # Pipeline components
│   │   │   │   ├── data_ingestion.py
│   │   │   │   ├── data_validation.py
│   │   │   │   ├── data_transformation.py
│   │   │   │   ├── feature_engineering.py
│   │   │   │   ├── model_trainer.py
│   │   │   │   └── model_evaluator.py
│   │   │   ├── pipeline/            # Orchestration pipelines
│   │   │   │   ├── training_pipeline.py
│   │   │   │   └── prediction_pipeline.py
│   │   │   ├── entity/              # Data classes / configs
│   │   │   ├── constant/            # Constants and enums
│   │   │   ├── utils/               # Utility functions
│   │   │   ├── cloud/               # Cloud integrations (S3, MongoDB)
│   │   │   ├── exception/           # Custom exceptions
│   │   │   └── logging/             # Logging configuration
│   │   ├── api/                     # FastAPI application
│   │   │   ├── main.py              # FastAPI app entry
│   │   │   ├── routes/              # API route handlers
│   │   │   │   ├── predict.py
│   │   │   │   ├── backtest.py
│   │   │   │   ├── train.py
│   │   │   │   └── health.py
│   │   │   ├── schemas/             # Pydantic request/response models
│   │   │   └── middleware/          # Auth, CORS, rate limiting
│   │   ├── notebooks/               # Jupyter notebooks (research)
│   │   ├── models/                  # Trained model artifacts
│   │   ├── Market_Data/             # Raw and processed data
│   │   ├── tests/                   # Unit and integration tests
│   │   ├── requirements.txt
│   │   ├── setup.py
│   │   └── Dockerfile
│   └── project_analysis.md
│
├── shared/                          # Shared code and contracts
│   ├── types/                       # Shared TypeScript/Python types
│   │   ├── api-contracts.ts         # API request/response types
│   │   └── api-contracts.py         # Python mirror (Pydantic)
│   └── constants/                   # Shared constants
│
├── infra/                           # Infrastructure as Code
│   ├── docker/
│   │   └── docker-compose.yml       # Local development setup
│   ├── k8s/                         # Kubernetes manifests
│   │   ├── namespace.yaml
│   │   ├── deployments/
│   │   ├── services/
│   │   ├── configmaps/
│   │   └── secrets/
│   ├── terraform/                   # Cloud infrastructure (AWS/GCP)
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── monitoring/
│       ├── prometheus.yml
│       ├── grafana-dashboards/
│       └── alertmanager.yml
│
├── docs/                            # Documentation
│   ├── architecture/
│   │   ├── system-architecture.md   # This document
│   │   ├── er-diagram.md
│   │   └── api-reference.md
│   ├── deployment/
│   │   ├── local-setup.md
│   │   ├── staging-deploy.md
│   │   └── production-deploy.md
│   ├── ml/
│   │   ├── model-documentation.md
│   │   ├── feature-dictionary.md
│   │   └── experiment-log.md
│   └── runbooks/                    # Operational runbooks
│       ├── incident-response.md
│       └── model-retraining.md
│
├── .github/
│   └── workflows/
│       ├── ci-cd.yml                # Main CI/CD pipeline
│       ├── ml-pipeline.yml          # ML training pipeline
│       └── security-scan.yml        # Security scanning
│
├── .gitignore
├── README.md
└── LICENSE
```

### 19.1 Folder Explanations

| Folder | Purpose | Key Decisions |
|--------|---------|---------------|
| `client/` | Next.js 16 frontend with App Router | Already exists with React 19 + TailwindCSS. Route groups for auth/dashboard/admin separation. |
| `server/` | NestJS backend API | Currently empty. Module-based architecture mirrors NestJS best practices — each feature is a self-contained module. |
| `ml_core/ml_pipeline/` | Python ML service | Already has the `fmf` package, notebooks, and pipeline structure. Add `api/` for FastAPI serving layer. |
| `shared/` | Cross-service contracts | TypeScript types shared between client and server; Pydantic models mirror API contracts for Python. |
| `infra/` | Infrastructure configuration | Docker Compose for local dev, K8s manifests for production, Terraform for cloud provisioning. |
| `docs/` | Project documentation | Architecture docs, deployment guides, ML documentation, operational runbooks. |

---

## 20. Development Roadmap

### Phase 1 — MVP (Weeks 1–8)

| Week | Deliverable | Details |
|------|------------|---------|
| 1-2 | **NestJS Backend Setup** | Project scaffolding, auth module (JWT), user CRUD, TimescaleDB schema, Docker Compose |
| 3-4 | **FastAPI ML Serving** | Convert notebook models to inference API, `/predict` endpoint, model loading, health checks |
| 5-6 | **Frontend Core** | Landing page, auth pages, dashboard, prediction screen with TradingView charts |
| 7 | **Data Pipeline** | Yahoo Finance ingestion, feature engineering pipeline, scheduled data refresh |
| 8 | **Integration & Polish** | End-to-end flow testing, error handling, basic monitoring, README documentation |

**MVP Deliverable**: A user can sign up, select a stock, view a chart with indicators, get a UP/DOWN prediction with confidence, and see a basic dashboard.

### Phase 2 — Advanced Analytics (Weeks 9–14)

| Week | Deliverable | Details |
|------|------------|---------|
| 9-10 | **Backtesting Engine** | Strategy simulation, metrics calculation, equity curve visualization |
| 11 | **Portfolio Management** | Portfolio CRUD, position tracking, P&L calculation |
| 12 | **Model Comparison** | Multi-model inference, comparison dashboard, SHAP explanations |
| 13 | **AI Insights** | LLM integration, market summaries, prediction explanations |
| 14 | **Data Upload** | CSV/Excel upload with validation, custom symbol predictions |

### Phase 3 — Real-Time & Scale (Weeks 15–20)

| Week | Deliverable | Details |
|------|------------|---------|
| 15-16 | **WebSocket Integration** | Real-time price feeds, live prediction updates, alert system |
| 17-18 | **MLOps Pipeline** | MLflow tracking, model registry, automated retraining, drift detection |
| 19 | **Admin Panel** | Model management, user administration, system health dashboard |
| 20 | **Performance Optimization** | Redis caching layer, database indexing, API response optimization |

### Phase 4 — Enterprise Scale (Weeks 21–28)

| Week | Deliverable | Details |
|------|------------|---------|
| 21-22 | **Kubernetes Deployment** | K8s manifests, HPA, health checks, rolling deployments |
| 23-24 | **Full Monitoring Stack** | Prometheus, Grafana dashboards, Loki, alerting rules |
| 25-26 | **API Tier & Billing** | API key management, rate limiting tiers, usage tracking |
| 27-28 | **Security Hardening** | Penetration testing, WAF, compliance audit, VAPT report |

```mermaid
gantt
    title Development Roadmap
    dateFormat  YYYY-MM-DD
    axisFormat  %b %Y

    section Phase 1 - MVP
    Backend Setup           :a1, 2026-06-09, 2w
    ML Serving API          :a2, after a1, 2w
    Frontend Core           :a3, after a2, 2w
    Data Pipeline           :a4, after a3, 1w
    Integration             :a5, after a4, 1w

    section Phase 2 - Analytics
    Backtesting Engine      :b1, after a5, 2w
    Portfolio Management    :b2, after b1, 1w
    Model Comparison        :b3, after b2, 1w
    AI Insights             :b4, after b3, 1w
    Data Upload             :b5, after b4, 1w

    section Phase 3 - Real-Time
    WebSocket Integration   :c1, after b5, 2w
    MLOps Pipeline          :c2, after c1, 2w
    Admin Panel             :c3, after c2, 1w
    Performance Optimization:c4, after c3, 1w

    section Phase 4 - Enterprise
    Kubernetes Deployment   :d1, after c4, 2w
    Monitoring Stack        :d2, after d1, 2w
    API Tier & Billing      :d3, after d2, 2w
    Security Hardening      :d4, after d3, 2w
```

---

## 21. Critical Reality Check

> [!CAUTION]
> **This section is the most important in the entire document. Read it before writing a single line of code.**

### 21.1 Why Predicting Markets is Fundamentally Difficult

**The Efficient Market Hypothesis (EMH)** — Eugene Fama's foundational theory states that asset prices reflect all available information. In its strong form, no analysis (technical or fundamental) can consistently generate excess returns. In practice, markets are "mostly efficient" with exploitable pockets of inefficiency that:
- Are small (basis points, not percentage points)
- Disappear quickly once discovered
- Require significant capital and speed to exploit
- Are subject to regime changes

**Signal-to-Noise Ratio**: Financial returns have an extremely low signal-to-noise ratio. Daily stock returns are ~90-95% noise. A model with 55% accuracy on daily direction is already exceptional (most academic papers report 52-58%). **Claiming >65% accuracy almost certainly indicates a bug, data leakage, or overfitting.**

### 21.2 Common Mistakes Beginners Make

| Mistake | Why It's Dangerous | How to Avoid |
|---------|-------------------|--------------|
| **Random train/test split** | Future data leaks into training; accuracy is meaningless | Always use time-based splits with purging |
| **Using close price as feature** | Causes look-ahead bias if not properly lagged | Use returns or properly lagged features only |
| **Not accounting for transaction costs** | Strategies that look profitable become losers after costs | Include realistic cost model (your ~0.5% round-trip for Indian stocks) |
| **Overfitting to backtest** | Optimizing parameters to fit historical data perfectly | Walk-forward validation, out-of-sample testing, keep it simple |
| **Survivorship bias** | Only testing on stocks that still exist | Include delisted stocks; use point-in-time universe |
| **Cherry-picking time periods** | Testing only during favorable market conditions | Test across multiple market regimes (bull, bear, sideways) |
| **Ignoring regime changes** | Model trained in bull market fails in bear market | Regime-specific models (you already have this — good!) |
| **Too many features** | Curse of dimensionality, overfitting with sparse data | Feature selection, regularization, domain expertise |
| **Claiming ML "predicts" markets** | Creates false confidence, potential regulatory/ethical issues | Frame as "statistical edge" not "prediction"; always show confidence intervals |
| **Not comparing to baseline** | A complex model might not beat buy-and-hold | Always compare to naive baselines (random, buy-and-hold, momentum) |
| **Ignoring macro regime** | Interest rate changes, geopolitical events invalidate models | Include macro features, retrain frequently |

### 21.3 Intellectual Honesty Checklist

Before deploying any model, answer these honestly:

- [ ] Does the model outperform a random baseline (50%) by a statistically significant margin on truly out-of-sample data?
- [ ] Have you verified no data leakage exists in the feature pipeline? (Check timestamp alignment rigorously)
- [ ] Does the strategy remain profitable after realistic transaction costs?
- [ ] Have you tested across at least 2 different market regimes?
- [ ] Is the Sharpe Ratio computed correctly (annualized, with risk-free rate)?
- [ ] Have you avoided snooping — making strategy decisions based on test set performance?
- [ ] Does the model degrade gracefully when features are missing or stale?
- [ ] Are confidence scores calibrated (i.e., predictions with 70% confidence are correct ~70% of the time)?

---

## 22. Final Recommendation

### 22.1 Exact Technology Stack

| Layer | Technology | Version | Justification |
|-------|-----------|---------|---------------|
| **Frontend** | Next.js + React + TypeScript | 16 / 19 / 5 | Already in place; SSR, App Router, Server Components |
| **Styling** | TailwindCSS | 4 | Already configured; utility-first, fast iteration |
| **Charting** | TradingView Lightweight Charts | 4.x | Industry standard for financial charts, free, performant |
| **Backend API** | NestJS + TypeScript | 10+ / 5 | Enterprise architecture, guards/pipes/interceptors, WebSocket gateway |
| **ML Service** | FastAPI + Python | 0.115+ / 3.11+ | Async inference, Pydantic validation, auto-docs |
| **Primary DB** | TimescaleDB | Latest (PG 16) | Time-series optimized PostgreSQL for OHLCV + relational data |
| **Feature Store** | MongoDB Atlas | 7+ | Already in stack, document-oriented for flexible feature vectors |
| **Cache + Queue** | Redis | 7+ | Caching, pub/sub, streams — triple duty |
| **ML Framework** | XGBoost + LightGBM + PyTorch | 2.x / 4.x / 2.x | Ensemble of tree models (tabular) + neural (sequence) |
| **Experiment Tracking** | MLflow | 2.x | Open-source, model registry, artifact storage |
| **Monitoring** | Evidently AI | 0.4+ | Data/model drift detection |
| **Containerization** | Docker + Docker Compose | Latest | Local dev and production deployment |
| **Orchestration** | Kubernetes (Phase 4) | 1.28+ | Production scaling, HPA, rolling deployments |
| **CI/CD** | GitHub Actions | Latest | Integrated with GitHub, free tier sufficient |
| **Monitoring** | Prometheus + Grafana + Loki | Latest | Industry standard observability stack |

### 22.2 Architecture Decision Rankings

| Decision | Ranking | Reasoning |
|----------|---------|-----------|
| **TimescaleDB for time-series** | 🥇 Best | Native time-series on PostgreSQL; compression, continuous aggregates, full SQL |
| **XGBoost as primary model** | 🥇 Best | Proven best for tabular financial data at your data scale |
| **Regime-specific models** | 🥇 Best | Markets behave differently in different volatility regimes; your pipeline already does this |
| **NestJS for backend** | 🥇 Best | TypeScript alignment with frontend, enterprise patterns, WebSocket support |
| **FastAPI for ML serving** | 🥇 Best | Industry standard, async, Pydantic, Python-native ML |
| **Redis for cache + queue + pub/sub** | 🥇 Best | Reduces infrastructure complexity; triple-duty component |
| **Walk-forward validation** | 🥇 Best | Only correct way to validate time-series models |
| **Optuna for tuning** | 🥇 Best | TPE sampler is most efficient for hyperparameter search |
| **WebSockets for real-time** | 🥈 Good | Necessary for bidirectional; SSE would be acceptable alternative |
| **MongoDB as feature store** | 🥈 Good | Already in stack, works but a dedicated feature store (Feast) would be better at scale |
| **Redis Streams as message queue** | 🥈 Good | Adequate at current scale; Kafka needed at 100K+ users |
| **Transformer as ensemble member** | 🥈 Good | Adds value for long-range patterns but marginal improvement over trees for daily predictions |
| **LLM for market insights** | 🥉 Nice-to-have | Adds user value but not core to prediction quality; prioritize ML pipeline first |

### 22.3 Cost Estimate

| Resource | Phase 1 (MVP) | Phase 2 | Phase 3 | Phase 4 |
|----------|--------------|---------|---------|---------|
| **Cloud Compute** | $50/mo (2 small VMs) | $150/mo | $400/mo | $2,000/mo |
| **Database (TimescaleDB)** | $30/mo (managed) | $60/mo | $150/mo | $500/mo |
| **MongoDB Atlas** | $0 (free tier) | $25/mo | $60/mo | $200/mo |
| **Redis** | $0 (self-hosted) | $25/mo (managed) | $50/mo | $200/mo |
| **LLM API (GPT-4o-mini)** | $0 (skip Phase 1) | $30/mo | $50/mo | $100/mo |
| **Domain + SSL** | $15/year | $15/year | $15/year | $15/year |
| **Monitoring** | $0 (self-hosted) | $0 | $30/mo | $100/mo |
| **CI/CD (GitHub Actions)** | $0 (free tier) | $0 | $0 | $15/mo |
| **CDN (Cloudflare)** | $0 (free tier) | $0 | $20/mo | $200/mo |
| **Total** | **~$80/mo** | **~$290/mo** | **~$760/mo** | **~$3,300/mo** |

### 22.4 Team Size Estimate

| Phase | Team Size | Roles |
|-------|-----------|-------|
| **Phase 1 (MVP)** | 1–2 developers | Full-stack dev (you) + optional ML engineer |
| **Phase 2 (Analytics)** | 2–3 developers | Full-stack + ML engineer + optional frontend specialist |
| **Phase 3 (Real-Time)** | 3–4 developers | Full-stack + ML + DevOps + frontend |
| **Phase 4 (Enterprise)** | 5–8 people | + QA engineer + security engineer + product manager |

> [!NOTE]
> As a solo developer / final-year project, **Phase 1 and Phase 2 are realistic** within 3-4 months. Phases 3 and 4 are aspirational and documented for completeness — they represent the target state if the project evolves into a startup or product.

### 22.5 Deployment Strategy

```mermaid
graph LR
    subgraph "Phase 1: Simple"
        A1["Docker Compose<br/>on single VPS<br/>(DigitalOcean $48/mo)"]
    end

    subgraph "Phase 2: Managed"
        B1["Frontend: Vercel (free)"]
        B2["Backend: Railway / Render"]
        B3["DB: Timescale Cloud"]
        B4["Redis: Upstash"]
    end

    subgraph "Phase 3: Scalable"
        C1["Frontend: Vercel Pro"]
        C2["Backend: AWS ECS / GCP Cloud Run"]
        C3["DB: Timescale Cloud (HA)"]
        C4["Redis: ElastiCache"]
    end

    subgraph "Phase 4: Enterprise"
        D1["Kubernetes (EKS/GKE)"]
        D2["Full monitoring stack"]
        D3["Multi-region"]
    end

    A1 --> B1 & B2 & B3 & B4
    B1 & B2 & B3 & B4 --> C1 & C2 & C3 & C4
    C1 & C2 & C3 & C4 --> D1 & D2 & D3
```

---

## Appendix A: Glossary

| Term | Definition |
|------|-----------|
| **OHLCV** | Open, High, Low, Close, Volume — standard price bar data |
| **Sharpe Ratio** | Risk-adjusted return metric: `(Return - Risk-Free) / Volatility` |
| **Max Drawdown** | Largest peak-to-trough decline in portfolio value |
| **Alpha** | Excess return above benchmark |
| **Walk-Forward** | Validation technique that slides training/test windows forward in time |
| **Feature Store** | Centralized repository for computed ML features with versioning |
| **Concept Drift** | When the statistical relationship between features and target changes over time |
| **SHAP** | SHapley Additive exPlanations — game-theory based feature importance |
| **Hypertable** | TimescaleDB automatic time-based partitioning of a PostgreSQL table |
| **HPA** | Horizontal Pod Autoscaler — Kubernetes auto-scaling based on metrics |

---

> **Document Status**: This document requires stakeholder review and approval before implementation begins. All architecture decisions are subject to change based on evolving requirements and constraints discovered during implementation.
>
> **Disclaimer**: This platform is designed for educational and research purposes. Market predictions are probabilistic and should not be treated as financial advice. Users should consult SEBI-registered advisors before making investment decisions.
