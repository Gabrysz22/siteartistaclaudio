/* ==========================================================================
   CENTRAL DE CONTROLE DO SITE GABRY22
   --------------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa mexer no dia a dia.

   REGRAS RÁPIDAS
   - ativo: true   -> aparece no site
   - ativo: false  -> fica escondido (você pode deixar tudo guardado aqui)
   - Textos ficam entre aspas "assim".
   - Toda linha termina com vírgula, menos a última de cada bloco.
   - Data no formato  "AAAA-MM-DD"  (ano-mês-dia). Ex.: "2026-12-01"
   - Hora no formato  "HH:MM" de 24 horas. Ex.: "00:00" ou "18:30"
   - Horário de Brasília (o site já faz a conta, você não precisa pensar nisso).

   PARA VER COMO A CONTAGEM FICA: abra o site com  ?demo  no final do
   endereço (exemplo: index.html?demo). Aparece uma contagem de exemplo.
   ========================================================================== */

const CONFIG = {

  /* ========================================================================
     1) AVISO NO TOPO (a faixa roxa em cima do site)
     Use para novidades: "Música nova no ar", "Show dia 5", etc.
     ======================================================================== */
  aviso: {
    ativo: false,
    texto: "Planta Freestyle já está no ar em todas as plataformas.",
    link: "https://open.spotify.com/intl-pt/track/23Tv11xMO4qQljOcAJEzzC",
    textoDoLink: "Ouvir agora"          // deixe "" se não quiser botão
  },


  /* ========================================================================
     2) CONTAGEM REGRESSIVA DE LANÇAMENTOS
     - "ativo" aqui embaixo liga/desliga a seção inteira.
     - Dentro da lista você pode guardar vários lançamentos. O site mostra
       sempre o MAIS PRÓXIMO que estiver com ativo: true.
     - Quando a hora chega, o contador vira a mensagem "Já está no ar!" e
       continua aparecendo por alguns dias (veja mostrarPorDiasDepois).

     PARA ANUNCIAR UMA MÚSICA NOVA:
       1. Troque o titulo, a data e a hora do bloco abaixo.
       2. Cole o link de pré-save (ou da música) em "link".
       3. Mude  ativo: false  para  ativo: true.
     PARA ESCONDER: volte para  ativo: false.
     PARA ADICIONAR MAIS UM: copie um bloco { ... }, cole depois dele e
     coloque uma vírgula entre os blocos.
     ======================================================================== */
  lancamentos: {
    ativo: true,
    mostrarPorDiasDepois: 7,            // quantos dias a mensagem "no ar" fica visível

    lista: [
      {
        ativo: false,                   // <- troque para true quando tiver data
        titulo: "Nome da próxima música",
        descricao: "Novo single do Gabry22.",
        data: "2026-12-01",
        hora: "00:00",
        link: "",                       // pré-save ou link da música
        textoDoLink: "Salvar no Spotify",
        mensagemQuandoSair: "Já está no ar! Corre pra ouvir."
      }
    ]
  },


  /* ========================================================================
     3) AGENDA DE SHOWS
     Só aparece se "ativo" for true E houver show futuro na lista.
     Shows que já passaram somem sozinhos, você não precisa apagar.
     ======================================================================== */
  agenda: {
    ativo: false,

    lista: [
      {
        data: "2026-12-05",
        hora: "22:00",                  // pode deixar "" se não souber
        local: "Nome do local",
        cidade: "Rio de Janeiro, RJ",
        link: "",                       // ingressos ou mais informações
        textoDoLink: "Mais informações"
      }
    ]
  }
};
