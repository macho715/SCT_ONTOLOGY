# 🚀 HVDC Gateway API 운영 환경 배포 가이드

## 📊 개요
Mock Gateway에서 실제 운영 환경으로 전환하는 완전한 가이드입니다.

## 🏗️ 1단계: 클라우드 인프라 구축

### AWS 기반 아키텍처 (권장)
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  hvdc-gateway:
    build: .
    ports:
      - "443:8080"
    environment:
      - ENV=production
      - DB_HOST=hvdc-db.cluster-xxx.amazonaws.com
      - REDIS_HOST=hvdc-cache.xxx.cache.amazonaws.com
      - LOG_LEVEL=INFO
    volumes:
      - ./certs:/app/certs
    networks:
      - hvdc-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - hvdc-gateway
    networks:
      - hvdc-network

networks:
  hvdc-network:
    driver: bridge
```

### Dockerfile (Production)
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 운영 환경 패키지
COPY requirements.prod.txt .
RUN pip install --no-cache-dir -r requirements.prod.txt

# 애플리케이션 코드
COPY . .

# 보안 설정
RUN useradd -m -u 1000 hvdc && chown -R hvdc:hvdc /app
USER hvdc

# 헬스체크
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/v1/health || exit 1

EXPOSE 8080
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "4", "app:app"]
```

## 🔒 2단계: 보안 강화

### JWT 기반 인증
```python
# auth.py
import jwt
from datetime import datetime, timedelta
from functools import wraps

class JWTAuth:
    def __init__(self, secret_key, algorithm='HS256'):
        self.secret_key = secret_key
        self.algorithm = algorithm

    def generate_token(self, user_id, permissions):
        payload = {
            'user_id': user_id,
            'permissions': permissions,
            'exp': datetime.utcnow() + timedelta(hours=24),
            'iat': datetime.utcnow()
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

    def verify_token(self, token):
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            raise Exception("Token expired")
        except jwt.InvalidTokenError:
            raise Exception("Invalid token")

def require_auth(permissions=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({'error': 'Missing or invalid authorization header'}), 401

            token = auth_header.split(' ')[1]
            try:
                payload = jwt_auth.verify_token(token)
                request.current_user = payload

                if permissions and not any(p in payload.get('permissions', []) for p in permissions):
                    return jsonify({'error': 'Insufficient permissions'}), 403

                return f(*args, **kwargs)
            except Exception as e:
                return jsonify({'error': str(e)}), 401
        return decorated_function
    return decorator
```

### Rate Limiting
```python
# rate_limiter.py
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import redis

redis_client = redis.Redis(host='hvdc-cache.xxx.cache.amazonaws.com', port=6379, db=0)

limiter = Limiter(
    app,
    key_func=get_remote_address,
    storage_uri="redis://hvdc-cache.xxx.cache.amazonaws.com:6379",
    default_limits=["1000 per hour", "100 per minute"]
)

# 엔드포인트별 제한
@app.route('/v1/mrr/draft', methods=['POST'])
@limiter.limit("10 per minute")
@require_auth(permissions=['mrr:create'])
def create_mrr_draft():
    # 실제 MRR 생성 로직
    pass

@app.route('/v1/predict/eta', methods=['POST'])
@limiter.limit("50 per minute")
@require_auth(permissions=['eta:predict'])
def predict_eta():
    # 실제 ETA 예측 로직
    pass
```

## 🗄️ 3단계: 실제 데이터 소스 연동

### OCR 엔진 통합
```python
# ocr_service.py
import pytesseract
from PIL import Image
import cv2
import numpy as np

class ProductionOCRService:
    def __init__(self):
        self.confidence_threshold = 0.90

    def extract_invoice_data(self, image_path):
        """실제 송장 OCR 처리"""
        # 이미지 전처리
        image = cv2.imread(image_path)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # OCR 실행
        custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        data = pytesseract.image_to_data(gray, config=custom_config, output_type=pytesseract.Output.DICT)

        # 신뢰도 기반 필터링
        filtered_data = []
        for i, conf in enumerate(data['conf']):
            if int(conf) > self.confidence_threshold * 100:
                filtered_data.append({
                    'text': data['text'][i],
                    'confidence': int(conf) / 100,
                    'bbox': (data['left'][i], data['top'][i], data['width'][i], data['height'][i])
                })

        return self.parse_invoice_fields(filtered_data)

    def parse_invoice_fields(self, ocr_data):
        """송장 필드 파싱"""
        parsed_data = {
            'po_number': None,
            'items': [],
            'total_amount': None,
            'confidence': 0.0
        }

        # 실제 파싱 로직 구현
        # PO 번호, 아이템 목록, 금액 등 추출

        return parsed_data
```

### ETA 예측 엔진
```python
# eta_service.py
import requests
from datetime import datetime, timedelta
import math

class ProductionETAService:
    def __init__(self):
        self.weather_api_key = os.getenv('WEATHER_API_KEY')
        self.port_api_key = os.getenv('PORT_API_KEY')

    def predict_eta(self, origin, destination, mode, departure_time=None):
        """실제 ETA 예측"""
        # 1. 거리 계산
        distance_km = self.calculate_distance(origin, destination)

        # 2. 운송 모드별 기본 속도
        base_speeds = {
            'SEA': 25,    # knots
            'ROAD': 60,   # km/h
            'RORO': 20    # knots
        }

        # 3. 날씨 영향 계산
        weather_factor = self.get_weather_impact(origin, destination)

        # 4. 포트 혼잡도 확인
        port_congestion = self.get_port_congestion(destination)

        # 5. ETA 계산
        base_hours = distance_km / base_speeds.get(mode, 40)
        adjusted_hours = base_hours * weather_factor * port_congestion

        if departure_time:
            eta = datetime.fromisoformat(departure_time) + timedelta(hours=adjusted_hours)
        else:
            eta = datetime.utcnow() + timedelta(hours=adjusted_hours)

        # 6. 위험도 평가
        risk_level = self.assess_risk(weather_factor, port_congestion, adjusted_hours)

        return {
            'eta_utc': eta.isoformat(),
            'transit_hours': round(adjusted_hours, 2),
            'risk_level': risk_level,
            'factors': {
                'weather_impact': weather_factor,
                'port_congestion': port_congestion,
                'base_transit': base_hours
            }
        }

    def get_weather_impact(self, origin, destination):
        """실제 기상 데이터 기반 영향도 계산"""
        # OpenWeatherMap API 호출
        weather_url = f"https://api.openweathermap.org/data/2.5/weather"
        params = {
            'q': origin,
            'appid': self.weather_api_key,
            'units': 'metric'
        }

        try:
            response = requests.get(weather_url, params=params, timeout=5)
            weather_data = response.json()

            wind_speed = weather_data.get('wind', {}).get('speed', 0)
            visibility = weather_data.get('visibility', 10000) / 10000  # normalize

            # 날씨 영향 계수 계산 (1.0 = 정상, >1.0 = 지연)
            weather_factor = 1.0 + (wind_speed / 50) + (1 - visibility) * 0.5
            return min(weather_factor, 2.0)  # 최대 2배 지연

        except Exception as e:
            logging.warning(f"Weather API error: {e}")
            return 1.1  # 기본 10% 지연 가정
```

## 🔧 4단계: 모니터링 및 로깅

### Prometheus + Grafana 메트릭
```python
# metrics.py
from prometheus_client import Counter, Histogram, Gauge, start_http_server

# 메트릭 정의
api_requests_total = Counter('hvdc_api_requests_total', 'Total API requests', ['method', 'endpoint', 'status'])
api_request_duration = Histogram('hvdc_api_request_duration_seconds', 'API request duration')
active_connections = Gauge('hvdc_active_connections', 'Active connections')
ocr_confidence = Histogram('hvdc_ocr_confidence', 'OCR confidence scores')

@app.before_request
def before_request():
    request.start_time = time.time()

@app.after_request
def after_request(response):
    request_duration = time.time() - request.start_time
    api_request_duration.observe(request_duration)
    api_requests_total.labels(
        method=request.method,
        endpoint=request.endpoint or 'unknown',
        status=response.status_code
    ).inc()
    return response
```

### 구조화된 로깅
```python
# logging_config.py
import structlog
import logging.config

LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'json': {
            'format': '%(message)s'
        }
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'json',
            'stream': 'ext://sys.stdout'
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/hvdc/app.log',
            'maxBytes': 10485760,  # 10MB
            'backupCount': 5,
            'formatter': 'json'
        }
    },
    'loggers': {
        '': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False
        }
    }
}

logging.config.dictConfig(LOGGING_CONFIG)

# Structlog 설정
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="ISO"),
        structlog.processors.add_log_level,
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
    logger_factory=structlog.PrintLoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()
```

## 🚀 5단계: 배포 자동화

### GitHub Actions CI/CD
```yaml
# .github/workflows/production-deploy.yml
name: Production Deployment

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest
      - name: Run tests
        run: pytest tests/ -v
      - name: Security scan
        run: |
          pip install bandit
          bandit -r . -x tests/

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/')
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2

      - name: Build and push Docker image
        run: |
          docker build -t hvdc-gateway:${{ github.ref_name }} .
          docker tag hvdc-gateway:${{ github.ref_name }} $ECR_REGISTRY/hvdc-gateway:${{ github.ref_name }}
          docker push $ECR_REGISTRY/hvdc-gateway:${{ github.ref_name }}

      - name: Deploy to EKS
        run: |
          aws eks update-kubeconfig --name hvdc-cluster
          kubectl set image deployment/hvdc-gateway hvdc-gateway=$ECR_REGISTRY/hvdc-gateway:${{ github.ref_name }}
          kubectl rollout status deployment/hvdc-gateway
```

## 📋 6단계: GPTs Actions 업데이트

### 운영 환경용 OpenAPI 스키마
```yaml
# openapi.production.yaml
openapi: 3.1.0
info:
  title: HVDC Gateway API (Production)
  version: "2.0.0"
  description: Production-ready HVDC Ontology Insight Gateway

servers:
  - url: https://hvdc-api.samsungcnt.com/v1
    description: Production Server

security:
  - BearerAuth: []

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

paths:
  /health:
    get:
      operationId: healthCheck
      summary: Health check with detailed status
      responses:
        '200':
          description: Service status
          content:
            application/json:
              schema:
                type: object
                properties:
                  status: { type: string, enum: [healthy, degraded, unhealthy] }
                  timestamp: { type: string, format: date-time }
                  version: { type: string }
                  dependencies:
                    type: object
                    properties:
                      database: { type: string, enum: [up, down] }
                      redis: { type: string, enum: [up, down] }
                      ocr_service: { type: string, enum: [up, down] }

  /mrr/draft:
    post:
      operationId: createMRRDraft
      summary: Create MRR draft with advanced OCR
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                po_no: { type: string }
                site: { type: string, enum: [MIR, SHU, DAS, AGI] }
                packing_list_file:
                  type: string
                  format: binary
                  description: "Upload packing list image/PDF"
      responses:
        '200':
          description: MRR draft created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MRRDraftResponse'
```

### GPT Builder 업데이트 절차
```markdown
1. GPT Builder 접속
2. Actions 설정 → 기존 스키마 교체
3. 인증 방식 변경: API Key → Bearer Token
4. 토큰 값: 운영용 JWT 토큰 입력
5. 테스트 실행: "운영 환경 헬스체크 해줘"
6. 성공 확인 후 Public 재배포
```

## 📊 7단계: 성능 최적화

### 캐싱 전략
```python
# cache.py
import redis
import json
from functools import wraps

redis_client = redis.Redis(
    host='hvdc-cache.xxx.cache.amazonaws.com',
    port=6379,
    db=0,
    decode_responses=True
)

def cache_result(expiration=3600, key_prefix='hvdc'):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # 캐시 키 생성
            cache_key = f"{key_prefix}:{f.__name__}:{hash(str(args) + str(kwargs))}"

            # 캐시에서 확인
            cached_result = redis_client.get(cache_key)
            if cached_result:
                return json.loads(cached_result)

            # 실행 및 캐시 저장
            result = f(*args, **kwargs)
            redis_client.setex(cache_key, expiration, json.dumps(result))
            return result
        return decorated_function
    return decorator

@cache_result(expiration=1800, key_prefix='eta')
def predict_eta_cached(origin, destination, mode):
    return predict_eta(origin, destination, mode)
```

## 🔐 보안 체크리스트

- [ ] HTTPS 강제 적용 (HSTS)
- [ ] JWT 토큰 만료 시간 설정 (24시간)
- [ ] API Rate Limiting 적용
- [ ] SQL Injection 방지
- [ ] CORS 정책 설정
- [ ] 입력 데이터 검증 및 sanitization
- [ ] 로그에서 민감 정보 마스킹
- [ ] 정기적 보안 스캔 (OWASP ZAP)
- [ ] 의존성 취약점 점검 (Snyk)

## 📈 모니터링 대시보드

### Grafana 대시보드 패널
1. **API 성능**: 응답 시간, 처리량, 에러율
2. **비즈니스 메트릭**: OCR 정확도, ETA 예측 정확도
3. **인프라 상태**: CPU, 메모리, 디스크 사용률
4. **보안 이벤트**: 인증 실패, Rate Limit 초과
5. **사용자 패턴**: GPT 호출 빈도, 인기 기능

## 🚀 배포 체크리스트

### 배포 전 점검
- [ ] 모든 테스트 통과
- [ ] 보안 스캔 통과
- [ ] 성능 테스트 완료
- [ ] 백업 계획 수립
- [ ] 롤백 계획 준비
- [ ] 모니터링 설정 완료
- [ ] 알림 규칙 설정

### 배포 후 검증
- [ ] 헬스체크 통과
- [ ] GPTs Actions 연동 테스트
- [ ] 실제 데이터 처리 테스트
- [ ] 성능 메트릭 확인
- [ ] 로그 정상 생성 확인
- [ ] 알림 시스템 테스트

---

**예상 총 소요 기간: 4-6주**
**예상 비용: $500-1500/월 (클라우드 인프라 기준)**
**필요 인력: DevOps 1명, Backend 개발자 1명, QA 1명**
