import { Command, Structures, CommandClient } from 'detritus-client';
import { Permissions } from 'detritus-client/lib/constants';
import { BaseCommand } from '../basecommand';
import { BotLogs, EmbedColors } from '../../../utils/constants';
import CacheCollection from '../../../cache/CacheCollection';
import { Embed } from 'detritus-client/lib/utils';
export const COMMAND_NAME = 'log show';


export default class logShowCommand extends BaseCommand {
   constructor(client: CommandClient) {
      super(client, {
         name: COMMAND_NAME,
         aliases: ['l show'],
         disableDm: true,
         label: 'channel',
         metadata: {
            description: 'Muestra los canales establecidos en el servidor',
            usage: [`${COMMAND_NAME}`],
            type: 'Bot Config',
         },
         permissions: [Permissions.MANAGE_GUILD],
         permissionsClient: [Permissions.EMBED_LINKS],
      });
   }
   async run(context: Command.Context) {
      const document = CacheCollection.get(context.guildId)
      const embed = new Embed()
      embed.setTitle('Log Channels')
      embed.setColor(EmbedColors.MAIN)
      for(const _module of BotLogs){
         if(document.Channels[_module].length){
            embed.addField(_module, `• <#${document.Channels[_module]}>`, true)
         } else {
            embed.addField(_module, '`Sin Establecer`', true)
         }
      }
      return context.editOrReply({embeds: [embed]})
   }
}