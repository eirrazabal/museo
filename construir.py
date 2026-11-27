#!/usr/bin/env python3
"""construir.py: junta la carpeta en archivos HTML únicos, dentro de dist/.
   dist/sala-virtual.html          A-Frame, estilos, código y datos dentro de un solo archivo (funciona sin conexión).
   dist/sala-virtual-liviana.html  igual, pero A-Frame se descarga de internet (pesa mucho menos; sirve para pegar en Google Sites).
   Uso:  python3 construir.py"""
import re, os
base = os.path.dirname(os.path.abspath(__file__))
def leer(ruta):
    with open(os.path.join(base, ruta), encoding='utf-8') as f: return f.read()
def armar(liviana):
    h = leer('index.html')
    h = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">', lambda m: '<style>\n' + leer(m.group(1)) + '\n</style>', h)
    def js(m):
        ruta = m.group(1)
        if liviana and 'aframe' in ruta:
            return '<script src="https://cdn.jsdelivr.net/npm/aframe@1.5.0/dist/aframe.min.js"></script>'
        return '<script>\n' + leer(ruta).replace('</script', '<\\/script') + '\n</script>'
    return re.sub(r'<script src="((?:vendor|js|datos)/[^"]+)"></script>', js, h)
os.makedirs(os.path.join(base, 'dist'), exist_ok=True)
for nombre, liviana in [('sala-virtual.html', False), ('sala-virtual-liviana.html', True)]:
    ruta = os.path.join(base, 'dist', nombre)
    with open(ruta, 'w', encoding='utf-8') as f: f.write(armar(liviana))
    print(nombre, os.path.getsize(ruta) // 1024, 'KB')
