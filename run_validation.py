from playwright.sync_api import sync_playwright
import time

def run_validation():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        # MOCK API
        def handle_route(route):
            url = route.request.url
            if "/api/auth/profile" in url:
                route.fulfill(status=200, body='{"success":true,"data":{"name":"Admin","role":"ADMIN"}}')
            elif "/api/settings" in url:
                route.fulfill(status=200, body='{"success":true,"data":[{"key":"TEST","value":"VAL","category":"AI","isSecret":false}]}')
            elif "/api/alerts" in url:
                route.fulfill(status=200, body='{"success":true,"data":[]}')
            elif "/api/business-understanding/profile" in url:
                route.fulfill(status=200, body='{"success":true,"data":null}')
            elif "/api/growth-advisor/status" in url:
                route.fulfill(status=200, body='{"success":true,"data":{"overallScore":75}}')
            elif "/api/virtual-secretary" in url:
                route.fulfill(status=200, body='{"success":true,"data":[]}')
            elif "/api/memory" in url:
                route.fulfill(status=200, body='{"success":true,"data":[]}')
            elif "/api/db-analyzer/connections" in url:
                route.fulfill(status=200, body='{"success":true,"data":[]}')
            elif "/api/simulations/history" in url:
                route.fulfill(status=200, body='{"success":true,"data":[]}')
            elif "/api/automation" in url:
                route.fulfill(status=200, body='{"success":true,"data":[]}')
            elif "/api/agents" in url:
                route.fulfill(status=200, body='{"success":true,"data":[]}')
            elif "/api/communication/conversations" in url:
                route.fulfill(status=200, body='{"success":true,"data":[]}')
            else:
                route.continue_()

        page.route("**/api/**", handle_route)

        print("--- Preparando entorno ---")
        page.goto("http://localhost:5173/")
        page.evaluate("""
            localStorage.setItem('auth-storage', JSON.stringify({
                state: { user: { name: 'Admin', role: 'ADMIN' }, token: 'mock-token' }
            }));
            localStorage.setItem('token', 'mock-token');
        """)
        page.reload()
        time.sleep(2)

        modules = [
            {"name": "Dashboard", "path": "/", "selector": "text=Negocio"},
            {"name": "Comprensión", "path": "/business-understanding", "selector": "text=Empresarial"},
            {"name": "Crecimiento", "path": "/growth", "selector": "text=Crecimiento"},
            {"name": "Alertas", "path": "/alerts", "selector": "text=Alertas"},
            {"name": "Secretaria", "path": "/secretary", "selector": "text=Secretaria"},
            {"name": "Memoria", "path": "/memory", "selector": "text=Memoria"},
            {"name": "Analizador BD", "path": "/db-analyzer", "selector": "text=Analizador"},
            {"name": "Simulación", "path": "/simulations", "selector": "text=Simulación"},
            {"name": "Automatización", "path": "/automation", "selector": "text=Automatización"},
            {"name": "Agentes", "path": "/agents", "selector": "text=Agentes"},
            {"name": "Comunicación", "path": "/communication", "selector": "text=Comunicación"},
            {"name": "Configuración", "path": "/settings", "selector": "text=Configuración"},
        ]

        print("--- Iniciando validación de módulos (MOCKED API) ---")
        for mod in modules:
            try:
                page.goto(f"http://localhost:5173{mod['path']}")
                page.wait_for_selector(mod['selector'], timeout=5000)
                print(f"✅ Módulo {mod['name']}: FUNCIONAL")
            except Exception:
                print(f"❌ Módulo {mod['name']}: ERROR")

        browser.close()

if __name__ == "__main__":
    run_validation()
