/* ==========================================================
   TEMPLATE BARBEARIA — script.js
   >>> EDITE SOMENTE O OBJETO CONFIG_BARBEARIA ABAIXO <<<
   ========================================================== */
const CONFIG_BARBEARIA = {
  nome: "[NOME DA BARBEARIA]",

  // Apenas números, com 55 + DDD + número. Ex: 5519999999999
  whatsapp: "5519999999999",

  // Mensagem pronta enviada ao clicar nos botões
  mensagemWhatsApp: "Olá! Vim pelo site e gostaria de agendar um horário.",

  // Opcional: link do AppBarber, Booksy, Trinks etc.
  // Se ficar vazio (""), todos os botões "Agendar" abrem o WhatsApp.
  linkAgendamento: "",

  endereco: "Rua Exemplo, 123 - Bairro",
  cidade: "[CIDADE - SP]",

  instagram: "https://instagram.com/seu_perfil",

  // Cole o link do Google Maps. Se vazio, o script cria um a partir do endereço.
  googleMaps: "",

  // Um item por linha: { dia, horas }
  horarios: [
    { dia: "Segunda a Sexta", horas: "09:00 às 20:00" },
    { dia: "Sábado",          horas: "08:00 às 18:00" },
    { dia: "Domingo",         horas: "Fechado" }
  ]
};

/* ==========================================================
   DAQUI PARA BAIXO NÃO PRECISA MEXER
   ========================================================== */
(function () {
  const C = CONFIG_BARBEARIA;
  const $$ = (sel) => document.querySelectorAll(sel);

  // ---- Links derivados ----
  const enderecoCompleto = `${C.endereco}, ${C.cidade}`;
  const urlWhatsApp = `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(C.mensagemWhatsApp)}`;
  const urlAgendar = C.linkAgendamento.trim() || urlWhatsApp;
  const urlMaps = C.googleMaps.trim() ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto)}`;
  const urlWaze = `https://waze.com/ul?q=${encodeURIComponent(enderecoCompleto)}&navigate=yes`;
  const links = { maps: urlMaps, waze: urlWaze, instagram: C.instagram };

  // ---- Textos: <elemento data-cfg="nome|cidade|endereco"> ----
  $$("[data-cfg]").forEach((el) => {
    const valor = C[el.dataset.cfg];
    if (valor) el.textContent = valor;
  });

  // ---- Botões de agendamento: <a data-agendar> ----
  $$("[data-agendar]").forEach((el) => {
    el.href = urlAgendar;
    el.target = "_blank";
    el.rel = "noopener";
  });

  // ---- Botões WhatsApp: <a data-wa> ----
  $$("[data-wa]").forEach((el) => (el.href = urlWhatsApp));

  // ---- Links externos: <a data-link="maps|waze|instagram"> ----
  $$("[data-link]").forEach((el) => {
    const url = links[el.dataset.link];
    if (url) el.href = url; else el.hidden = true;
  });

  // ---- Horários ----
  const lista = document.getElementById("horarios");
  if (lista) {
    lista.innerHTML = C.horarios
      .map((h) => `<li><span>${h.dia}</span><span>${h.horas}</span></li>`)
      .join("");
  }

  // ---- Título da aba e ano do rodapé ----
  document.title = `${C.nome} | Barbearia em ${C.cidade}`;
  const ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  // ---- Navbar: fundo ao rolar ----
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ---- Menu hambúrguer ----
  const toggle = document.getElementById("toggle");
  const menu = document.getElementById("menu");
  const setMenu = (aberto) => {
    menu.classList.toggle("is-open", aberto);
    nav.classList.toggle("menu-open", aberto);
    toggle.setAttribute("aria-expanded", aberto);
    toggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  // ---- Imagem quebrada? Esconde ícone quebrado ----
  $$("img").forEach((img) => {
    img.addEventListener("error", () => { img.style.visibility = "hidden"; });
  });

  // ---- Animações fluidas (Hero + Reveal suave por seção) ----
  const prefereMenosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = document.querySelector(".hero");
  if (hero) {
    requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add("is-ready")));
  }

  if (!prefereMenosMovimento) {
    document.documentElement.classList.add("js-anim");

    const todosAlvos = [];
    $$("main .section").forEach((secao) => {
      const itens = secao.querySelectorAll(".section__title, .section__lead, .menu-item, .gallery figure, .feature, .location__box");
      itens.forEach((el, idx) => {
        el.setAttribute("data-anim", "");
        const atraso = Math.min(idx * 55, 280);
        el.style.setProperty("--anim-delay", `${atraso}ms`);
        todosAlvos.push(el);
      });
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
      );

      todosAlvos.forEach((el) => observer.observe(el));
    } else {
      todosAlvos.forEach((el) => el.classList.add("is-visible"));
    }
  }
})();