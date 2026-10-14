/* ==========================================================================
   SCRIPT DO SITE GABRY22
   Você NÃO precisa editar este arquivo. Tudo se controla no config.js.
   Ele faz três coisas: mostra o aviso, a contagem regressiva e a agenda.
   ========================================================================== */
(function () {
  'use strict';

  if (typeof CONFIG === 'undefined') {
    console.warn('Gabry22: o arquivo config.js não foi carregado.');
    return;
  }

  var FUSO = '-03:00';                         // horário de Brasília
  var ZONA = 'America/Sao_Paulo';
  var DIA_MS = 24 * 60 * 60 * 1000;

  function $(id) { return document.getElementById(id); }
  function dois(n) { return String(n).padStart(2, '0'); }

  /* ---------- Utilidades ---------- */

  // Só aceita links http(s) ou links internos (#secao).
  function linkSeguro(url) {
    if (typeof url !== 'string' || !url.trim()) return null;
    url = url.trim();
    if (url.charAt(0) === '#') return url;
    try {
      var u = new URL(url);
      return (u.protocol === 'https:' || u.protocol === 'http:') ? u.href : null;
    } catch (e) {
      return null;
    }
  }

  // Coloca texto e link num <a>; esconde o <a> se faltar link ou texto.
  function ajustarLink(el, url, texto) {
    var seguro = linkSeguro(url);
    if (!seguro || !texto) { el.hidden = true; return; }
    el.href = seguro;
    el.textContent = texto;
    if (seguro.charAt(0) !== '#') {
      el.target = '_blank';
      el.rel = 'noopener';
    }
    el.hidden = false;
  }

  // Junta "2026-12-01" + "20:00" no horário de Brasília.
  function lerData(data, hora) {
    var t = new Date(data + 'T' + (hora || '00:00') + ':00' + FUSO);
    return isNaN(t.getTime()) ? null : t;
  }

  function dataCompleta(d) {
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'full', timeStyle: 'short', timeZone: ZONA
      }).format(d);
    } catch (e) {
      return d.toLocaleString('pt-BR');
    }
  }

  function diaCurto(d) {
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric', month: 'long', year: 'numeric', timeZone: ZONA
      }).format(d);
    } catch (e) {
      return d.toLocaleDateString('pt-BR');
    }
  }

  /* ---------- 1) Aviso no topo ---------- */
  function aviso() {
    var c = CONFIG.aviso;
    if (!c || !c.ativo || !c.texto) return;
    $('aviso-texto').textContent = c.texto;
    ajustarLink($('aviso-link'), c.link, c.textoDoLink);
    $('aviso').hidden = false;
  }

  /* ---------- 2) Contagem regressiva ---------- */

  // Escolhe o lançamento mais próximo (futuro). Se não houver, escolhe o
  // mais recente que ainda está dentro do prazo "mostrarPorDiasDepois".
  function escolher(lista, diasDepois) {
    var agora = Date.now();
    var futuros = [];
    var recentes = [];

    lista.forEach(function (item, i) {
      if (!item || !item.ativo) return;
      var alvo = lerData(item.data, item.hora);
      if (!alvo) {
        console.warn('Gabry22: data ou hora inválida no lançamento número ' + (i + 1) +
                     '. Use "AAAA-MM-DD" e "HH:MM".');
        return;
      }
      var par = { item: item, alvo: alvo };
      if (alvo.getTime() > agora) {
        futuros.push(par);
      } else if (agora - alvo.getTime() <= diasDepois * DIA_MS) {
        recentes.push(par);
      }
    });

    futuros.sort(function (a, b) { return a.alvo - b.alvo; });
    recentes.sort(function (a, b) { return b.alvo - a.alvo; });
    return futuros[0] || recentes[0] || null;
  }

  function contagem() {
    var secao = $('proximo');
    var c = CONFIG.lancamentos;
    var demo = /[?&]demo(=|&|$)/.test(location.search);
    var escolhido = null;

    if (demo) {
      escolhido = {
        item: {
          titulo: 'Título do seu próximo lançamento',
          descricao: 'Isto é só uma demonstração. Para ativar de verdade, edite o config.js.',
          link: '#sobre',
          textoDoLink: 'Botão de exemplo',
          mensagemQuandoSair: 'Já está no ar!'
        },
        alvo: new Date(Date.now() + (5 * 24 + 3) * 3600 * 1000 + 42 * 1000)
      };
    } else if (c && c.ativo && Array.isArray(c.lista)) {
      var dias = (typeof c.mostrarPorDiasDepois === 'number') ? c.mostrarPorDiasDepois : 7;
      escolhido = escolher(c.lista, dias);
    }

    if (!escolhido) { secao.hidden = true; return; }

    var item = escolhido.item;
    var alvo = escolhido.alvo;
    var timer = null;

    $('cd-titulo').textContent = item.titulo || 'Novo lançamento';
    $('cd-descricao').textContent = item.descricao || '';
    $('cd-descricao').hidden = !item.descricao;
    ajustarLink($('cd-link'), item.link, item.textoDoLink || 'Ouvir');
    $('cd-data').textContent = dataCompleta(alvo);
    $('cd-rotulo').textContent = demo ? 'Demonstração' : 'Próximo lançamento';
    secao.hidden = false;

    function lancado() {
      $('cd-rotulo').textContent = 'Já está no ar';
      $('cd-relogio').hidden = true;
      $('cd-data').textContent = item.mensagemQuandoSair || 'Já está no ar!';
    }

    // Devolve false quando o tempo acabou.
    function atualizar() {
      var resto = alvo.getTime() - Date.now();
      if (resto <= 0) { lancado(); return false; }

      var s = Math.floor(resto / 1000);
      var d = Math.floor(s / 86400); s -= d * 86400;
      var h = Math.floor(s / 3600);  s -= h * 3600;
      var m = Math.floor(s / 60);    s -= m * 60;

      $('cd-dias').textContent = dois(d);
      $('cd-horas').textContent = dois(h);
      $('cd-min').textContent = dois(m);
      $('cd-seg').textContent = dois(s);
      $('cd-l-dias').textContent = d === 1 ? 'dia' : 'dias';
      $('cd-l-horas').textContent = h === 1 ? 'hora' : 'horas';
      return true;
    }

    if (atualizar()) {
      timer = setInterval(function () {
        if (!atualizar()) clearInterval(timer);
      }, 1000);
    }
  }

  /* ---------- 3) Agenda de shows ---------- */
  function agenda() {
    var c = CONFIG.agenda;
    if (!c || !c.ativo || !Array.isArray(c.lista)) return;

    var agora = Date.now();
    var proximos = [];

    c.lista.forEach(function (show, i) {
      if (!show) return;
      // Sem hora, o show vale até o fim do dia.
      var alvo = lerData(show.data, show.hora || '23:59');
      if (!alvo) {
        console.warn('Gabry22: data ou hora inválida no show número ' + (i + 1) + '.');
        return;
      }
      if (alvo.getTime() >= agora) proximos.push({ show: show, alvo: alvo });
    });

    if (!proximos.length) return;
    proximos.sort(function (a, b) { return a.alvo - b.alvo; });

    var ul = $('agenda-lista');
    ul.textContent = '';

    proximos.forEach(function (p) {
      var li = document.createElement('li');
      li.className = 'show';

      var quando = document.createElement('time');
      quando.className = 'show__quando';
      quando.dateTime = p.show.data;
      quando.textContent = diaCurto(p.alvo) + (p.show.hora ? ', ' + p.show.hora : '');

      var onde = document.createElement('div');
      onde.className = 'show__onde';
      var local = document.createElement('strong');
      local.textContent = p.show.local || 'Local a confirmar';
      onde.appendChild(local);
      if (p.show.cidade) {
        var cidade = document.createElement('span');
        cidade.textContent = p.show.cidade;
        onde.appendChild(cidade);
      }

      li.appendChild(quando);
      li.appendChild(onde);

      var a = document.createElement('a');
      a.className = 'botao';
      ajustarLink(a, p.show.link, p.show.textoDoLink || 'Mais informações');
      if (!a.hidden) li.appendChild(a);

      ul.appendChild(li);
    });

    $('agenda').hidden = false;
    $('nav-agenda').hidden = false;
  }

  /* ---------- Liga tudo ---------- */
  aviso();
  contagem();
  agenda();
})();
