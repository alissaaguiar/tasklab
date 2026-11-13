console.log("TaskLab iniciado.");

let tarefas = carregarTarefas();
let idEmEdicao = null;

const formulario = document.querySelector("#form-tarefa");

const campoTitulo = document.querySelector("#titulo");

const campoDescricao = document.querySelector("#descricao");

const campoPrioridade = document.querySelector("#prioridade");

const campoData = document.querySelector("#data");

const mensagemFormulario = document.querySelector("#mensagem-formulario");

const listaTarefas = document.querySelector("#lista-tarefas");

const tituloForm = document.querySelector("#titulo-formulario");
const btnSubmit = formulario.querySelector("#botao-salvar");
const btnCancelar = document.querySelector("#botao-cancelar");

// --------------- Funções ----------------

function gerarProximoId() {

    if (tarefas.length === 0) {
        return 1;
    }

    const ids =
        tarefas.map(
            tarefa => tarefa.id);

    return Math.max(...ids) + 1;
}

function resetarFormulario() {
    idEmEdicao = null;
    formulario.reset();

    // Restaura interface para o modo de cadastro
    if (tituloForm) tituloForm.textContent = "Cadastrar Tarefa";
    if (btnSubmit) btnSubmit.textContent = "Salvar tarefa";
    if (btnCancelar) btnCancelar.style.display = "none";

    atualizarAplicacao();
}

function validarTarefa(titulo, prioridade, data) {

    if (titulo.length < 3) {
        return "O título deve ter pelo menos 3 caracteres.";
    }
    else if (!titulo) {
        return "Informe o título da tarefa.";
    }
    if (!prioridade) {
        return "Selecione a prioridade da tarefa.";
    }
    if (!data) {
        return "Informe a data da tarefa.";
    }

    return null;
}

function renderizarTarefas(tarefas) {
    listaTarefas.textContent = "";

    tarefas.forEach(tarefa => {
        const artigo = document.createElement("article");

        // 33. Estado visual: Aplica a classe CSS se a tarefa estiver concluída
        if (tarefa.concluida) {
            artigo.classList.add("tarefa-concluida");
        }

        Object.entries(tarefa).forEach(([chave, valor]) => {
            const elemento = document.createElement("p");

            if (chave === 'concluida') {
                elemento.textContent = valor ? "Situação - Concluída" : "Situação - Pendente";
                // condição ? valor se true : valor se false
            } else elemento.textContent = `${chave} - ${valor}`;

            artigo.append(elemento);
        })

        const concluir = document.createElement("button");
        concluir.dataset.id = tarefa.id;
        concluir.dataset.acao = "concluir";
        concluir.textContent = tarefa.concluida ? "Reabrir" : "Concluir";

        const editar = document.createElement("button");
        editar.dataset.id = tarefa.id;
        editar.dataset.acao = "editar";
        editar.textContent = "Editar";

        const excluir = document.createElement("button");
        excluir.dataset.id = tarefa.id;
        excluir.dataset.acao = "excluir";
        excluir.textContent = "Excluir";

        artigo.append(concluir);
        artigo.append(editar);
        artigo.append(excluir);

        listaTarefas.append(artigo);
    })

    const minhasTarefas = document.querySelector("#resumo-tarefas");

    if (tarefas.length === 0) {
        minhasTarefas.textContent = "Nenhuma tarefa cadastrada.";
    } else minhasTarefas.textContent = tarefas.length;
}

function salvarTarefas() {

    const dados = JSON.stringify(tarefas);
    localStorage.setItem("tasklab:tarefas", dados);
}

function carregarTarefas() {

    const dados = localStorage.getItem("tasklab:tarefas");

    if (!dados) return [];

    try {
        const tarefasSalvas = JSON.parse(dados);

        if (!Array.isArray(tarefasSalvas)) {
            return [];
        }
        
        return tarefasSalvas;
    } 
    catch (erro) {
        console.error("Não foi possível carregar as tarefas.", erro);
        return [];
    }
}

function atualizarAplicacao() {

    salvarTarefas();
    renderizarTarefas(tarefas);
}

// -------------- eventos -----------------

formulario.addEventListener("submit", event => {

    event.preventDefault();

    const titulo = campoTitulo.value.trim();
    const descricao = campoDescricao.value.trim();
    const prioridade = campoPrioridade.value;
    const data = campoData.value;

    const erroValidacao = validarTarefa(titulo, prioridade, data);

    if (erroValidacao) {
        mensagemFormulario.textContent = erroValidacao
        mensagemFormulario.style.color = "red";
        return;
    }

    if (idEmEdicao === null) { // modo cadastro

        const novaTarefa = {
            id: gerarProximoId(),
            titulo,
            descricao,
            prioridade,
            data,
            concluida: false
        };
        tarefas.push(novaTarefa);

        mensagemFormulario.textContent = "Tarefa cadastrada com sucesso!";
    }
    else { //edição
        const indice = tarefas.findIndex(t => t.id === idEmEdicao);

        if (indice !== -1) {
            tarefas[indice] = {
                ...tarefas[indice], //preserva id e estado
                titulo,
                descricao,
                prioridade,
                data
            }
        }
        mensagemFormulario.textContent = "Tarefa alterada com sucesso!";
    }

    mensagemFormulario.style.color = "green";

    formulario.reset();
    atualizarAplicacao();
});

listaTarefas.addEventListener("click", event => {
    const botao = event.target.closest("[data-acao]");

    if (!botao) return;

    const id = Number(botao.dataset.id);
    const acao = botao.dataset.acao;

    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) return;

    if (acao === "concluir") {
        tarefa.concluida = !tarefa.concluida;
        atualizarAplicacao();
    }
    else if (acao === "editar") {
        idEmEdicao = tarefa.id;

        campoTitulo.value = tarefa.titulo;
        campoDescricao.value = tarefa.descricao;
        campoPrioridade.value = tarefa.prioridade;
        campoData.value = tarefa.data;

        // 38. Modifica a interface
        if (tituloForm) tituloForm.textContent = `Editando Tarefa #${id}`;
        if (btnSubmit) btnSubmit.textContent = "Atualizar tarefa";
        if (btnCancelar) btnCancelar.style.display = "inline-block";

        mensagemFormulario.textContent = "";

    }
    else if (acao === "excluir") {
        const indice = tarefas.findIndex(t => t.id === id);
        if (indice === -1) return;

        const confirma = window.confirm("Deseja excluir esta tarefa?");
        if (!confirma) return;

        tarefas.splice(indice, 1);

        if (id === idEmEdicao) {
            resetarFormulario();
        }

        mensagemFormulario.textContent = "Tarefa removida com sucesso!";
        mensagemFormulario.style.color = "blue";
    }

    atualizarAplicacao();
});



if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
        resetarFormulario();
        mensagemFormulario.textContent = "Edição cancelada.";
        mensagemFormulario.style.color = "gray";
    });
}

window.addEventListener("load", () => {
    carregarTarefas();
    renderizarTarefas(tarefas);
})

