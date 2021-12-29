
class BdValor{

	constructor(){

		let id_total = localStorage.getItem('1d_total')

		if (!id_total) {
			localStorage.setItem('1d_total', 'soma')
		}
	}

	gravar(obj){

		
		let objJason = this.montarDataTotal(obj) ;
		localStorage.setItem('id_total' , JSON.stringify(objJason));
	
	}

	montarDataTotal(dados){

		let objDataTotal = {
	
			data : dados.data,
			mensagem : dados.mensagem,
			gastos : dados.gastos,
			valorTotal : dados.valor,
			salario : dados.salario
		}
			return objDataTotal;
	}

	
}



let botao = document.querySelector(".btn");


let bancoDespesa = new BdValor();





botao.addEventListener("click", function(){

		event.preventDefault();

		let dadosForm = capturarInfoForm();
		let dadosBd = capturarBancodeDados();
		let objFiltrado = filtrarESomarDados(dadosForm, dadosBd);
        
		console.log(dadosForm)
		console.log(objFiltrado)
        bancoDespesa.gravar(objFiltrado);
		console.log("carregando tr e ttd")
		carregarInfoTotal()
		
		
});



function capturarInfoForm(){

	let form = document.querySelectorAll(".form-control");

	if(!form[0].value || !form[1].value || !form[2].value){

		alert("Preencha todos os campos!");
	}
	
	let infoForm = {

		ano : form[0].value,
		mes : form[1].value,
		salario : form[2].value
		
	}

	
	return infoForm;

}

function capturarBancodeDados(){

	let idDados = localStorage.getItem('id');
	
	let listaDespesas = [];

	for(let i = 1; i <= idDados; i++){

			let validarDespesas = JSON.parse(localStorage.getItem(i));

			if(validarDespesas) listaDespesas.push(validarDespesas);

	}
		
	 return listaDespesas;
}




function filtrarESomarDados(form , banco){

	let objInfoForm = form;
	let listaBancodeDados = banco;
	let totalDespesas = 0;

	

	if(objInfoForm.ano || listaBancodeDados.ano){

		listaBancodeDados = listaBancodeDados.filter(item => {
   
			return	item.ano === objInfoForm.ano
   
	   })
   
	 }
   
	 if(objInfoForm.mes || listaBancodeDados.mes){
   
	   listaBancodeDados = listaBancodeDados.filter(item => {
   
		   return	item.mes === objInfoForm.mes
   
	   })
   
	 }

	 
	 if(!objInfoForm.ano && !objInfoForm.mes){

		return listaBancodeDados = {};
	  
	
	}else{

		let objBanco = {};

		let totalDespesas = 0;
		
		listaBancodeDados.forEach(item => {

			totalDespesas += Number(item.valor);
		})


		let porcentagemGastoSalario = totalDespesas / objInfoForm.salario;

		
		if(porcentagemGastoSalario <= 0.15){

			objBanco.mensagem = `Despesa sob controle!`;
			

		}else if(porcentagemGastoSalario >= 0.15 && porcentagemGastoSalario <= 0.30 ){

			objBanco.mensagem = `Despesa moderada`;
		}else{

			objBanco.mensagem = `Despesa alta!`;
		}

			objBanco.data = `${objInfoForm.mes}/ ${objInfoForm.ano}`;
			objBanco.valor = totalDespesas;
			objBanco.gastos = `${porcentagemGastoSalario * 100}%`;
			console.log(objBanco)

			return objBanco;

		}



}

function carregarInfoTotal(){

	let removerDespesaBanco = JSON.parse(localStorage.getItem('id_total'));

	let table = document.querySelector("#listaDespesasTbody");
	let tr = criarTr('tr-despesa');
	let tdData = criarTd("td-data" , removerDespesaBanco.data);
	let tdMensagem = criarTd("td-mensagem" , removerDespesaBanco.mensagem);
	let tdGastos = criarTd("td-gastos" , removerDespesaBanco.gastos);
	let tdTotal = criarTd("td-total" , `$ ${removerDespesaBanco.valorTotal}`);


	tr.appendChild(tdData);
	tr.appendChild(tdMensagem);
	tr.appendChild(tdGastos);
	tr.appendChild(tdTotal);

	table.appendChild(tr);
	
	console.log(table) 
	


}







function criarTr(estilo){

	let table = document.querySelector('#listaDespesasTbody');
	
	let tr = document.createElement("tr");

	console.log(tr);

	tr.classList.add(estilo);

	return tr
}


function criarTd(estilo , value){

	let td = document.createElement("td");

	td.classList.add(estilo);

	td.innerHTML = value;

	return td

}

