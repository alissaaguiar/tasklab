console.log("TaskLab iniciado.");

let tarefas = [];

const formulario = document.querySelector("#form-tarefa");

const campoTitulo = document.querySelector("#titulo");

const campoDescricao = document.querySelector("#descricao");

const campoPrioridade = document.querySelector("#prioridade");

const campoData = document.querySelector("#data");

const mensagemFormulario = document.querySelector("#mensagem-formulario");

const listaTarefas = document.querySelector("#lista-tarefas");

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
    minhasTarefas.textContent = "";

    if (tarefas.length === 0) {
        minhasTarefas.textContent = "Nenhuma tarefa cadastrada.";
    } else minhasTarefas.textContent = tarefas.length;
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
    mensagemFormulario.style.color = "green";

    formulario.reset();
    renderizarTarefas(tarefas);
});

renderizarTarefas(tarefas);