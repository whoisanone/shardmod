import { CommandClient, CommandClientPrefixes } from 'detritus-client';
import { Context, Command } from 'detritus-client/lib/command';

import ShardClient from './client';
import CacheCollection, { cacheClass } from './cache/CacheCollection';

export class ShardBotCommandClient extends CommandClient {
    constructor() {
        super(ShardClient, {
            activateOnEdits: true,
            mentionsEnabled: true,
            prefix: 's!',
            ratelimits: [
                { duration: 60000, limit: 50, type: 'guild' },
                { duration: 5000, limit: 5, type: 'channel' },
            ],
        })
    }

    onPrefixCheck(context: Context){
        if(context.guildId){
           const guildPrefix = CacheCollection.get(context.guildId).Prefixes
           if(guildPrefix.length) return guildPrefix.map((prefix) => prefix); else return this.prefixes.custom;
        }
        return this.prefixes.custom
    }
    
    onMessageCheck(context: Context): boolean | Promise<boolean> {
        if(context.user.bot) return false;
        return true;
    }
    onCommandCheck(context: Context, command: Command<any>): boolean | Promise<boolean> {
        if (command.metadata.guildOwnerOnly) {
            if (context.member.isOwner || context.user.isClientOwner) {
                return true;
            } else {
                context.editOrReply('⚠ | Owner Only Command')
                return false;
            }
        }

        if (command.metadata.trustedOnly) {
            const guildData = CacheCollection.get(context.guildId)
            if (guildData.Users.Trusted.includes(context.userId) || context.member.isOwner || context.user.isClientOwner) {
                return true;
            } else {
                context.editOrReply('⚠ | Trusted Only Command')
                return false;
            }
        }
        return true;
    }
}