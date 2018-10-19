/*

<!-- 
Esta é a versão inicial do lançador Python.

<script async type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.min.js"></script>
<script async type="text/javascript" src="http://godev.ifrn.edu.br/material/apagar/read-csv2.js"></script>
 <script type="text/javascript" src="html-fileapi-master/js/read-csv2.js"></script> -->

<div>
    <form class="form-horizontal well">
      <legend>
        <h3>
          <div id="title">Lançamento de Notas</div>
        </h3>
      </legend>
      <fieldset>
          <label for="csvFileInput"> <strong>CSV File:</strong>
          </label>
          <input type="file" id="csvFileInput" onchange="handleFiles(this.files)"
          accept=".csv">

        </div>
      </fieldset>
    </form>
    <div id="output">
    </div>
  </div>

*/


var tipo=null;

function handleFiles(files) {

	if( document.getElementById("csvFileInput").files.length == 0 ) return;

	
	tipo = prompt("Qual o tipo de arquivo ( 1 - csv padrão, 2 - csv do moodle, 3 - csv do google sala de aula)?", "2");

	if (tipo == null || tipo == "") {
	    alert("Opção inválida");
	}
	else if ( tipo == "1" || tipo == "2" || tipo == "3") {
	    
	    if (window.FileReader) {
			// FileReader are supported.
			getAsText(files[0]);
		} else {
			alert('FileReader are not supported in this browser.');
		}
	}
	else {
	    	alert("Opção inválida");
	}

	
}

function getAsText(fileToRead) {
	var reader = new FileReader();
	// Handle errors load
	reader.onload = loadHandler;
	reader.onerror = errorHandler;
	// Read file into memory as UTF-8
	reader.readAsText(fileToRead);
}

function loadHandler(event) {
	var csv = event.target.result;
	if(tipo=="1"){
		processCSV_default(csv);             
	}
	else if(tipo=="2"){
		processDataCSV_moodle(csv);             
	}
	else if(tipo=="3"){
		processDataCSV_google(csv);             
	};

}

function processCSV_default(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    while (allTextLines.length) {
        lines.push(allTextLines.shift().split(','));
    }
	//console.log(lines);
	//drawOutput(lines);
	lanca_csv_inicial(lines);
}
function  processDataCSV_moodle(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    while (allTextLines.length) {
        lines.push(allTextLines.shift().split(','));
    }
	//console.log(lines);
	//drawOutput(lines);
	lanca_csv_moodle(lines);
}

function processDataCSV_google(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    while (allTextLines.length) {
        lines.push(allTextLines.shift().split(','));
    }
	//console.log(lines);
	//drawOutput(lines);
	lanca_csv_google(lines);
}


function errorHandler(evt) {
	if(evt.target.error.name == "NotReadableError") {
		alert("Não é possível ler o arquivo enviado!");
	}
}

function drawOutput(lines){
	//Clear previous data
	document.getElementById("output").innerHTML = "";
	var table = document.createElement("table");
	for (var i = 0; i < lines.length; i++) {
		var row = table.insertRow(-1);
		for (var j = 0; j < lines[i].length; j++) {
			var firstNameCell = row.insertCell(-1);
			firstNameCell.appendChild(document.createTextNode(lines[i][j]));
		}
	}
	document.getElementById("output").appendChild(table);
}

function igual(str1,str2) { // Compara os nomes dos alunos tentando ignorar os acentos
    var str1tmp = str1.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    var str2tmp = str2.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    //alert(str1tmp + "-" + str2tmp);
    var n = str1tmp.localeCompare(str2tmp);
    //document.getElementById("demo").innerHTML = Math.abs(n)<3;
    //console.log("igual:"+n+"-"+str1+str2);
    if (Math.abs(n)>=1) return false;
    else return true;
}



function lanca_csv_moodle(lines){

	x = obtem_mat_nomes_do_HTML(); matriculas = x[0]; nomes=x[1];
    arranjo_num_ativ_X_ListIds = obtem_arranjo_num_ativ_X_ListIds();
    //console.log(x);
    
	//window.alert("Tab"+lines);
	//window.alert("qtdAtiv"+arranjo_num_ativ_X_ListIds.length);
   	//window.alert(lines);
   	//window.alert(matriculas);
   	//window.alert(nomes);
   	//window.alert("Lancamento:"+n_ativ+" ****** "+lines);
   	coluna_inicial = 9;
   	nao_encontrados = [];
   	//alert("arranjo_num_ativ_X_ListIds.length"+ arranjo_num_ativ_X_ListIds.length); // Isso vem do HTML da pagina
   	//alert("n_ativ"+ n_ativ); //n_ativ significa a coluna da matriz com a nota da atividade
   	
	for (n_ativ=coluna_inicial; n_ativ<coluna_inicial+1;n_ativ++){ // percorre as colunas
		notas = Array(matriculas.length).fill("");
		linha_inicial=1;
		
		for (var i = linha_inicial; i < lines.length-2; i++) { // percorre as linhas ou seja os alunos
			ind = i -linha_inicial;
			nome_csv = lines[i][1].replace("\"","").replace("\"","");
			
			if( lines[i][n_ativ]==undefined || lines[i][n_ativ]==null ||  lines[i][n_ativ].length==0 ) continue;

			// deve buscar o indice para o aluno
			var zindex = 0;
			while(true){
				if(zindex>nomes.length) {zindex=-1; break; }
				//alert(nome_csv+"="+nomes[(zindex+ind) % nomes.length]);
				if(igual(nome_csv,nomes[(zindex+ind) % nomes.length])){ 
					//console.log("IGUAL"+nome_csv+"-zindex:"+zindex+" ind:"+ind+"(zindex+ind) % nomes.length:"+(zindex+ind) % nomes.length+"nomes[(zindex+ind) % nomes.length]"+nomes[(zindex+ind) % nomes.length]);
					//console.log(igual(nome_csv,nomes[(zindex+ind) % nomes.length]));
					ind = (zindex+ind) % nomes.length;
					console.log(notas[ind],lines[i][n_ativ]);
					notas[ind]=lines[i][n_ativ].replace("\"","").replace("\"","").replace(",","").substring(0,3)
					//notas[ind]=lines[i][n_ativ].replace(",","").replace("\"","").replace("\"","");
					//notas[ind]=parseInt(lines[i][n_ativ])
					break; 
				}
				zindex = zindex+ 1;
			}
			if(zindex<0){ //alert("Não encontrou o nome aluno do CSV no SUAP:"+nome_csv +"--"+nomes[ind]);
				nao_encontrados.push(nome_csv);
				continue;
			 }
		
		}
		//console.log("Arranjo:"+arranjo_num_ativ_X_ListIds);
		//console.log("Atividade:"+n_ativ-coluna_inicial);
		//console.log(notas);
		if(nao_encontrados.length>0) alert("Não encontrou o(s) nome(s) aluno(s) do CSV no SUAP:"+nao_encontrados);
		console.log(arranjo_num_ativ_X_ListIds )
		console.log( n_ativ-coluna_inicial)
		console.log( notas)
		atualiza_tabela(arranjo_num_ativ_X_ListIds,n_ativ-coluna_inicial,notas);
	}


}

function lanca_csv_google(lines){

	x = obtem_mat_nomes_do_HTML(); matriculas = x[0]; nomes=x[1];
    arranjo_num_ativ_X_ListIds = obtem_arranjo_num_ativ_X_ListIds();
    //console.log(x);
    
	//window.alert("Tab"+lines);
	//window.alert("qtdAtiv"+arranjo_num_ativ_X_ListIds.length);
   	//window.alert(lines);
   	//window.alert(matriculas);
   	//window.alert(nomes);
   	//window.alert("Lancamento:"+n_ativ+" ****** "+lines);
   	coluna_inicial = 3;
   	nao_encontrados = [];
   	//alert("arranjo_num_ativ_X_ListIds.length"+ arranjo_num_ativ_X_ListIds.length); // Isso vem do HTML da pagina
   	//alert("n_ativ"+ n_ativ); //n_ativ significa a coluna da matriz com a nota da atividade
   	
	for (n_ativ=coluna_inicial; n_ativ<coluna_inicial+arranjo_num_ativ_X_ListIds.length;n_ativ++){ // percorre as colunas
		notas = Array(matriculas.length).fill("");
		linha_inicial=4;
		
		for (var i = linha_inicial; i < lines.length-1; i++) { // percorre as linhas ou seja os alunos
			ind = i -linha_inicial;
			nome_csv = lines[i][0]+" "+lines[i][1];

			if( lines[i][n_ativ]==undefined || lines[i][n_ativ]==null ||  lines[i][n_ativ].length==0 ) continue;

			// deve buscar o indice para o aluno
			var zindex = 0;
			while(true){
				if(zindex>nomes.length) {zindex=-1; break; }
				if(igual(nome_csv,nomes[(zindex+ind) % nomes.length])){ 
					//console.log("IGUAL"+nome_csv+"-zindex:"+zindex+" ind:"+ind+"(zindex+ind) % nomes.length:"+(zindex+ind) % nomes.length+"nomes[(zindex+ind) % nomes.length]"+nomes[(zindex+ind) % nomes.length]);
					//console.log(igual(nome_csv,nomes[(zindex+ind) % nomes.length]));
					ind = (zindex+ind) % nomes.length;
					notas[ind]=lines[i][n_ativ].replace(/\.[^/.]+$/, "");
					break; 
				}
				zindex = zindex+ 1;
			}
			if(zindex<0){ //alert("Não encontrou o nome aluno do CSV no SUAP:"+nome_csv +"--"+nomes[ind]);
				nao_encontrados.push(nome_csv);
				continue;
			 }
		
		}
		//console.log("Arranjo:"+arranjo_num_ativ_X_ListIds);
		//console.log("Atividade:"+n_ativ-coluna_inicial);
		//console.log(notas);
		if(nao_encontrados.length>0) alert("Não encontrou o(s) nome(s) aluno(s) do CSV no SUAP:"+nao_encontrados);
		atualiza_tabela(arranjo_num_ativ_X_ListIds,n_ativ-coluna_inicial,notas);
	}


}

function lanca_csv_inicial(lines){
	
	x = obtem_mat_nomes_do_HTML(); matriculas = x[0]; nomes=x[1];
    arranjo_num_ativ_X_ListIds = obtem_arranjo_num_ativ_X_ListIds()
    
	//window.alert("Tab"+lines);
	//window.alert("qtdAtiv"+arranjo_num_ativ_X_ListIds.length);
   	//window.alert(lines);
   	//window.alert(matriculas);
   	//window.alert(nomes);
	for (n_ativ=2; n_ativ<2+arranjo_num_ativ_X_ListIds.length;n_ativ++){
		notas = [];
		window.alert("Ativ:"+n_ativ+" "+lines[0]);
		for (var i = 1; i <= matriculas.length; i++) {
			ind = i -1;
			//if(n_ativ>=3)
			//	window.alert(lines[i][n_ativ]);
			nome_csv = lines[i][1];
			//if(i>35)alert("i:"+i+"Nome_csv"+nome_csv+"nomes"+nomes);
			if( lines[i][n_ativ].length==0 ){
				alert("Nome não presente! "+nome_csv+"-"+nomes[ind]);
				notas.push("");
			}
			else if (igual(nome_csv,nomes[ind])){
				//Devo lancar quando nome ou mat casam
				notas.push(lines[i][n_ativ]);
			}else{ // Se diferente lanço vazio!
				alert("Nome não presente! "+nome_csv+"-"+nomes[ind]);
				notas.push("");
			}


			// Posso quardar a informação quando não casa para exibir mensagens

		}
		//window.alert("Notas"+notas);
		atualiza_tabela(arranjo_num_ativ_X_ListIds,n_ativ-2,notas);
	}
	
}

	// Antigo  V0
	function obtem_mat_nomes_do_HTML_v0(){
		qtd_entradas = $('*').find("input[tabindex*=\'"+"1\']").length;
		alunosHtml = $('*').find("td > dl > dd");
		if(qtd_entradas!= alunosHtml.length) {alert("Atenção: há aluno sem campo de entrada para nota(s)!");}
		matriculas = []; nomes = [];
		for(i=0;i<alunosHtml.length;i++){
			s = alunosHtml[i].innerText.length;
			matriculas.push(alunosHtml[i].innerText.substring(s-16,s-2));
			nomes.push(alunosHtml[i].innerText.substring(0,s-19));
		}
		return [ matriculas , nomes ];
	}

	function obtem_mat_nomes_do_HTML(){
		x = $('*').find("input[tabindex*=\'"+"1\']");
		qtd_entradas = x.length;
		matriculas = []; nomes = [];
		for(i=0;i<x.length;i++){
			elem = x[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.innerText.split("\n");
			nome = elem[1].substring(0,elem[1].length-19);
			matricula = elem[1].substring(elem[1].length-16,elem[1].length-2)
			matriculas.push(matricula);
			nomes.push(nome);
		}
		return [ matriculas , nomes ];
	}



	function obtem_arranjo_num_ativ_X_ListIds(){
	 	//Obtem o arranjo de ids das notas
		var arranjo_num_ativ_X_ListIds = [];
	 	for(n_atividade=1;n_atividade<=10;n_atividade++){
	 	
	    
		    lista_id_da_ativ = [];
		    $('*').find("input[tabindex*=\'"+n_atividade.toString()+"\']").val(function () { //Filtrando pelo código da atividade
		    	lista_id_da_ativ.push(this.name.toString());
		        return this.value;
		    });
		    if(lista_id_da_ativ.length>=1)
		    	arranjo_num_ativ_X_ListIds.push(lista_id_da_ativ);

	    }
	    //window.alert("Ids atividades"+arranjo_num_ativ_X_ListIds.length);
	 	//window.alert("Tam "+arranjo_num_ativ_X_ListIds[0].length+"-"+arranjo_num_ativ_X_ListIds);
	 	return arranjo_num_ativ_X_ListIds;
 	}

 	function atualiza_tabela(arranjo_num_ativ_X_ListIds,n_ativ,notas){
	 	cont=0;
	 	//window.alert("Atualizando!")
	 	resp = prompt("Lançar a atividade ("+(n_ativ+1)+") na linhas ?", (n_ativ+1));

		if (resp == null || resp == "" && (parseInt(resp)>=0 && parseInt(resp)<10)) {
		    alert("Opção inválida e operação não realizada!");
		    return;
		}
		n_ativ = parseInt(resp)-1; 
		



	 	
    	$('*').find("input[tabindex*=\'"+(n_ativ+1).toString()+"\']").val(function () {

	    	indice=arranjo_num_ativ_X_ListIds[n_ativ].indexOf(this.name.toString());
	    	if (indice>-1  && notas[indice]!="" ){
	    		//return cont++;
	    		//window.alert("Atualiza2 -"+indice)


	    		// this.onblur();  Opção para salvar!
	    		return notas[indice];

	    	}
	        else{
	        	
	        	return this.value;
	        }
	    });

    	// Salvar os modificados no SUAP
    	$('*').find("input[tabindex*=\'"+(n_ativ+1).toString()+"\']").val(function () {

	    	indice=arranjo_num_ativ_X_ListIds[n_ativ].indexOf(this.name.toString());
	    	if (indice>-1  && notas[indice]!="" ){
	    		this.onblur(); return this.value;

	    	}
	        else{
	        	return this.value;
	        }
	    });

    }

