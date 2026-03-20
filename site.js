const btn = document.getElementById("abrir");
const intro = document.getElementById("intro");
const conteudo = document.getElementById("conteudo");

const musica = document.getElementById("musica");
const play = document.getElementById("play");
const vinil = document.querySelector(".vinil");
const barra = document.getElementById("barra");
const tempoAtual = document.getElementById("tempoAtual");
const tempoTotal = document.getElementById("tempoTotal");

// Ativa animação mas inicia pausada
vinil.classList.add("girando");
vinil.style.animationPlayState = "paused";

// Ao clicar no envelope, troca de tela e já começa a tocar a música
btn.addEventListener("click", () => {
    intro.classList.add("sair");
    conteudo.classList.add("entrar");

    if (musica.paused) {
        musica.currentTime = 0;
        musica.play().then(() => {
            play.innerText = "⏸";
            vinil.style.animationPlayState = "running";
        }).catch(() => {
            // se o navegador bloquear o autoplay, não quebra nada
        });
    }
});

play.addEventListener("click", () => {
    if (musica.paused) {
        musica.play();
        play.innerText = "⏸";
        vinil.style.animationPlayState = "running";
    } else {
        musica.pause();
        play.innerText = "▶";
        vinil.style.animationPlayState = "paused";
    }
});

// Atualiza progresso
musica.addEventListener("timeupdate", () => {
    const progresso = (musica.currentTime / musica.duration) * 100;
    barra.style.width = progresso + "%";

    tempoAtual.innerText = formatarTempo(musica.currentTime);
});

// Tempo total
musica.addEventListener("loadedmetadata", () => {
    tempoTotal.innerText = formatarTempo(musica.duration);
});

// Voltar 10s
document.getElementById("prev").addEventListener("click", () => {
    musica.currentTime = Math.max(0, musica.currentTime - 10);
});

// Avançar 10s
document.getElementById("next").addEventListener("click", () => {
    musica.currentTime = Math.min(musica.duration, musica.currentTime + 10);
});

function formatarTempo(segundos) {
    const min = Math.floor(segundos / 60);
    const sec = Math.floor(segundos % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

// ===== CAIXINHA SECRETA (código) =====
(() => {
    const box = document.getElementById("caixinhaSecreta");
    if (!box) return;

    const input = document.getElementById("codigoSecreto");
    const btn = document.getElementById("btnAbrirCaixinha");
    const msg = document.getElementById("caixinhaMsg");
    const conteudo = document.getElementById("caixinhaConteudo");

    if (!input || !btn || !msg || !conteudo) return;

    const CODIGO_CORRETO = (box.dataset.codigo || "").trim();

    const setMsg = (texto, tipo) => {
        msg.textContent = texto;
        msg.classList.remove("erro", "ok");
        if (tipo) msg.classList.add(tipo);
    };

    const abrir = () => {
        conteudo.hidden = false;
        btn.disabled = true;
        input.disabled = true;
        input.value = "";
        setMsg("Abriu. 💖", "ok");
    };

    const tentarAbrir = () => {
        const tentativa = String(input.value || "").trim();

        if (!CODIGO_CORRETO) {
            setMsg("Nenhum código foi configurado ainda.", "erro");
            return;
        }

        if (tentativa === CODIGO_CORRETO) {
            abrir();
            return;
        }

        setMsg("Código incorreto. Tenta de novo.", "erro");
        box.classList.remove("tremer");
        // força reflow pra reiniciar a animação
        void box.offsetWidth;
        box.classList.add("tremer");
        input.select();
    };

    btn.addEventListener("click", tentarAbrir);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") tentarAbrir();
    });
})();

// ===== CONTADOR: TEMPO JUNTOS =====
(() => {
    const bloco = document.getElementById("tempoJuntos");
    const diasEl = document.getElementById("tempoDias");
    const horasEl = document.getElementById("tempoHoras");
    const minutosEl = document.getElementById("tempoMinutos");
    if (!bloco || !diasEl || !horasEl || !minutosEl) return;

    const attr = (bloco.dataset.inicio || "").trim();
    let inicio;

    if (attr) {
        // espera "YYYY-MM-DD"
        const partes = attr.split("-");
        if (partes.length === 3) {
            const [ano, mes, dia] = partes.map(Number);
            inicio = new Date(ano, mes - 1, dia);
        }
    }

    if (!inicio || isNaN(inicio.getTime())) {
        // se der algo errado, começa a contar de hoje para não quebrar
        inicio = new Date();
    }

    const atualizar = () => {
        const agora = new Date();
        let diffMs = agora - inicio;
        if (diffMs < 0) diffMs = 0;

        const totalSeg = Math.floor(diffMs / 1000);
        const dias = Math.floor(totalSeg / (60 * 60 * 24));
        const horas = Math.floor((totalSeg % (60 * 60 * 24)) / (60 * 60));
        const minutos = Math.floor((totalSeg % (60 * 60)) / 60);

        diasEl.textContent = dias;
        horasEl.textContent = horas;
        minutosEl.textContent = minutos;
    };

    atualizar();
    // atualiza a cada minuto (não precisa de segundos)
    setInterval(atualizar, 60 * 1000);
})();

// ===== MOTIVOS: CARDS QUE VIRAM =====
(() => {
    const cards = document.querySelectorAll(".motivos-card");
    if (!cards.length) return;

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            const jaVirado = card.classList.contains("virado");
            // fecha todos
            cards.forEach((c) => c.classList.remove("virado"));
            // se o clicado não estava aberto, abre ele
            if (!jaVirado) {
                card.classList.add("virado");
            }
        });
    });
})();

// ===== ANIMAÇÃO AO ROLAR (timeline + tempo juntos + motivos + caixinha) =====
(() => {
    const elementos = document.querySelectorAll(".timeline-item, .tempo-juntos, .motivos-amor, .caixinha-secreta");
    if (!elementos.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visivel");
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    elementos.forEach((el) => observer.observe(el));
})();