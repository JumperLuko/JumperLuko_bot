//Bot de JumperLuko, jumper.luko@gmail.com

const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

function atividade(){
    if(client.guilds.size > 1){
        client.user.setActivity(`In ${client.guilds.size} servers`);
    }else if(client.guilds.size == 1){
        client.user.setActivity(`In 1 server`);
    }
}

// Evento ao ligar Bot
client.on("ready", () => {
    console.log(`Olá mundo, bot iniciado com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores.`);
    atividade();
});

// On put to server
client.on("guildCreate", guild =>{
    console.log(`O bot entrou no servidor: ${guild.name} (id: ${guild.id}). população: ${guild.memberCount} membros!`);
    atividade();
});

// On delete to server
client.on("guildDelete", guild =>{
    console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id})`);
    atividade();
});

// On massage
client.on("message", async message =>{
    if(message.author.bot) return;
    // if(message.channel.type == "dm") return;

    const mensagem = message.content;
    const args = mensagem.slice(config.prefix.lenght).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();
    function chamado(keyWord){
        return message.content.includes(keyWord);
    }

    if(comando === "!help"){
        await message.channel.send("!calc para calculos, !ping para pingar");
    }else if(comando === "!ping") {
        console.log(message.author.username+" use !ping");
        // await message.delete();
        const m = await message.channel.send("Ping?");
        await m.edit(`Pong! A latência é ${m.createdTimestamp - message.createdTimestamp}ms. A latencia  da API é ${Math.round(client.ping)}ms`);
    }else if(comando === "!calc"){
        if(message.content.toLowerCase() != "!calc"){
            console.log(message.author.username+" use !calc");
            const calc = message.content.toLowerCase().split("!calc ").reverse().shift();
            var calcArray = calc.toLowerCase().split('');
            function erroIdentificado(erro,correcao){
                message.channel.send("Por favor mude '"+erro+"' para '"+correcao+"'. Só +1 vez corrigirei.");
            }

            if(calcArray[calcArray.length-1]=="+" || calcArray[calcArray.length-1]=="-" || calcArray[calcArray.length-1]=="*" || calcArray[calcArray.length-1]=="/" || calcArray[calcArray.length-1]=="%"){
                await message.channel.send("O calculo não pode finalizar com '"+calcArray[calcArray.length-1]+"'");
                return;
            }
            for(var i=0; i < calcArray.length; i++){
                if((calcArray[i]=="+" || calcArray[i]=="-" || calcArray[i]=="*" || calcArray[i]=="/" || calcArray[i]=="%" || calcArray[i]=="0" || calcArray[i]=="1" || calcArray[i]=="2" || calcArray[i]=="3" || calcArray[i]=="4" || calcArray[i]=="5" || calcArray[i]=="6" || calcArray[i]=="7" || calcArray[i]=="8" || calcArray[i]=="9") && calc.length <20){ //includes("x")
                    if(calcArray[i]=="+" || calcArray[i]=="-" || calcArray[i]=="*" || calcArray[i]=="/" || calcArray[i]=="%"){
                        if(calcArray[i]==lastCalcArray){
                            if(calcArray[i]!="*"){
                                await message.channel.send("Você repetiu o caractere '"+calcArray[i]+"'");
                                return;
                            }else if(calcArray[i-2]==lastCalcArray){
                                await message.channel.send("Você repetiu o caractere '*'");
                                return;
                            }
                        }
                    }
                }else{
                    if (calcArray[i]=="x"){
                        erroIdentificado(calcArray[i],"*");
                        calcArray[i] = "*";
                    }else if(calcArray[i]=="²"){
                        erroIdentificado(calcArray[i],"**2");
                        calcArray[i] = "**2";
                    }else if(calcArray[i]=="³"){
                        erroIdentificado(calcArray[i],"**3");
                        calcArray[i] = "**3";
                    }else{
                        if(calc.length < 20){
                            await message.channel.send("Caractere '" + calcArray[i] + "' invalido!");
                        }else{
                            await message.channel.send("Só aceito calculos de até 20 caracteres, por razões de segurança.");
                        }
                        return;
                    }
                }
                var lastCalcArray = calcArray[i];
            }
            await message.channel.send(eval(calcArray.join(""))); //If end with +? Verifica na linha de cima se o ultimo valor do array é um agregador aritimetico
        }else{
            console.log(message.author.username+" use !calc NULL");
            await message.channel.send("Aqui você pode calcular valores!");
        }
    }else if(chamado("JumperLuko_bot") === true){
        console.log(message.author.username+" call me");
        await message.channel.send("Oi to aqui");
    }
});

client.login(config.token);