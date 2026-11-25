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
// Pasta das fotos. "" = mesma pasta do index.html (como está agora).
// Se um dia criar uma pasta, escreva o nome com barra no final: "imagens/"
const PASTA_IMAGENS = "";

// Formato das fotos. Se um dia precisar de outro, acrescente na lista
// (ex.: ["webp", "jpg"]) que o código tenta cada um em ordem.
const EXTENSOES_IMAGENS = ["webp"];

function caminhoImagem(nome, extensao) {
  return `${PASTA_IMAGENS}${nome}.${extensao}`;
}

// Monta a <img> com a primeira extensão da lista
function htmlImagem(item) {
  return `<img src="${caminhoImagem(item.imagem, EXTENSOES_IMAGENS[0])}"
    alt="${item.nome}" loading="lazy"
    data-nome="${item.imagem}" data-emoji="${item.emoji}" data-tentativa="0"
    onerror="imagemFalhou(this)">`;
}

// Se a imagem não carregar, tenta a próxima extensão;
// se nenhuma existir, mostra o emoji no lugar.
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
    desconto: "51% OFF"
  },
  {
    imagem: "robo-aspirador",       // robo-aspirador.webp
    emoji: "🧹",
    categoria: "🏠 Casa",
    nome: "Robô Aspirador Inteligente",
    de: "R$ 1.299,90",
    por: "R$ 699,90",
    desconto: "46% OFF"
  },
  {
    imagem: "caixa-bluetooth",      // caixa-bluetooth.webp
    emoji: "🔊",
    categoria: "🔊 Áudio",
    nome: "Caixa de Som Bluetooth Portátil",
    de: "R$ 799,90",
    por: "R$ 449,90",
    desconto: "44% OFF"
  },
  {
    imagem: "smart-tv-55",          // smart-tv-55.webp
    emoji: "📺",
    categoria: "📺 Eletrônicos",
    nome: "Smart TV 55\" 4K UHD",
    de: "R$ 3.299,90",
    por: "R$ 1.899,90",
    desconto: "42% OFF"
  }
];

// ----- FEED DO CELULAR (6 produtos que passam na tela) -----
// Nomes curtos para caberem em uma linha dentro do celular
const OFERTAS_FEED_CELULAR = [
  { imagem: "robo-aspirador",  emoji: "🧹", nome: "Robô Aspirador",  de: "R$ 1.299,90", por: "R$ 699,90",   off: "-46%" },
  { imagem: "caixa-bluetooth", emoji: "🔊", nome: "Caixa Bluetooth", de: "R$ 799,90",   por: "R$ 449,90",   off: "-44%" },
  { imagem: "iphone-15",       emoji: "📱", nome: "iPhone 15 128GB", de: "R$ 5.699,90", por: "R$ 2.790,00", off: "-51%" },
  { imagem: "ps5",             emoji: "🎮", nome: "Console PS5",     de: "R$ 3.999,90", por: "R$ 2.399,90", off: "-40%" },
  { imagem: "air-fryer",       emoji: "🍟", nome: "Air Fryer 5L",    de: "R$ 599,90",   por: "R$ 269,90",   off: "-55%" },
  { imagem: "tenis-corrida",   emoji: "👟", nome: "Tênis Corrida",   de: "R$ 499,90",   por: "R$ 219,90",   off: "-56%" }
];

// Quantos cards aparecem ao mesmo tempo dentro do celular
const MAX_CARDS_NO_FEED = 6;  // o último aparece cortado, como num feed rolando

// =========================================================
// 4. INICIALIZAÇÃO DA PÁGINA
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  aplicarLinksNosBotoes();
  renderizarVitrine();
  iniciarFeedCelular();
});

// O link ainda é o texto de exemplo (ou está vazio)?
function linkInvalido(link) {
  return !link || link.includes("SEU_LINK_AQUI") || link.includes("SEU_PERFIL_AQUI");
}

function aplicarLinksNosBotoes() {
  document.querySelectorAll("[data-channel]").forEach(btn => {
    const canal = btn.dataset.channel;          // "whatsapp" ou "instagram"
    const link = LINKS_GRUPOS[canal];

    // Canal deixado vazio de propósito: esconde o botão
    if (!link) {
      btn.style.display = "none";
      return;
    }

    // Link de exemplo ainda não trocado: avisa no console e não abre nada
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

  // Tira o espaço depois de "R$" para o preço caber em uma linha
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

  // Cards iniciais (o mais novo fica no topo, então o próximo nunca repete)
  for (let i = 0; i < MAX_CARDS_NO_FEED; i++) {
    feedContainer.insertBefore(
      criarCardOferta(OFERTAS_FEED_CELULAR[i % OFERTAS_FEED_CELULAR.length]),
      feedContainer.firstChild
    );
    indexAtual = i + 1;
  }

  // Novo card a cada 3,5 segundos
  setInterval(() => {
    const proxima = OFERTAS_FEED_CELULAR[indexAtual % OFERTAS_FEED_CELULAR.length];
    indexAtual++;
    feedContainer.insertBefore(criarCardOferta(proxima), feedContainer.firstChild);

    while (feedContainer.children.length > MAX_CARDS_NO_FEED) {
      feedContainer.removeChild(feedContainer.lastChild);
    }
  }, 3500);
}
