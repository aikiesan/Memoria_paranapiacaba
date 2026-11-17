"""Prepara as fotos do acervo do projeto para o app.

Lê os originais (HEIC, JPG) de uma pasta, aplica a orientação da câmera, recorta em 3:2
em torno do ponto indicado, desfoca pessoas reconhecíveis, reduz para 1200 x 800 e grava
WebP SEM metadados (remove GPS, data e modelo do aparelho).

Uso:
    uv run --with pillow --with pillow-heif python scripts/processar_fotos.py "<pasta dos originais>"

Para incluir uma foto nova, acrescente uma linha em FOTOS e rode de novo. Depois registre
a foto em src/assets/imagens/creditos.json e diga onde ela aparece em src/data/imagens.js.
"""

import sys
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps
from pillow_heif import register_heif_opener

register_heif_opener()

DESTINO = Path(__file__).resolve().parent.parent / "src" / "assets" / "imagens"
LARGURA, ALTURA = 1200, 800  # 3:2

# arquivo original -> (slug de saída, largura do recorte em fração da largura da foto,
#                      centro x, centro y, áreas a desfocar [(x0, y0, x1, y1) em frações])
FOTOS = {
    "torre do relógio.HEIC": ("acervo_relogio", 0.55, 0.50, 0.44, []),
    "Antigo mercado.jpg": ("acervo_mercado", 0.85, 0.45, 0.62, []),
    "Casas de madeira 1.HEIC": ("acervo_casas_1", 1.00, 0.50, 0.55, []),
    "Casas de madeira 2.HEIC": ("acervo_casas_2", 1.00, 0.50, 0.55, []),
    "Casas de madeira 3.HEIC": ("acervo_casas_3", 1.00, 0.50, 0.42, []),
    "Casas de madeira 4.JPEG": ("acervo_casas_4", 1.00, 0.50, 0.45, []),
    "Clube Uniao Lyra-Serrano.HEIC": ("acervo_lyra", 1.00, 0.50, 0.45, [(0.76, 0.51, 0.87, 0.67)]),
    "Passarela Metalica.JPEG": ("acervo_passarela", 1.00, 0.50, 0.48, []),
    "Castelinho.JPG": ("acervo_castelinho", 0.56, 0.52, 0.46, []),
    "museu funicular 1.HEIC": ("acervo_casa_de_maquinas", 1.00, 0.50, 0.55, []),
    "museu funicular 2.HEIC": ("acervo_funicular_galpao", 1.00, 0.50, 0.38, []),
    # recorte à esquerda para deixar de fora o banner do evento (foto histórica de terceiros)
    "museu funicular 3.HEIC": ("acervo_funicular_arcos", 0.62, 0.31, 0.38, []),
    "Locobreque.HEIC": ("acervo_vagao_neblina", 1.00, 0.50, 0.48, []),
    "neblina.HEIC": ("acervo_neblina", 1.00, 0.50, 0.55, []),
    # parte de cima da foto: pátio e relógio, sem a placa turística
    "IMG_4692.HEIC": ("acervo_patio_amanhecer", 1.00, 0.50, 0.38, []),
}


def recortar(im, largura_frac, cx, cy):
    w, h = im.size
    cw = round(w * largura_frac)
    ch = round(cw * ALTURA / LARGURA)
    if ch > h:  # foto muito baixa: limita pela altura
        ch = h
        cw = round(ch * LARGURA / ALTURA)
    x0 = min(max(round(cx * w - cw / 2), 0), w - cw)
    y0 = min(max(round(cy * h - ch / 2), 0), h - ch)
    return (x0, y0, x0 + cw, y0 + ch)


def main(origem: Path):
    DESTINO.mkdir(parents=True, exist_ok=True)
    for nome, (slug, frac, cx, cy, borrar) in FOTOS.items():
        arq = origem / nome
        if not arq.exists():
            print(f"!! não encontrado: {nome}")
            continue
        im = ImageOps.exif_transpose(Image.open(arq)).convert("RGB")
        w, h = im.size
        for bx0, by0, bx1, by1 in borrar:
            caixa = (round(bx0 * w), round(by0 * h), round(bx1 * w), round(by1 * h))
            im.paste(im.crop(caixa).filter(ImageFilter.GaussianBlur(radius=w / 120)), caixa)
        out = im.crop(recortar(im, frac, cx, cy)).resize((LARGURA, ALTURA), Image.LANCZOS)
        destino = DESTINO / f"{slug}.webp"
        out.save(destino, "WEBP", quality=76, method=6)  # sem exif=: nenhum metadado é gravado
        print(f"{slug}.webp  {destino.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
