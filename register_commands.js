require('dotenv').config()
const {REST, Routes, ApplicationCommandOptionType} = require('discord.js')
const commands = [
    {
        name: 'revisar',
        description: 'Envia un mensaje al canal en el cual es usado diciendo que pronto sera revisado por un staff',
        options: [
            {
                name: 'usuario-referido',
                description: 'a que usuario quieres mencionar',
                type: ApplicationCommandOptionType.User,
                required: true
            }
        ]
    },
    {
        name: 'formulario',
        description: 'Envia un mensaje al canal en el cual es usado (Form aceptado o rechazado)',
        options: [
            {
                name: 'form-status',
                description: 'Usar este comando si el formulario ha sido aceptado',
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: 'Aprobar',
                        value: 'aprobado'
                    },
                    {
                        name: 'Rechazar',
                        value: 'rechazado'
                    }
                ]
            },
            {
                name: 'usuario-mencionado',
                description: 'a que usuario quieres mencionar',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'razon-form',
                description: 'Breve razon del porque el formulario ha sido rechazado',
                type: ApplicationCommandOptionType.String,
                required: false
            }
        ]
    },
    {
        name: 'ficha',
        description: 'Aprobar o rechazar la ficha de pj de algun usuario',
        options: [
            {
                name: 'ficha-status',
                description: 'Usar este comando si el formulario ha sido aceptado',
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: 'Aprobar',
                        value: 'aprobado'
                    },
                    {
                        name: 'Rechazar',
                        value: 'rechazado'
                    }
                ]
            },
            {
                name: 'ficha-mencionado',
                description: 'a que usuario quieres mencionar',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'razon-ficha',
                description: 'Breve razon del porque el formulario ha sido rechazado',
                type: ApplicationCommandOptionType.String,
                required: false
            }
        ]
        
    },
    {
        name: 'denegar-acceso',
        description: 'Denega el acceso a un usuario a todo el servidor.',
        options: [
            {
                name: 'usuario-a-denegar',
                description: 'A que usuario quieres denegarle el acceso',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'razon-denegar-acceso',
                description: 'Breve razon del porque el usuario ha sido denegado',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
]
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('Slash commands were registered successfully!');
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();