const { Client, GatewayIntentBits, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once("ready", () => {
    console.log(`Bot online, ${client.user.tag}`);
});

// VARIABLES IDS Y ROLES
const BOT_TOKEN = process.env.TOK;
const ROLES_PERMISOS = ["1306339991558950913"]; // roles con permisos
const ROL_WHITELIST = "1306340005043638302"; // rol aceptado
const ROL_SUSPENDIDO = "1306341244930097172"; // rol denegado
const FICHA_PJ_ROL_APROBADO = "1306341264115109908"; // ficha aprobada
const FICHA_PJ_SUSPENSA = "1306341280015712328"; // ficha suspensa
const ROL_ACCESO_DENEGADO = "1306341308042055680"; // rol de acceso denegado
const Banner1 = "https://r2.fivemanage.com/cFdbw5GonaCNAWAguNOUG/images/banner.png";
const Banner2 = "https://cdn.discordapp.com/attachments/1211738219348099203/1306312265116422215/IMG_2076.png";
const Banner3 = "https://cdn.discordapp.com/attachments/1211738219348099203/1306312247093624882/IMG_2075.png";
const logo = "https://cdn.discordapp.com/attachments/1191452700739645582/1306302761750495304/94e11b395c0449c459cc7866a07c2724.png";



// banner random




// FUNCIÓN /REVISAR
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "revisar") {
        if (!interaction.member.roles.cache.some((role) => ROLES_PERMISOS.includes(role.id))) {
            interaction.reply({ content: "No tienes permisos suficientes para utilizar este comando", ephemeral: true });
            return;
        }

        const usuarioMencionado = interaction.options.getUser("usuario-referido");
        const revisarEmbed = new EmbedBuilder()
            .setColor("#8f1123")
            .setTitle("Su solicitud está siendo revisada")
            .setAuthor({ name: "RedSide Community", iconURL: logo })
            .setDescription(`${usuarioMencionado} El equipo de staff está revisando su solicitud. Gracias por su paciencia.`)
            .setImage(Banner2)
            .setTimestamp()
            .setFooter({ text: "RedSide Community Staff", iconURL: logo });

        await interaction.channel.send({ embeds: [revisarEmbed] });
        await interaction.reply({ content: "El mensaje se envió con éxito", ephemeral: true });
    }
});

// FUNCIÓN ACEPTAR O RECHAZAR FORMULARIO
client.on("interactionCreate", async (interaction) => {
    if (interaction.commandName === "formulario") {
        if (!interaction.member.roles.cache.some((role) => ROLES_PERMISOS.includes(role.id))) {
            interaction.reply({ content: "No tienes permisos suficientes para utilizar este comando", ephemeral: true });
            return;
        }

        const formStatus = interaction.options.getString("form-status");
        const usuario = interaction.options.getUser("usuario-mencionado");
        const guild = interaction.guild;
        const miembro = guild.members.cache.get(usuario.id);

        if (miembro && miembro.roles.cache.has(ROL_ACCESO_DENEGADO)) {
            interaction.reply({ content: "Este usuario tiene acceso denegado y no puede ser modificado.", ephemeral: true });
            return;
        }

        const embedFormularioPublico = new EmbedBuilder()
            .setColor("#8f1123")
            .setTitle(`Su formulario ha sido ${formStatus}`)
            .setAuthor({ name: "RedSide Community", iconURL: logo })
            .setDescription(`${usuario} El equipo de staff ha ${formStatus} su solicitud.`)
            .setImage(Banner1)
            .setTimestamp()
            .setFooter({ text: "RedSide Community Staff", iconURL: logo });

        const embedFormularioPrivado = new EmbedBuilder(embedFormularioPublico)
            .setDescription(`${usuario} El equipo de staff ha ${formStatus} su solicitud.`)
            .setImage(Banner2)


        if (formStatus === "rechazado") {
            const razon = interaction.options.getString("razon-form") || "No se proporcionó una razón";
            embedFormularioPrivado.setDescription(`${usuario} El equipo de staff ha rechazado su solicitud. Razón: **${razon}**`);
        }

        if (miembro) {
            if (formStatus === "aprobado") {
                await miembro.roles.remove(ROL_SUSPENDIDO).catch(console.error);
                await miembro.roles.add(ROL_WHITELIST).catch(console.error);
            } else if (formStatus === "rechazado") {
                await miembro.roles.add(ROL_SUSPENDIDO).catch(console.error);
                await miembro.roles.remove(ROL_WHITELIST).catch(console.error);
            }

            await usuario.send({ embeds: [embedFormularioPrivado] }).catch(console.error);
            await interaction.channel.send({ embeds: [embedFormularioPublico] });
            await interaction.reply({ content: "El mensaje se envió con éxito", ephemeral: true });
        } else {
            interaction.reply({ content: "No se encontró el usuario en el servidor", ephemeral: true });
        }
    }
});

// FUNCIÓN APROBAR / DESAPROBAR FICHA DE PJ
client.on("interactionCreate", async (interaction) => {
    if (interaction.commandName === "ficha") {
        if (!interaction.member.roles.cache.some((role) => ROLES_PERMISOS.includes(role.id))) {
            interaction.reply({ content: "No tienes permisos suficientes para utilizar este comando", ephemeral: true });
            return;
        }

        const fichaStatus = interaction.options.getString("ficha-status");
        const usuario = interaction.options.getUser("ficha-mencionado");
        const guild = interaction.guild;
        const miembro = guild.members.cache.get(usuario.id);

        if (miembro && miembro.roles.cache.has(ROL_ACCESO_DENEGADO)) {
            interaction.reply({ content: "Este usuario tiene acceso denegado y no puede ser modificado.", ephemeral: true });
            return;
        }

        const embedFichaPublico = new EmbedBuilder()
            .setColor("#8f1123")
            .setTitle(`Su ficha de personaje ha sido ${fichaStatus}`)
            .setAuthor({ name: "RedSide Community", iconURL: logo })
            .setDescription(`${usuario} El equipo de staff ha ${fichaStatus} su ficha.`)
            .setImage(Banner1)
            .setTimestamp()
            .setFooter({ text: "RedSide Community Staff", iconURL: logo });

        const embedFichaPrivado = new EmbedBuilder(embedFichaPublico);

        if (fichaStatus === "rechazado") {
            const razon = interaction.options.getString("razon-ficha") || "No se proporcionó una razón";
            embedFichaPrivado.setDescription(`${usuario} El equipo de staff ha rechazado su ficha. Razón: **${razon}**`);
            embedFichaPrivado.setImage(Banner2)
        }

        if (miembro) {
            if (fichaStatus === "aprobado") {
                await miembro.roles.remove(FICHA_PJ_SUSPENSA).catch(console.error);
                await miembro.roles.add(FICHA_PJ_ROL_APROBADO).catch(console.error);
            } else if (fichaStatus === "rechazado") {
                await miembro.roles.add(FICHA_PJ_SUSPENSA).catch(console.error);
                await miembro.roles.remove(FICHA_PJ_ROL_APROBADO).catch(console.error);
            }

            await usuario.send({ embeds: [embedFichaPrivado] }).catch(console.error);
            await interaction.channel.send({ embeds: [embedFichaPublico] });
            await interaction.reply({ content: "El mensaje se envió con éxito", ephemeral: true });
        } else {
            interaction.reply({ content: "No se encontró el usuario en el servidor", ephemeral: true });
        }
    }
});

// FUNCIÓN DENEGAR ACCESO
client.on("interactionCreate", async (interaction) => {
    if (interaction.commandName === "denegar-acceso") {
        const usuario = interaction.options.getUser("usuario-a-denegar");
        const guild = interaction.guild;
        const miembro = guild.members.cache.get(usuario.id);
        const razonDenegar = interaction.options.getString("razon-denegar-acceso") || "No se proporcionó una razón";

        const embedDenegarAcceso = new EmbedBuilder()
            .setColor("#8f1123")
            .setTitle("Su acceso al servidor ha sido denegado")
            .setAuthor({ name: "RedSide Community", iconURL: logo })
            .setDescription(`El acceso al servidor ha sido denegado. Razón: **${razonDenegar}**`)
            .setImage(Banner3)
            .setTimestamp()
            .setFooter({ text: "RedSide Community Staff", iconURL: logo });

        if (miembro) {
            await miembro.roles.set([ROL_ACCESO_DENEGADO]).catch(console.error);
            await usuario.send({ embeds: [embedDenegarAcceso] }).catch(console.error);
            await interaction.reply({ content: "El acceso fue denegado con éxito", ephemeral: true });
        } else {
            interaction.reply({ content: "No se encontró el usuario en el servidor", ephemeral: true });
        }
    }
});

client.login(BOT_TOKEN);
