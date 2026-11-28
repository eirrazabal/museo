#!/usr/bin/env python3
"""construir.py: junta la carpeta en archivos HTML únicos, dentro de dist/ y docs/index.html para GitHub Pages."""
import re, os, base64, shutil

base = os.path.dirname(os.path.abspath(__file__))

def leer(ruta):
    with open(os.path.join(base, ruta), encoding='utf-8') as f:
        return f.read()

def armar(liviana):
    h = leer('index.html')
    with open(os.path.join(base, 'assets/experiencia-color.png'), 'rb') as f:
        logo = base64.b64encode(f.read()).decode('ascii')
    h = h.replace('src="assets/experiencia-color.png"', 'src="data:image/png;base64,' + logo + '"')
    h = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">', lambda m: '<style>\n' + leer(m.group(1)) + '\n</style>', h)
    def js(m):
        ruta = m.group(1)
        if liviana and 'aframe' in ruta:
            return '<script src="https://cdn.jsdelivr.net/npm/aframe@1.5.0/dist/aframe.min.js"></script>'
        return '<script>\n' + leer(ruta).replace('</script', '<\\/script') + '\n</script>'
    return re.sub(r'<script src="((?:vendor|js|datos)/[^"]+)"></script>', js, h)

def copiar_fichas(destino):
    origen = os.path.join(base, 'assets', 'fichas')
    salida = os.path.join(base, destino, 'assets', 'fichas')
    os.makedirs(salida, exist_ok=True)
    for nombre in os.listdir(origen):
        archivo = os.path.join(origen, nombre)
        if os.path.isfile(archivo):
            shutil.copy2(archivo, os.path.join(salida, nombre))

os.makedirs(os.path.join(base, 'dist'), exist_ok=True)
os.makedirs(os.path.join(base, 'docs'), exist_ok=True)

for nombre, liviana in [('sala-virtual.html', False), ('sala-virtual-liviana.html', True)]:
    contenido = armar(liviana)
    ruta = os.path.join(base, 'dist', nombre)
    with open(ruta, 'w', encoding='utf-8') as f:
        f.write(contenido)
    print(nombre, os.path.getsize(ruta) // 1024, 'KB')

    # Copia también la versión completa en docs/index.html para GitHub Pages
    if not liviana:
        ruta_pages = os.path.join(base, 'docs', 'index.html')
        with open(ruta_pages, 'w', encoding='utf-8') as f:
            f.write(contenido)
        print('docs/index.html actualizado para GitHub Pages')
    copiar_fichas('dist')
    if not liviana:
        copiar_fichas('docs')