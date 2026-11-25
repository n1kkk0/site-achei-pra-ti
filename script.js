// =========================================================
// 1. CONFIGURAÇÃO DOS LINKS
// =========================================================
const LINKS_GRUPOS = {
  whatsapp: "https://chat.whatsapp.com/CcPFw9XAjVmBN7MNZVZJIW?s=cl&p=i&iam=2",
  instagram: "https://www.instagram.com/acheipratibymakowski/"
};

// =========================================================
// 2. IMAGENS DOS PRODUTOS
// =========================================================
const PASTA_IMAGENS = "";
const EXTENSOES_IMAGENS = ["webp"];

function caminhoImagem(nome, extensao) {
  return `${PASTA_IMAGENS}${nome}.${extensao}`;
}

function htmlImagem(item) {
  return `<img src="${caminhoImagem(item.imagem, EXTENSOES_IMAGENS[0])}"
    alt="${item.nome}" loading="lazy"
    data-nome="${item.imagem}" data-emoji="${item.emoji}" data-tentativa="0"
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
const OFERTAS_VITRINE = [
  {
    imagem: "iphone-15",
    emoji: "📱",
    categoria: "📱 Celulares",
    nome: "Smartphone 128GB Lacrado",
    de: "R$ 5.699,90",
    por: "R$ 2.790,00",
    desconto: "51% OFF"
  },
  {
    imagem: "robo-aspirador",
    emoji: "🧹",
    categoria: "🏠 Casa",
    nome: "Robô Aspirador Inteligente",
    de: "R$ 1.299,90",
    por: "R$ 699,90",
    desconto: "46% OFF"
  },
  {
    imagem: "caixa-bluetooth",
    emoji: "🔊",
    categoria: "🔊 Áudio",
    nome: "Caixa de Som Bluetooth Portátil",
    de: "R$ 799,90",
    por: "R$ 449,90",
    desconto: "44% OFF"
  },
  {
    imagem: "smart-tv-55",
    emoji: "📺",
    categoria: "📺 Eletrônicos",
    nome: "Smart TV 55\" 4K UHD",
    de: "R$ 3.299,90",
    por: "R$ 1.899,90",
    desconto: "42% OFF"
  }
];

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
// 4. INICIALIZAÇÃO E CONTAGEM DE CLIQUES
// =========================================================
const NAMESPACE_CONTADOR = "acheiprati-nicolas-2026";
const CHAVE_CONTADOR_LOCAL = "acheiprati_cliques_canais_v1";

document.addEventListener("DOMContentLoaded", () => {
  aplicarLinksNosBotoes();
  renderizarVitrine();
  iniciarFeedCelular();
});

function linkInvalido(link) {
  return !link || link.includes("SEU_LINK_AQUI") || link.includes("SEU_PERFIL_AQUI");
}

function registrarCliqueCanal(canal) {
  // 1. Guarda contagem local no navegador para teste rápido
  try {
    const salvo = localStorage.getItem(CHAVE_CONTADOR_LOCAL);
    const contagens = salvo ? JSON.parse(salvo) : {};
    contagens[canal] = (contagens[canal] || 0) + 1;
    localStorage.setItem(CHAVE_CONTADOR_LOCAL, JSON.stringify(contagens));
  } catch {
    // Ignora caso o storage esteja bloqueado
  }

  // 2. Soma no contador global para todos os visitantes
  const url = `https://abacus.jasoncameron.dev/hit/${NAMESPACE_CONTADOR}/clique-${canal}`;
  fetch(url, { method: "GET", keepalive: true }).catch(() => {});
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

    btn.addEventListener("click", () => {
      registrarCliqueCanal(canal);
    });
  });
}

function renderizarVitrine() {
  const grid = document.getElementById("showcase-grid");
  if (!grid) return;

  grid.innerHTML = OFERTAS_VITRINE.map(item => `
    <div class="product-card">
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
    </div>
  `).join("");
}

function iniciarFeedCelular() {
  const feedContainer = document.getElementById("live-feed");
  if (!feedContainer) return;

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
      criarCardOferta(OFERTAS_FEED_CELULAR[i % OFERTAS_FEED_CELULAR.length]),
      feedContainer.firstChild
    );
    indexAtual = i + 1;
  }

  setInterval(() => {
    const proxima = OFERTAS_FEED_CELULAR[indexAtual % OFERTAS_FEED_CELULAR.length];
    indexAtual++;
    feedContainer.insertBefore(criarCardOferta(proxima), feedContainer.firstChild);

    while (feedContainer.children.length > MAX_CARDS_NO_FEED) {
      feedContainer.removeChild(feedContainer.lastChild);
    }
  }, 3500);
}
