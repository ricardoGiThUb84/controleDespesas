class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for (let i in this) {
			if (!this[i]) {
				return false
			}
		}
		return true
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if (id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(d) {
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros() {

		let id = localStorage.getItem('id')
		let despesaObj;
		let listaDespesasObj = [];
		for (let i = 1; i <= id; i++) {
			despesaObj = JSON.parse(localStorage.getItem(i));

			if (!despesaObj) {

				continue;
			}

			despesaObj.id = i;
			listaDespesasObj.push(despesaObj);
		}

		return listaDespesasObj;
	}

	pesquisar(despesa){

		let despesasFiltradas = this.recuperarTodosRegistros();

		for(let i in despesa){

			if(!!despesa[i]){
				
				despesasFiltradas = despesasFiltradas.filter( f => f[i] === despesa[i]);
				
			} 

		}
		
		
		return despesasFiltradas;
	}

	remover(id){

		localStorage.removeItem(id);
	}
}

let bd = new Bd()




function cadastrarDespesa() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value,
		valor.value
	)


	if (despesa.validarDados()) {
		bd.gravar(despesa)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'

		//dialog de sucesso
		$('#modalRegistraDespesa').modal('show')

		ano.value = "";
		mes.value = "";
		dia.value = "";
		tipo.value = "";
		descricao.value = "";
		valor.value = "";

	} else {

		document.getElementById('modal_titulo').innerHTML = 'Erro na inclus??o do registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na grava????o, verifique se todos os campos foram preenchidos corretamente!'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		//dialog de erro
		$('#modalRegistraDespesa').modal('show')
	}
}


function carregaListaDespesas(despesas = [], filtro = false) {
	
	if(!despesas.length && !filtro){

		despesas = bd.recuperarTodosRegistros();

	}

	 
	linhaTr = document.getElementById('listaDespesasTbody');
	linhaTr.innerHTML = "";

	despesas.forEach(dado => {
		// criando linhas ou tags <tr>
		let coluna = linhaTr.insertRow();

		// criando colunas ou tags <td>
		coluna.insertCell(0).innerHTML = `${dado.dia}/${dado.mes}/${dado.ano}`;

		switch (dado.tipo) {
			case "1": dado.tipo = "Alimenta????o";
				break;
			case "2": dado.tipo = "Educa????o";
				break;
			case "3": dado.tipo = "Lazer";
				break;
			case "4": dado.tipo = "Sa??de";
				break;
			case "5": dado.tipo = "Transporte";
				break;
		}

		coluna.insertCell(1).innerHTML = `${dado.tipo}`;
		coluna.insertCell(2).innerHTML = `${dado.descricao}`;
		coluna.insertCell(3).innerHTML = `R$ ${dado.valor}`;

		// criacao bot??o
		let btn = document.createElement("button");
		btn.id = `id_despesa_${dado.id}`
		btn.className = 'btn btn-outline-danger btn-sm';
		btn.innerHTML = '<p class="fas fa-trash"></p>';
		btn.onclick = function(){

			let id = this.id.replace('id_despesa_' , '');
			console.log(id);

			bd.remover(id);

			window.location.reload();
		};
		
		coluna.insertCell(4).append(btn);
	})

			
}

function pesquisarDespesa() {

	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

	let despesas = bd.pesquisar(despesa);

	carregaListaDespesas(despesas , true);
}


function totalDespesa(){

	alert("total despesa")
}