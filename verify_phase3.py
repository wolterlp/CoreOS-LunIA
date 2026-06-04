from playwright.sync_api import sync_playwright
import time

def test_phase3():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # 1. Login
        page.goto("http://localhost:5173/login")
        page.fill('input[type="email"]', "admin@cerebro.com")
        page.fill('input[type="password"]', "password123")
        page.click('button[type="submit"]')

        # Esperar redirección al dashboard
        page.wait_for_url("http://localhost:5173/")
        print("Login exitoso.")

        # 2. Verificar Sidebar y navegación a nuevas capas
        # Capa 2: Comprensión Empresarial
        page.click('a[href="/business-understanding"]')
        page.wait_for_selector('text=Comprensión Empresarial')
        print("Capa 2 (Comprensión Empresarial) verificada.")

        # Capa 6: Simulación
        page.click('a[href="/simulations"]')
        page.wait_for_selector('text=Simulación Estratégica')
        print("Capa 6 (Simulación) verificada.")

        # Secretaria Virtual
        page.click('a[href="/secretary"]')
        page.wait_for_selector('text=Secretaria Virtual')
        print("Secretaria Virtual verificada.")

        # Alertas Proactivas
        page.click('a[href="/alerts"]')
        page.wait_for_selector('text=Alertas Proactivas')
        print("Alertas Proactivas verificadas.")

        # Asistente de Crecimiento
        page.click('a[href="/growth"]')
        page.wait_for_selector('text=Asistente de Crecimiento')
        print("Asistente de Crecimiento verificado.")

        browser.close()

if __name__ == "__main__":
    test_phase3()
