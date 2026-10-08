

// PARTE 1 – MANIPULAÇÃO E VALIDAÇÃO DE DADOS


const pedidos = [
    {
        cliente: "Bia",
        valor: 120,
        status: "pago"
    },
    {
        cliente: "Carlos",
        valor: 80,
        status: "pendente"
    },
    {
        cliente: "",
        valor: 50,
        status: "pago"
    },
    {
        cliente: "Ana",
        valor: 200,
        status: "pago"
    },
    {
        cliente: "João",
        valor: -30,
        status: "pago"
    }
];


// Validar pedidos
const pedidosValidos = pedidos.filter((pedido) => {

    const clienteValido =
        typeof pedido.cliente === "string" &&
        pedido.cliente.trim() !== "";

    const valorValido =
        typeof pedido.valor === "number" &&
        pedido.valor > 0;

    return clienteValido && valorValido;
});

console.log("Pedidos válidos:", pedidosValidos);


// Filtrar somente pedidos pagos
const pedidosPagos = pedidosValidos.filter((pedido) => {
    return pedido.status === "pago";
});

console.log("Pedidos pagos:", pedidosPagos);


// Calcular total faturado
const totalFaturado = pedidosPagos.reduce((total, pedido) => {
    return total + pedido.valor;
}, 0);

console.log(
    "Total faturado: R$",
    totalFaturado.toFixed(2)
);


// Gerar textos no formato "Bia — R$ 120.00"
const textosPedidos = pedidosPagos.map((pedido) => {
    return `${pedido.cliente} — R$ ${pedido.valor.toFixed(2)}`;
});

console.log("Pedidos formatados:");

textosPedidos.forEach((texto) => {
    console.log(texto);
});


// PARTE 2 – MINI PROJETO: BUSCADOR DE CEP


const formCep = document.querySelector("#formCep");
const campoCep = document.querySelector("#cep");
const botaoCep = document.querySelector("#botaoCep");
const statusCep = document.querySelector("#statusCep");
const resultadoCep = document.querySelector("#resultadoCep");
const historicoCep = document.querySelector("#historicoCep");


// Histórico dos CEPs pesquisados
const historico = [];


// Função para limpar o resultado do CEP


function limparResultadoCep() {
    resultadoCep.replaceChildren();
}


// Função para exibir o resultado do CEP


function exibirResultadoCep(dados) {

    limparResultadoCep();

    const informacoes = [
        {
            titulo: "Rua",
            valor: dados.logradouro
        },
        {
            titulo: "Bairro",
            valor: dados.bairro
        },
        {
            titulo: "Cidade",
            valor: dados.localidade
        },
        {
            titulo: "UF",
            valor: dados.uf
        }
    ];


    informacoes.forEach((informacao) => {

        const dt = document.createElement("dt");
        const dd = document.createElement("dd");

        dt.textContent = informacao.titulo;
        dd.textContent = informacao.valor || "Não informado";

        resultadoCep.append(dt, dd);
    });
}


// Função para atualizar histórico


function atualizarHistorico() {

    historicoCep.replaceChildren();

    historico.forEach((item) => {

        const li = document.createElement("li");

        li.textContent =
            `${item.cep} — ${item.cidade}/${item.uf}`;

        historicoCep.append(li);
    });
}


// Evento do formulário de CEP


formCep.addEventListener("submit", async (e) => {

    e.preventDefault();


    // Limpar espaços e caracteres que não sejam dígitos
    const cep = campoCep.value.trim().replace(/\D/g, "");


    // Validação: exatamente 8 dígitos
    if (!/^\d{8}$/.test(cep)) {

        statusCep.textContent =
            "Digite um CEP válido com 8 dígitos.";

        limparResultadoCep();

        return;
    }


    // Estado: CARREGANDO

    botaoCep.disabled = true;

    statusCep.textContent = "Buscando...";

    limparResultadoCep();


    try {

        const response = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`,
            {
                signal: AbortSignal.timeout(5000)
            }
        );


        // O fetch não rejeita automaticamente
        // quando ocorre um erro HTTP.
        if (!response.ok) {
            throw new Error("Falha na conexão.");
        }


        const dados = await response.json();


        // Estado: VAZIO / NÃO ENCONTRADO

        if (dados.erro) {

            statusCep.textContent =
                "CEP não encontrado.";

            return;
        }


        // Estado: SUCESSO

        exibirResultadoCep(dados);

        statusCep.textContent = "";


        // Adicionar ao histórico
        historico.push({
            cep: cep,
            cidade: dados.localidade,
            uf: dados.uf
        });


        atualizarHistorico();


    } catch (erro) {

        // Estado: ERRO

        if (erro.name === "TimeoutError") {

            statusCep.textContent =
                "A busca demorou muito. Tente novamente.";

        } else {

            statusCep.textContent =
                "Falha na conexão. Tente novamente.";
        }

        limparResultadoCep();


    } finally {

        // Reativar botão independentemente do resultado
        botaoCep.disabled = false;
    }
});


// PARTE 3 – MINI POKÉDEX


const formPokemon = document.querySelector("#formPokemon");
const campoPokemon = document.querySelector("#pokemon");
const botaoPokemon = document.querySelector("#botaoPokemon");
const statusPokemon = document.querySelector("#statusPokemon");
const resultadoPokemon = document.querySelector("#resultadoPokemon");


// Função para limpar resultado do Pokémon


function limparResultadoPokemon() {
    resultadoPokemon.replaceChildren();
}


// Função para exibir Pokémon


function exibirPokemon(pokemon) {

    limparResultadoPokemon();


    // Nome
    const titulo = document.createElement("h2");

    titulo.textContent = pokemon.name;

    resultadoPokemon.append(titulo);


    // Imagem
    const imagem = document.createElement("img");

    imagem.src = pokemon.sprites.front_default;
    imagem.alt = `Imagem do Pokémon ${pokemon.name}`;

    resultadoPokemon.append(imagem);


    // Título dos tipos
    const tituloTipos = document.createElement("h3");

    tituloTipos.textContent = "Tipos:";

    resultadoPokemon.append(tituloTipos);


    // Lista de tipos
    const listaTipos = document.createElement("ul");

    pokemon.types.forEach((item) => {

        const li = document.createElement("li");

        li.textContent = item.type.name;

        listaTipos.append(li);
    });


    resultadoPokemon.append(listaTipos);
}


// Evento do formulário da Pokédex


formPokemon.addEventListener("submit", async (e) => {

    e.preventDefault();


    // Validar e transformar em minúsculo
    const nomePokemon =
        campoPokemon.value.trim().toLowerCase();


    // Validação
    if (nomePokemon === "") {

        statusPokemon.textContent =
            "Digite o nome de um Pokémon.";

        limparResultadoPokemon();

        return;
    }


    // Estado: CARREGANDO

    botaoPokemon.disabled = true;

    statusPokemon.textContent = "Buscando...";

    limparResultadoPokemon();


    try {

        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${nomePokemon}`,
            {
                signal: AbortSignal.timeout(5000)
            }
        );


        // Tratamento de erros HTTP
        if (!response.ok) {

            if (response.status === 404) {
                throw new Error("POKEMON_NOT_FOUND");
            }

            throw new Error("HTTP_ERROR");
        }


        const pokemon = await response.json();


        // Estado: SUCESSO

        exibirPokemon(pokemon);

        statusPokemon.textContent = "";


    } catch (erro) {

        // Estado: NÃO ENCONTRADO

        if (erro.message === "POKEMON_NOT_FOUND") {

            statusPokemon.textContent =
                "Pokémon não encontrado.";

        }

        // Estado: ERRO

        else if (erro.name === "TimeoutError") {

            statusPokemon.textContent =
                "A busca demorou muito. Tente novamente.";

        }

        else {

            statusPokemon.textContent =
                "Falha na conexão. Tente novamente.";
        }


        limparResultadoPokemon();


    } finally {

        botaoPokemon.disabled = false;
    }
});
