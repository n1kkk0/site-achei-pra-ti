// =========================================================
// 1. CONFIGURAÇÃO DOS LINKS (COLE OS SEUS AQUI)
//
//    WhatsApp:  abra o grupo > Dados do grupo > "Convidar via link"
//               > Copiar link. Fica assim:
//               https://chat.whatsapp.com/AbC123xYz...
//    Instagram: link do seu perfil. Fica assim:
//               https://www.instagram.com/seuperfil
//
//    Para esconder um botão, deixe o link vazio: instagram: ""
// =========================================================
const LINKS_GRUPOS = {
  whatsapp: "https://chat.whatsapp.com/CcPFw9XAjVmBN7MNZVZJIW?s=cl&p=i&iam=2",
  instagram: "https://www.instagram.com/acheipratibymakowski/"
};

// =========================================================
// 2. IMAGENS DOS PRODUTOS
//    Salve as fotos na mesma pasta do index.html
//    com os nomes indicados em cada produto
//    (ex.: iphone-15.webp).
//    Se a foto não existir, o emoji aparece no lugar.
// =========================================================
const PASTA_IMAGENS = "";
const EXTENSOES_IMAGENS = ["webp"];

function caminhoImagem(nome, extensao) {
  return `${PASTA_IMAGENS}${nome}.${extensao}`;
}

function htmlImagem(item) {
  if (!item.imagem) {
    return item.emoji || "🏷️";
  }

  // Foto real capturada do anúncio da loja (URL completa http/https)
  if (item.imagem.startsWith("http://") || item.imagem.startsWith("https://")) {
    return `<img src="${item.imagem}"
      alt="${item.nome}" loading="lazy"
      data-emoji="${item.emoji || "🏷️"}"
      onerror="this.replaceWith(document.createTextNode(this.dataset.emoji))">`;
  }

  // Imagem local (.webp)
  return `<img src="${caminhoImagem(item.imagem, EXTENSOES_IMAGENS[0])}"
    alt="${item.nome}" loading="lazy"
    data-nome="${item.imagem}" data-emoji="${item.emoji || "🏷️"}" data-tentativa="0"
    onerror="imagemFalhou(this)">`;
}

function imagemFalhou(img) {
  const proxima = Number(img.dataset.tentativa) + 1;

  if (proxima < EXTENSOES_IMAGENS.length) {
    img.dataset.tentativa = proxima;
    img.src = caminhoImagem(img.dataset.nome, EXTENSOES_IMAGENS[proxima]);
  } else {
    img.replaceWith(document.createTextNode(img.dataset.emoji));
  }
}

// =========================================================
// 3. DADOS DOS PRODUTOS (VITRINE E FEED DO CELULAR)
// =========================================================

// ----- VITRINE (4 produtos lá embaixo) -----
const OFERTAS_VITRINE = [
  {
    imagem: "iphone-15",            // iphone-15.webp
    emoji: "📱",
    categoria: "📱 Celulares",
    nome: "Smartphone 128GB Lacrado",
    de: "R$ 5.699,90",
    por: "R$ 2.790,00",
    desconto: "51% OFF",
    link: ""
  },
  {
    imagem: "robo-aspirador",       // robo-aspirador.webp
    emoji: "🧹",
    categoria: "🏠 Casa",
    nome: "Robô Aspirador Inteligente",
    de: "R$ 1.299,90",
    por: "R$ 699,90",
    desconto: "46% OFF",
    link: ""
  },
  {
    imagem: "caixa-bluetooth",      // caixa-bluetooth.webp
    emoji: "🔊",
    categoria: "🔊 Áudio",
    nome: "Caixa de Som Bluetooth Portátil",
    de: "R$ 799,90",
    por: "R$ 449,90",
    desconto: "44% OFF",
    link: ""
  },
  {
    imagem: "smart-tv-55",          // smart-tv-55.webp
    emoji: "📺",
    categoria: "📺 Eletrônicos",
    nome: "Smart TV 55\" 4K UHD",
    de: "R$ 3.299,90",
    por: "R$ 1.899,90",
    desconto: "42% OFF",
    link: ""
  }
];

// ----- FEED DO CELULAR (6 produtos que passam na tela) -----
const OFERTAS_FEED_CELULAR = [
  { imagem: "robo-aspirador",  emoji: "🧹", nome: "Robô Aspirador",  de: "R$ 1.299,90", por: "R$ 699,90",   off: "-46%" },
  { imagem: "caixa-bluetooth", emoji: "🔊", nome: "Caixa Bluetooth", de: "R$ 799,90",   por: "R$ 449,90",   off: "-44%" },
  { imagem: "iphone-15",       emoji: "📱", nome: "iPhone 15 128GB", de: "R$ 5.699,90", por: "R$ 2.790,00", off: "-51%" },
  { imagem: "ps5",             emoji: "🎮", nome: "Console PS5",     de: "R$ 3.999,90", por: "R$ 2.399,90", off: "-40%" },
  { imagem: "air-fryer",       emoji: "🍟", nome: "Air Fryer 5L",    de: "R$ 599,90",   por: "R$ 269,90",   off: "-55%" },
  { imagem: "tenis-corrida",   emoji: "👟", nome: "Tênis Corrida",   de: "R$ 499,90",   por: "R$ 219,90",   off: "-56%" }
];

const MAX_CARDS_NO_FEED = 6;

// =========================================================
// 4. INTEGRAÇÃO COM ofertas.json DO APT BOT
// =========================================================
function formatarMoedaBR(valor) {
  const num = Number(valor);
  if (Number.isNaN(num)) return "R$ 0,00";
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function emojiPorTitulo(titulo) {
  const t = (titulo || "").toLowerCase();
  if (t.includes("iphone") || t.includes("celular") || t.includes("smartphone") || t.includes("galaxy")) return "📱";
  if (t.includes("fone") || t.includes("headset") || t.includes("earbuds")) return "🎧";
  if (t.includes("ventilador") || t.includes("liquidificador") || t.includes("air fryer") || t.includes("fritadeira") || t.includes("refil")) return "🏠";
  if (t.includes("tv") || t.includes("monitor")) return "📺";
  if (t.includes("ps5") || t.includes("console") || t.includes("xbox")) return "🎮";
  if (t.includes("tênis") || t.includes("tenis")) return "👟";
  return "🏷️";
}

function nomeCurtoFeed(titulo, limite = 20) {
  if (!titulo) return "Oferta";
  return titulo.length > limite ? titulo.slice(0, limite - 1).trim() + "…" : titulo;
}

async function obterOfertasDinamicas() {
  try {
    const resp = await fetch(`ofertas.json?t=${Date.now()}`, { cache: "no-store" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const data = await resp.json();
    if (!data || !Array.isArray(data.ofertas) || data.ofertas.length === 0) {
      throw new Error("Sem ofertas no JSON");
    }

    const reaisVitrine = data.ofertas.map(o => {
      const emoji = emojiPorTitulo(o.titulo);
      const off = Math.round(Number(o.desconto) || 0);
      const foto = (o.imagem && o.imagem.trim()) ? o.imagem.trim() : "";

      return {
        imagem: foto,
        emoji: emoji,
        categoria: `${emoji} ${o.loja || "Oferta"}`,
        nome: o.titulo,
        de: formatarMoedaBR(o.preco_original),
        por: formatarMoedaBR(o.preco_atual),
        desconto: `${off}% OFF`,
        link: o.link || ""
      };
    });

    const reaisFeed = data.ofertas.map(o => {
      const emoji = emojiPorTitulo(o.titulo);
      const off = Math.round(Number(o.desconto) || 0);
      const foto = (o.imagem && o.imagem.trim()) ? o.imagem.trim() : "";

      return {
        imagem: foto,
        emoji: emoji,
        nome: nomeCurtoFeed(o.titulo, 20),
        de: formatarMoedaBR(o.preco_original),
        por: formatarMoedaBR(o.preco_atual),
        off: `-${off}%`
      };
    });

    // Garante sempre 4 cards na vitrine sem esticar quando houver menos de 4 ofertas reais
    const vitrineFinal = reaisVitrine.slice(0, 4);
    for (const itemPadrao of OFERTAS_VITRINE) {
      if (vitrineFinal.length >= 4) break;
      vitrineFinal.push(itemPadrao);
    }

    // Garante 6 cards variados no feed do celular sem repetir um único item
    const feedFinal = reaisFeed.slice(0, MAX_CARDS_NO_FEED);
    for (const itemPadrao of OFERTAS_FEED_CELULAR) {
      if (feedFinal.length >= MAX_CARDS_NO_FEED) break;
      feedFinal.push(itemPadrao);
    }

    return { vitrine: vitrineFinal, feed: feedFinal };
  } catch (_) {
    return { vitrine: OFERTAS_VITRINE, feed: OFERTAS_FEED_CELULAR };
  }
}

// =========================================================
// 5. INICIALIZAÇÃO DA PÁGINA
// =========================================================
document.addEventListener("DOMContentLoaded", async () => {
  aplicarLinksNosBotoes();
  const { vitrine, feed } = await obterOfertasDinamicas();
  renderizarVitrine(vitrine);
  iniciarFeedCelular(feed);
});

function linkInvalido(link) {
  return !link || link.includes("SEU_LINK_AQUI") || link.includes("SEU_PERFIL_AQUI");
}

function aplicarLinksNosBotoes() {
  document.querySelectorAll("[data-channel]").forEach(btn => {
    const canal = btn.dataset.channel;
    const link = LINKS_GRUPOS[canal];

    if (!link) {
      btn.style.display = "none";
      return;
    }

    if (linkInvalido(link)) {
      console.warn(`[Achei Pra Ti] Cole o link real do ${canal} no topo do script.js`);
      btn.addEventListener("click", e => e.preventDefault());
      return;
    }

    btn.href = link;
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
  });
}

function renderizarVitrine(listaVitrine = OFERTAS_VITRINE) {
  const grid = document.getElementById("showcase-grid");
  if (!grid) return;

  grid.innerHTML = listaVitrine.map(item => {
    const conteudoCard = `
      <div class="product-img-box">
        <span class="discount-tag">${item.desconto}</span>
        <span class="category-tag">${item.categoria}</span>
        ${htmlImagem(item)}
      </div>
      <div class="product-name">${item.nome}</div>
      <div class="product-prices">
        <span class="price-from">${item.de}</span>
        <span class="price-to">${item.por}</span>
      </div>
    `;

    if (item.link) {
      return `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="product-card" style="text-decoration:none;color:inherit;">${conteudoCard}</a>`;
    }
    return `<div class="product-card">${conteudoCard}</div>`;
  }).join("");
}

function iniciarFeedCelular(listaFeed = OFERTAS_FEED_CELULAR) {
  const feedContainer = document.getElementById("live-feed");
  if (!feedContainer || !listaFeed.length) return;

  let indexAtual = 0;
  const semEspaco = valor => valor.replace("R$ ", "R$");

  function criarCardOferta(item) {
    const div = document.createElement("div");
    div.className = "feed-card";
    div.innerHTML = `
      <div class="feed-thumb">${htmlImagem(item)}</div>
      <div class="feed-details">
        <div class="feed-title">${item.nome}</div>
        <div class="feed-old-price">${semEspaco(item.de)}</div>
        <div class="feed-new-price">${semEspaco(item.por)}</div>
      </div>
      <span class="feed-discount">${item.off}</span>
    `;
    return div;
  }

  for (let i = 0; i < MAX_CARDS_NO_FEED; i++) {
    feedContainer.insertBefore(
      criarCardOferta(listaFeed[i % listaFeed.length]),
      feedContainer.firstChild
    );
    indexAtual = i + 1;
  }

  setInterval(() => {
    const proxima = listaFeed[indexAtual % listaFeed.length];
    indexAtual++;
    feedContainer.insertBefore(criarCardOferta(proxima), feedContainer.firstChild);

    while (feedContainer.children.length > MAX_CARDS_NO_FEED) {
      feedContainer.removeChild(feedContainer.lastChild);
    }
  }, 3500);
}
