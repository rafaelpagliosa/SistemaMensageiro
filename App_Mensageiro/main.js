//variaveis globais
var pendente;
var posicao;
var horasExib;
var minutosExib

//tempo de cada mensagem, mudar para deixar de acordo com a apresentação das mensagens
var tmpMsg = 2;

//configurações de endereço de banco firestore database Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD8spQiQeigF-5wW1d8kN1Uz0YcOeUH1S4",
    authDomain: "mensageiro-e50f0.firebaseapp.com",
    databaseURL: "https://mensageiro-e50f0-default-rtdb.firebaseio.com",
    projectId: "mensageiro-e50f0",
    storageBucket: "mensageiro-e50f0.appspot.com",
    messagingSenderId: "371389374877",
    appId: "1:371389374877:web:b3fc0202d35d24bbd84f74"
};

// inicialização do banco Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore()
const database = firebase.firestore();

//função para validar se a mensagem tem palavras improprias
function validaMsg() {
    var verifica0;
    var verifica1;
    var verifica2;
    var verifica3;

    const frase = document.getElementById('msg').value;
    console.log(verifica0 = frase.indexOf("bolsonaro"));
    console.log(verifica1 = frase.indexOf("Bolsonaro"));
    console.log(verifica2 = frase.indexOf("lula"));
    console.log(verifica3 = frase.indexOf("Lula"));

    if (verifica0 >= 0 || verifica1 >= 0 || verifica2 >= 0 || verifica3 >= 0) {
        const frase = document.getElementById('msg').value = '';
        console.log("Palavras Inválidas");
    } else {
        console.log("Ok");
    }

}

//função que consulta a ultima posição cadastrada no banco de dados
function validaPosicaoProxLivre() {
    firestore.collection("Mensagens").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        console.log(list.length)
        //posição recebe o tamanho do banco de dados (quantidade) e incrementa + 1 para ser a proxima posição a ser cadastrada
        posicao = list.length + 1;
    });
    return posicao;
}

//função que conta as mensagens pendentes para retornar o horario que tal mensagem vai ser exebida na apresentação
function quantasPendentes() {
    firestore.collection("Mensagens").where("status", "==", "pendente").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        console.log(list.length)
        pendente = list.length;
    });
    return pendente;
}

//função que calcula a hora aproximada que a mensagem vai ser exebida
function hora() {
    //pega a horario atual
    var currentTime = new Date();
    //pega a hora do horario atual
    var horas = currentTime.getHours();
    //transforma a hora atual em minutos
    var horasMinutos = horas * 60;
    //pega os minutos da hora atual
    var minutos = currentTime.getMinutes();
    //total é a soma das horas transformadas em minutos + minutos atuais + a quantidade de mensagens pendentes * tmpMsg

    //OBS se for necessário aumentar ou diminuir o tempo de exebição das mensagens, também é necessáro fazer 
    //a alteração desse "tmpMsg" na linha 8, pois ele representa os minutos que cada mensagem será exibida
    var total = horasMinutos + minutos + (pendente * tmpMsg)

    // getting the hours.
    let hrs = Math.floor(total / 60);
    // getting the minutes.
    let min = total % 60;
    // formatting the hours.
    hrs = hrs < 10 ? '0' + hrs : hrs;
    // formatting the minutes.
    min = min < 10 ? '0' + min : min;
    // returning them as a string.
    horasExib = hrs;
    minutosExib = min;
}

//função para salvar as mensagens no banco de dados
function salvar() {
    //recupera os dados do formulario HTML
    var remetente = document.getElementById('remetente').value;
    var curso_remetente = document.getElementById('curso_remetente').value;
    var destinatario = document.getElementById('destinatario').value;
    var curso_destinatario = document.getElementById('curso_destinatario').value;
    var tipo = document.getElementById('tipo').value;
    var status = "pendente";
    var msg = document.getElementById('msg').value;

    //faz uma verificação se todos campos foram preenchidos
    if (remetente != "" && curso_remetente != "" && curso_remetente != "nd" && destinatario != "" && destinatario != "nd" && curso_destinatario != "" && status != "" && msg != "" && tipo != "" && tipo != "nd") {
        firestore.collection("Mensagens").add({
            remetente: document.getElementById('remetente').value,
            curso_remetente: document.getElementById('curso_remetente').value,
            destinatario: document.getElementById('destinatario').value,
            curso_destinatario: document.getElementById('curso_destinatario').value,
            tipo: document.getElementById('tipo').value,
            status: "pendente",
            msg: document.getElementById('msg').value,
            posicao: posicao
        })

        var nameRemetente = document.getElementById('remetente').value;

        //executa a função para saber a hora de exebição
        hora();

        //alert informando o sucesso no cadastro + informando a hora de exebição
        abreAlert("Atenção ⏰", "" + "\n" + nameRemetente + " " + "sua mensagem foi salva com sucesso! " + "\n" + "Ela será exibida as " + horasExib + "h" + minutosExib + " " + "Obrigado !");
        //alert("" + "\n" + nameRemetente + " " + "sua mensagem foi salva com sucesso! " + "\n" + "Ela será exibida as " + horasExib + "h" + minutosExib + "⏰" + "\n" + "\n" + "Obrigado");

        //limpa os campos para a proxima mensagens
        document.getElementById('remetente').value = '';
        document.getElementById('curso_remetente').value = 'nd';
        document.getElementById('destinatario').value = '';
        document.getElementById('curso_destinatario').value = 'nd';
        document.getElementById('msg').value = '';
        document.getElementById('tipo').value = 'nd',
            document.getElementById('modal').classList.remove('active');

    }
    //else para caso algum campo não seja preenchido
    else {
        alert("Preencha todos os Campos Obrigatórios");

    }
}

//função para buscar os dados e criar a tabela para exebição
/*
function buscar() {
    firestore.collection("Mensagens").orderBy("posicao", "desc").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({...doc.data(), id: doc.id });
        });
        var dataSet = [];
        $.each(list, function(index, data) {
            dataSet.push([data.posicao, data.id, data.status, data.tipo, data.remetente, data.curso_remetente, data.destinatario, data.curso_destinatario, data.msg]);
        });

        //criação da tabela via javascript
        $('#example').DataTable({
            data: dataSet,
            paging: false,
            ordering: false,
            info: false,
            bDestroy: true,
            columns: [
                { title: 'N' },
                { title: 'Id' },
                { title: 'Status' },
                { title: 'Tipo' },
                { title: 'Remetente' },
                { title: 'Curso Remetente' },
                { title: 'Destinatário' },
                { title: 'Cur. Destinatário' },
                { title: 'Mensagem' },
            ]
        });
    });
}
*/

//função para buscar os dados e criar a tabela para exebição
function buscar() {
    firestore.collection("Mensagens").orderBy("posicao", "desc").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        var dataSet = [];
        $.each(list, function (index, data) {
            dataSet.push([data.posicao, data.id, data.status, data.tipo, data.remetente, data.destinatario]);
        });

        //criação da tabela via javascript


        var conta2 = 1;
        $('#example').DataTable({
            data: dataSet,
            rowId: conta2,
            paging: false,
            ordering: false,
            info: false,
            bDestroy: true,
            columns: [
                { title: 'N' },
                { title: 'Id' },
                { title: 'Status' },
                { title: 'Tipo' },
                { title: 'Remetente' },
                { title: 'Destinatário' },
            ]
        });
    });
}

//comando jquery para executar devidas funções ao carregar a tela
$(document).ready(function () {
    buscar();
    validaPosicaoProxLivre();
    quantasPendentes();
});

var idMsg = null;
$(document).ready(function () {
    var atual = null;
    $('#example').click(function (e) {
        function mouseEventHandler(mEvent) {
            var ultimo = atual;
            // Internet Explorer || Demais navegadores
            atual = mEvent.srcElement || mEvent.target;

            // Verifica se o elemento clicado é a tabela "example" ou um elemento filho da tabela "example"
            if ($(atual).closest('#example').length) {
                if (ultimo !== atual) {
                    var idAtual = atual.parentNode.id;
                    //console.log('id do elemento atual:', idAtual);

                    firestore.collection("Mensagens").doc(idAtual).get().then((doc) => {
                        if (doc.exists) {
                            console.log("Existe");
                            var dado = doc.data();
                            console.log(dado);
                            document.getElementById('modaledit').classList.add('active');

                            document.getElementById('idmsg').innerHTML = idAtual;

                            idMsg = idAtual;

                            document.getElementById('remetente_edit').value = dado.remetente;
                            document.getElementById('curso_remetente_edit').value = dado.curso_remetente;
                            document.getElementById('destinatario_edit').value = dado.destinatario;
                            document.getElementById('curso_destinatario_edit').value = dado.curso_remetente;
                            document.getElementById('tipo_edit').value = dado.tipo;
                            document.getElementById('msg_edit').innerHTML = dado.msg;

                        } else {
                            console.log("Não Existe");
                        }
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
                }
            }
        }
        document.body.onclick = mouseEventHandler;
    });
});

function deleteDoc() {
    firestore.collection("Mensagens").doc(idMsg).delete().then(() => {
        console.log("Documento deletado com sucesso!");
        document.getElementById('modaledit').classList.remove('active');

    }).catch((error) => {
        console.error("Erro ao deletar documento: ", error);
    });
}

function alteraCad() {
    console.log(idMsg);
    firestore.collection("Mensagens").doc(idMsg).get().then((doc) => {
        const status = doc.data().status;
        if (status !== 'apresentado') {
            // permitir a edição da mensagem aqui
            firestore.collection("Mensagens").doc(idMsg).update({
                remetente: document.getElementById('remetente_edit').value,
                curso_remetente: document.getElementById('curso_remetente_edit').value,
                destinatario: document.getElementById('destinatario_edit').value,
                curso_destinatario: document.getElementById('curso_destinatario_edit').value,
                tipo: document.getElementById('tipo_edit').value,
                msg: document.getElementById('msg_edit').value,
            }).catch((error) => {
                console.error("Erro ao editar documento: ", error);
            });
            abreAlert("", "Mensagem Alterada!");
            document.getElementById('modaledit').classList.remove('active');

        } else {
            abreAlert("", "Mensagem já foi Apresentada, não é possivel mais alterar!");
            document.getElementById('modaledit').classList.remove('active');
        }
    });
}

function abreAlert(titulo, msg) {
    document.getElementById('tituloAlert').innerHTML = titulo;
    document.getElementById('msgAlert').innerHTML = msg;

    document.getElementById('modalAlert').classList.add('active');
}

function closeAlert() {
    document.getElementById('modalAlert').classList.remove('active');
}

//Eventos e ações javascript para o modal de cadastro de mensagens
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('remetente').dataset.index = 'new'
}
'use strict'
const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const openModalEdit = () => document.getElementById('modaledit')
    .classList.add('active')

const closeModalEdit = () => {
    clearFields()
    document.getElementById('modaledit').classList.remove('active')
}

function fechaModal() {
    document.getElementById('modal').classList.remove('active');
}

function fechaModalEdit() {
    document.getElementById('modaledit').classList.remove('active');
}

document.getElementById('cadastrarCliente').addEventListener('click', openModal)
document.getElementById('cancelar').addEventListener('click', closeModal)