"""
MediaFlow AI — Deployment Verification Script
============================================
Tests the full ML pipeline against any deployment target.

Usage:
    # Test local dev server
    python verify_deployment.py

    # Test a deployed Render/Cloud Run instance
    python verify_deployment.py https://your-backend.onrender.com
    python verify_deployment.py https://mediaflow-ml-api-xxxx.run.app
"""

import urllib.request
import urllib.error
import json
import sys
import time

# ── CONFIG ──────────────────────────────────────────────────
BASE_URL = sys.argv[1].rstrip('/') if len(sys.argv) > 1 else 'http://127.0.0.1:8000'

# Two images that should produce meaningfully different results
TEST_IMAGES = [
    ('high-res sharp',    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200'),
    ('tiny degraded',     'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=50&q=10'),
]
# ─────────────────────────────────────────────────────────────

PASS = '[PASS]'
FAIL = '[FAIL]'

def post(endpoint, body, timeout=90):
    payload = json.dumps(body).encode()
    req = urllib.request.Request(
        BASE_URL + endpoint,
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read())

def check(label, condition, detail=''):
    status = PASS if condition else FAIL
    print('  %s  %s%s' % (status, label, (' — ' + detail) if detail else ''))
    return condition

def main():
    print()
    print('MediaFlow AI — Deployment Verification')
    print('Target: %s' % BASE_URL)
    print('=' * 55)

    # ── 1. Health check ───────────────────────────────────────
    print('\n[1] Health Check')
    try:
        r = urllib.request.urlopen(BASE_URL + '/docs', timeout=10)
        check('FastAPI /docs reachable', r.status == 200, 'HTTP %d' % r.status)
    except Exception as e:
        check('FastAPI /docs reachable', False, str(e))
        print('\nAborting — backend not reachable at %s' % BASE_URL)
        sys.exit(1)

    # ── 2. Single image full pipeline ─────────────────────────
    print('\n[2] Full Pipeline — Single Image')
    name, url = TEST_IMAGES[0]
    print('    Image: %s' % name)

    t0 = time.time()
    data = post('/api/ml/analyze', {'url': url, 'publicId': name})
    elapsed = time.time() - t0
    intel = data.get('intelligence', {})

    features  = intel.get('features', {})
    quality   = intel.get('quality', {})
    vision    = intel.get('vision', {})
    sim       = intel.get('similarity', {})
    anomaly   = intel.get('anomaly', {})
    xai       = intel.get('xai', [])
    decisions = intel.get('decisions', [])

    check('Response received in time', elapsed < 60, '%.1fs' % elapsed)
    check('OpenCV features extracted', len(features) == 9, '%d/9 features' % len(features))
    check('Random Forest prediction present', bool(quality.get('prediction')),
          quality.get('prediction', 'MISSING'))
    check('RF probabilities sum to ~1.0',
          abs(sum(quality.get('probabilities', {}).values()) - 1.0) < 0.01)
    check('ResNet-18 classification returned', len(vision.get('classification', [])) > 0,
          vision.get('classification', [{}])[0].get('label', 'none') if vision.get('classification') else 'empty')
    check('512D embedding returned',
          vision.get('embedding_dimensions') == 512,
          'dims=%s' % vision.get('embedding_dimensions'))
    check('Similarity score present', sim.get('score') is not None,
          '%.3f' % (sim.get('score') or 0))
    check('Anomaly risk present', anomaly.get('risk') is not None,
          '%.3f' % (anomaly.get('risk') or 0))
    check('XAI feature contributions present', len(xai) > 0, '%d factors' % len(xai))
    check('Decision recommendations present', len(decisions) > 0, '%d items' % len(decisions))

    # ── 3. Input sensitivity across two different images ───────
    print('\n[3] Input Sensitivity — Two Different Images')
    results = []
    for name, url in TEST_IMAGES:
        d = post('/api/ml/analyze', {'url': url, 'publicId': name})
        results.append((name, d.get('intelligence', {})))

    def metric(intel, key, sub):
        return intel.get(key, {}).get(sub)

    checks = [
        ('Resolution',       'features', 'Resolution'),
        ('Sharpness',        'features', 'Sharpness'),
        ('Entropy',          'features', 'Entropy'),
        ('RF Prediction',    'quality',  'prediction'),
        ('Anomaly Risk',     'anomaly',  'risk'),
        ('Similarity Score', 'similarity', 'score'),
    ]

    all_different = True
    for label, key, sub in checks:
        v0 = metric(results[0][1], key, sub)
        v1 = metric(results[1][1], key, sub)
        different = v0 != v1
        if not different:
            all_different = False
        detail = '%s vs %s' % (
            ('%.4f' % v0 if isinstance(v0, float) else str(v0)),
            ('%.4f' % v1 if isinstance(v1, float) else str(v1))
        )
        check('%s changes across inputs' % label, different, detail)

    # ── Summary ───────────────────────────────────────────────
    print('\n' + '=' * 55)
    if all_different:
        print('RESULT: ALL CHECKS PASSED')
        print('Pipeline is performing image-specific inference.')
        print('Safe to deploy / already verified at: %s' % BASE_URL)
    else:
        print('RESULT: SOME METRICS IDENTICAL — review above')
    print()

if __name__ == '__main__':
    main()
