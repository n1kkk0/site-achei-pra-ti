// =========================================================
// 1. CONFIGURAÇÃO DOS LINKS
// =========================================================
const LINKS_GRUPOS = {
  whatsapp: "https://chat.whatsapp.com/CcPFw9XAjVmBN7MNZVZJIW?s=cl&p=i&iam=2",
  instagram: "https://www.instagram.com/acheipratibymakowski/"
};

// =========================================================
// 2. IMAGENS E FALLBACK PARA EMOJI
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

  // Foto real capturada do anúncio da loja (http/https)
  if (item.imagem.startsWith("http://") || item.imagem.startsWith("https://")) {
    return `<img src="${item.imagem}"
      alt="${item.nome}" loading="lazy"
      data-emoji="${item.emoji || "🏷️"}"
      onerror="this.replaceWith(document.createTextNode(this.dataset.emoji))">`;
  }

  // Fotos locais .webp (usadas apenas nos cards padrão de fallback)
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
// 3. DADOS PADRÃO (FALLBACK CASO O JSON NÃO CARREGUE)
// =========================================================
const OFERTAS_VITRINE_PADRAO = [
  {
    imagem: "iphone-15",
    emoji: "📱",
    categoria: "📱 Celulares",
    nome: "Smartphone 128GB Lacrado",
    de: "R$ 5.699,90",
    por: "R$ 2.790,00",
    desconto: "51% OFF",
    link: LINKS_GRUPOS.whatsapp
  },
  {
    imagem: "robo-aspirador",
    emoji: "🧹",
    categoria: "🏠 Casa",
    nome: "Robô Aspirador Inteligente",
    de: "R$ 1.299,90",
    por: "R$ 699,90",
    desconto: "46% OFF",
    link: LINKS_GRUPOS.whatsapp
  },
  {
    imagem: "caixa-bluetooth",
    emoji: "🔊",
    categoria: "🔊 Áudio",
    nome: "Caixa de Som Bluetooth Portátil",
    de: "R$ 799,90",
    por: "R$ 449,90",
    desconto: "44% OFF",
    link: LINKS_GRUPOS.whatsapp
  },
  {
    imagem: "smart-tv-55",
    emoji: "📺",
    categoria: "📺 Eletrônicos",
    nome: "Smart TV 55\" 4K UHD",
    de: "R$ 3.299,90",
    por: "R$ 1.899,90",
    desconto: "42% OFF",
    link: LINKS_GRUPOS.whatsapp
  }
];

const OFERTAS_FEED_PADRAO = [
  { imagem: "robo-aspirador",  emoji: "🧹", nome: "Robô Aspirador",  de: "R$ 1.299,90", por: "R$ 699,90",   off: "-46%" },
  { imagem: "caixa-bluetooth", emoji: "🔊", nome: "Caixa Bluetooth", de: "R$ 799,90",   por: "R$ 449,90",   off: "-44%" },
  { imagem: "iphone-15",       emoji: "📱", nome: "iPhone 15 128GB", de: "R$ 5.699,90", por: "R$ 2.790,00", off: "-51%" },
  { imagem: "ps5",             emoji: "🎮", nome: "Console PS5",     de: "R$ 3.999,90", por: "R$ 2.399,90", off: "-40%" },
  { imagem: "air-fryer",       emoji: "🍟", nome: "Air Fryer 5L",    de: "R$ 599,90",   por: "R$ 269,90",   off: "-55%" },
  { imagem: "tenis-corrida",   emoji: "👟", nome: "Tênis Corrida",   de: "R$ 499,90",   por: "R$ 219,90",   off: "-56%" }
];

const MAX_CARDS_NO_FEED = 6;

// =========================================================
// 4. CONVERSÃO DO ofertas.json (GERADO PELO APT BOT)
// =========================================================
function formatarReais(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function detectarEmojiCategoria(titulo) {
  const t = (titulo || "").toLowerCase();
  if (t.includes("iphone") || t.includes("smartphone") || t.includes("celular") || t.includes("galaxy")) return "📱";
  if (t.includes("fone") || t.includes("headset") || t.includes("earbuds")) return "🎧";
  if (t.includes("caixa") || t.includes("bluetooth") || t.includes("soundbar")) return "🔊";
  if (t.includes("mouse") || t.includes("teclado") || t.includes("notebook") || t.includes("cabo") || t.includes("organizador")) return "💻";
  if (t.includes("aspirador") || t.includes("robô")) return "🧹";
  if (t.includes("tv") || t.includes("monitor")) return "📺";
  if (t.includes("ps5") || t.includes("playstation") || t.includes("console") || t.includes("xbox")) return "🎮";
  if (t.includes("air fryer") || t.includes("fritadeira") || t.includes("garrafa") || t.includes("cafeteira")) return "🍳";
  if (t.includes("tênis") || t.includes("tenis") || t.includes("nike") || t.includes("adidas")) return "👟";
  return "🏷️";
}

function encurtarTitulo(titulo, max = 22) {
  if (!titulo) return "Oferta Relâmpago";
  return titulo.length > max ? titulo.slice(0, max - 1).trim() + "…" : titulo;
}

async function carregarOfertasDoBot() {
  try {
    const resp = await fetch(`ofertas.json?v=${Date.now()}`, { cache: "no-store" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const dados = await resp.json();
    if (!dados || !Array.isArray(dados.ofertas) || dados.ofertas.length === 0) {
      throw new Error("Lista de ofertas vazia no JSON");
    }

    const vitrine = dados.ofertas.map(o => {
      const emoji = detectarEmojiCategoria(o.titulo);
      const offInt = Math.round(Number(o.desconto) || 0);
      const imgReal = (o.imagem && o.imagem.trim()) ? o.imagem.trim() : "";

      return {
        imagem: imgReal,
        emoji: emoji,
        categoria: `${emoji} ${o.loja || "Oferta"}`,
        nome: o.titulo,
        de: formatarReais(o.preco_original),
        por: formatarReais(o.preco_atual),
        desconto: `${offInt}% OFF`,
        link: o.link || LINKS_GRUPOS.whatsapp
      };
    });

    const feed = dados.ofertas.map(o => {
      const emoji = detectarEmojiCategoria(o.titulo);
      const offInt = Math.round(Number(o.desconto) || 0);
      const imgReal = (o.imagem && o.imagem.trim()) ? o.imagem.trim() : "";

      return {
        imagem: imgReal,
        emoji: emoji,
        nome: encurtarTitulo(o.titulo, 20),
        de: formatarReais(o.preco_original),
        por: formatarReais(o.preco_atual),
        off: `-${offInt}%`
      };
    });

    return { vitrine, feed };
  } catch (err) {
    console.info("[Achei Pra Ti] Usando ofertas padrão da vitrine:", err.message);
    return {
      vitrine: OFERTAS_VITRINE_PADRAO,
      feed: OFERTAS_FEED_PADRAO
    };
  }
}

// =========================================================
// 5. INICIALIZAÇÃO DA PÁGINA
// =========================================================
document.addEventListener("DOMContentLoaded", async () => {
  aplicarLinksNosBotoes();
  const { vitrine, feed } = await carregarOfertasDoBot();
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

function renderizarVitrine(listaVitrine) {
  const grid = document.getElementById("showcase-grid");
  if (!grid) return;

  grid.innerHTML = listaVitrine.map(item => `
    <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="product-card" style="text-decoration: none; color: inherit;">
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
    </a>
  `).join("");
}

function iniciarFeedCelular(listaFeed) {
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
