// ~ Bot de JumperLuko, jumper.luko@gmail.com

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

client.once("ready", () => {
    console.log(`Bot iniciado com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores.`);
    atividade();
});

client.on("guildCreate", guild =>{
    console.log(`O bot entrou no servidor: ${guild.name} (id: ${guild.id}). população: ${guild.memberCount} membros!`);
    atividade();
});

client.on("guildDelete", guild =>{
    console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id})`);
    atividade();
});

client.on("message", async message =>{
    if(message.author.bot) return;
    // if (!message.guild) return;

    console.log(message.member.roles.map(role => role.name.toString()).join(" || "));
    const command = (keyWord) => message.content.toLowerCase().startsWith(keyWord); // const command = message.content.slice(config.prefix.lenght).trim().split(/ +/g).shift().toLowerCase();
    function call(keyWord){return message.content.toLowerCase().includes(keyWord);}

    if(command("j!help")  || command("!help") || message.channel.type == "dm" && (command("help")|| command("ajuda"))){
        console.log(message.author.username+"#"+message.author.discriminator+" use !help");
        await message.channel.send("j!calc p/ Cálculos \r\nj!ping p/ Pingar \r\nj!info p/ Informações");
    }else if(command("j!ping")) {
        console.log(message.author.username+"#"+message.author.discriminator+" use !help");
        if(message.channel.type != "dm") {await message.delete();};
        const m = await message.channel.send("Ping?");
        await m.edit(`Pong! A latência é ${m.createdTimestamp - message.createdTimestamp}ms. A latencia  da API é ${Math.round(client.ping)}ms. Req by `+message.author.username);
    }else if(command("j!calc")){
        if(message.content.toLowerCase() != "j!calc"){
            console.log(message.author.username+"#"+message.author.discriminator+" use j!calc");
            const calc = message.content.toLowerCase().split("j!calc ").reverse().shift();
            var calcArray = calc.toLowerCase().split('');
            function erroIdentificado(erro,correcao){
                message.channel.send("Por favor mude '"+erro+"' para '"+correcao+"'. Só +1 vez corrigirei.");
            }

            if(calcArray[calcArray.length-1]=="+" || calcArray[calcArray.length-1]=="-" || calcArray[calcArray.length-1]=="*" || calcArray[calcArray.length-1]=="/" || calcArray[calcArray.length-1]=="%"){
                await message.channel.send("O calculo não pode finalizar com '"+calcArray[calcArray.length-1]+"'");
                return;
            }
            for(var i=0; i < calcArray.length; i++){
                if((calcArray[i]=="+" || calcArray[i]=="-" || calcArray[i]=="*" || calcArray[i]=="/" || calcArray[i]=="%" || calcArray[i]=="0" || calcArray[i]=="1" || calcArray[i]=="2" || calcArray[i]=="3" || calcArray[i]=="4" || calcArray[i]=="5" || calcArray[i]=="6" || calcArray[i]=="7" || calcArray[i]=="8" || calcArray[i]=="9") && calc.length <20){
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
            console.log(message.author.username+"#"+message.author.discriminator+" use j!calc NULL");
            await message.channel.send("Aqui você pode calcular valores!");
        }
    }else if(command("j!info")){
        if(!message.guild) {message.channel.send("Command para servidores");return;};
        let sicon = message.guild.iconURL;
        let serverembed = new Discord.RichEmbed()
        .setDescription("Informações do servidor")
        .setColor("#15f153")
        .setThumbnail(sicon)
        .addField("Server Name", message.guild.name)
        .addField("Criado em", message.guild.createdAt)
        .addField("Você entrou em", message.member.joinedAt)
        .addField("Total de pessoas", message.guild.memberCount);
        message.delete();
        return message.channel.send(serverembed);
    }else if(call("jumperluko_bot")){
        console.log(message.author.username+"#"+message.author.discriminator+" call me");
        if(typeof callMeAgain === 'undefined'){
            callMeAgain = [message.author.id];
            await message.channel.send("Oi to aqui");
        }else if(!callMeAgain.includes(message.author.id)){
            await message.channel.send("Oi to aqui");
        }else if(callMeAgain.includes(message.author.id)){
            await message.channel.send("Olá estou aqui....");
        }
    }
});

client.login(config.token);