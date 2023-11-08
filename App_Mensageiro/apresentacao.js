//var tmpApresentacao = 7000;
//var tmpPropaganda = 14000;

//tempo de cada apresentação mensagem, se mudar esse tempo alterar no main.js a variavel tmpMsg (linha 8) ela deve ser a soma em minutos
//dessas duas variaveis a baixo

var tmpApresentacao = 75000;
var tmpPropaganda = 150000;

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

//função para ordenar o array de mensagens que vem pela busca no banco firebase
//como utilizamos um "where" na query do firebase ficamos sem a opção da ordenação nativa do banco,
//sendo assim essa função serve para tal
function ordemCrescente(a, b) {
    return a.posicao > b.posicao;
}

//função que busca os dados do banco
function buscar() {
    firestore.collection("Mensagens").where("status", "==", "pendente").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        console.log(list);

        //chama a função para ordenação de posições do array de mensagens
        list.sort(ordemCrescente);

        //pega o primeiro elemento do array (com a menor posição das mensagens)
        const firstElement = list.shift();



        //verificação se existir o primeiro elemento entra no if
        if (firstElement != null && firstElement.status != "apresentado") {
            //aplica o estilo que o usuario cadastrou com a mensagem *Apagar aqui se não for utilizado multiplos estilos
            if (firstElement.tipo == "amorosa") {
                document.getElementById('apresentacao').classList.add("tipo_amorosa");
                document.getElementById('apresentacao').classList.remove("tipo_alegre");
                document.getElementById('apresentacao').classList.remove("tipo_aviso");
                document.getElementById('apresentacao').classList.remove("tipo_normal");

                const propaganda = document.getElementById("image");
                propaganda.src = "img/tema-amoroso-transicao.png";

            } else if (firstElement.tipo == "alegre") {
                document.getElementById('apresentacao').classList.add("tipo_alegre");
                document.getElementById('apresentacao').classList.remove("tipo_amorosa");
                document.getElementById('apresentacao').classList.remove("tipo_aviso");
                document.getElementById('apresentacao').classList.remove("tipo_normal");

                const propaganda = document.getElementById("image");
                propaganda.src = "img/tema-alegre-transicao.png";

            } else if (firstElement.tipo == "aviso") {
                document.getElementById('apresentacao').classList.add("tipo_aviso");
                document.getElementById('apresentacao').classList.remove("tipo_alegre");
                document.getElementById('apresentacao').classList.remove("tipo_amorosa");
                document.getElementById('apresentacao').classList.remove("tipo_normal");

                const propaganda = document.getElementById("image");
                propaganda.src = "img/tema-aviso-transicao.png";

            } else {
                document.getElementById('apresentacao').classList.add("tipo_normal");
                document.getElementById('apresentacao').classList.remove("tipo_alegre");
                document.getElementById('apresentacao').classList.remove("tipo_aviso");
                document.getElementById('apresentacao').classList.remove("tipo_amorosa");

                const propaganda = document.getElementById("image");
                propaganda.src = "img/tema-defalt-transicao.png";
            }

            //pega os dados do primeiro elemento e submeto as variaveis do HTML (isso é o que imprime as informações na tela)
            document.getElementById('pos').innerHTML = firstElement.posicao;
            document.getElementById('id').innerHTML = firstElement.id;
            document.getElementById('remetente').innerHTML = firstElement.remetente;
            document.getElementById('curso_remetente').innerHTML = firstElement.curso_remetente;
            document.getElementById('destinatario').innerHTML = firstElement.destinatario;
            document.getElementById('curso_destinatario').innerHTML = firstElement.curso_destinatario;
            document.getElementById('msg').innerHTML = firstElement.msg;

            //a apresentação funciona em dois modos
            //1 modo exebição de mensagem

            //2 modo exebição de exebição do video do if e imagens do curso (qrcod para instagran etc),
            //no codigo html essa parte é um carrousel, que é feito com bootstrap

            //a função setTimeout executa o seguinte linha de codigo em um intervalo de tempo programado

            //a ideia inicial é que as mensagem sejam exebidas 2 minutos e tenham mais 1 minuto de "propaganda"
            //somando ao todo 3 minutos de exebição

            //função que ao se passar 2 minutos oculta a tela da mensagem e apresenta a tela das propagandas
            setTimeout(() => {
                document.getElementById('apresentacao').style.display = 'none';
                document.getElementById('sliderprod').style.display = 'block';

                //essa função funciona com milessegundos 
                //1000 milessegundo equivalem a 1 segundo
                //120000 milessegundo equivalem a 120 segundo que transformados em minutos fica 2
                //caso seja necessário mudar o tempo de execução alterar a variavel tmpApresentacao no topo do codigo
            }, tmpApresentacao);


            //função que ao se passar 3 minutos altera o status de pendente para apresentado do primeiro Elemento (mensagem Atual)
            setTimeout(() => {
                //alteração dos dados do documento firebase
                firestore.collection("Mensagens").doc(firstElement.id).set({
                    posicao: firstElement.posicao,
                    id: firstElement.id,
                    tipo: firstElement.tipo,
                    remetente: firstElement.remetente,
                    curso_remetente: firstElement.curso_remetente,
                    destinatario: firstElement.destinatario,
                    curso_destinatario: firstElement.curso_destinatario,
                    msg: firstElement.msg,
                    status: "apresentado",
                })
                    .then(() => {
                        //console.log("Ok");
                    })
                    .catch((error) => {
                        //console.error("Error", error);
                    });

                //oculta a propagando e apresenta a exebição da mensagem novamente
                document.getElementById('apresentacao').style.display = 'block';
                document.getElementById('sliderprod').style.display = 'none';

                //essa função funciona com milessegundos 
                //1000 milessegundo equivalem a 1 segundo
                //180000 milessegundo equivalem a 180 segundo que transformados em minutos fica 3
                //caso seja necessário mudar o tempo de execução alterar a variavel tmpPropaganda no topo do codigo
            }, tmpPropaganda);
        }
        //else para se no caso não tenha mensagens pendente ele fica apresentado a propaganda
        else {
            setTimeout(() => {
                console.log("Sem mensagem");
                document.getElementById('apresentacao').style.display = 'none';
                document.getElementById('sliderprod').style.display = 'block';
                //caso seja necessário mudar o tempo de execução alterar a variavel tmpPropaganda no topo do codigo
            }, tmpPropaganda);
        }
    });
}



//função executada ao carregar a pagina
$(document).ready(function () {
    buscar();
});


//funções ficam em loop