const { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } = require("discord-akairo");
const config = require("./config.js");

var token, prefix;
token = require("./token.json").key;
console.log("Starting using locally stored value for token...");
prefix = config.prefix;

class MyClient extends AkairoClient {
	constructor() {
		super({
			ownerID: config.owner_id
		});

		this.commandHandler = new CommandHandler(
			this,
			{
				directory: "./commands/",
				prefix: prefix,
				argumentDefaults:{
					prompt:{
						timeout: message => `<@${message.author.id}> Time ran out, command has been cancelled.`,
						cancel: message => `<@${message.author.id}> Command has been cancelled.`,
						ended: message => `<@${message.author.id}> Too many retries, command has been cancelled.`,
						retries: 4,
						time: 30000
					}
				}
			}
		);
		this.commandHandler.resolver.addType('playername', (message, string) => {
			let isPlayer = false;
			for (let ply of players){
				if (string.toLowerCase() == ply.member.displayName.toLowerCase()) isPlayer = true;
			}
			if (isPlayer){
				return string;
			}
			return null;
		});
/*		this.inhibitorHandler = new InhibitorHandler(
			this,
			{
				directory: "./inhibitors/"
			}
		);*/
		this.listenerHandler = new ListenerHandler(
			this,
			{
				directory: "./listeners/"
			}
		);

		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		
		this.commandHandler.loadAll();
		//this.inhibitorHandler.loadAll();
		this.listenerHandler.loadAll();
		
	}
}

const client = new MyClient();

client.ownerID = 144543622015090690;

client.on("ready", () => {
	console.log('ready')
});

client.login(token);