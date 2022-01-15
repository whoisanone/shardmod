import { GatewayClientEvents } from 'detritus-client';
import { ClientEvents } from 'detritus-client/lib/constants';

import { BotModules } from '../utils/constants';
import { Model } from '../schemas/serverconfig';
import CacheCollection, { cacheClass } from './CacheCollection';

export class guildRoleDelete extends cacheClass {
   constructor() {
      super();
      this.client.on(
         ClientEvents.GUILD_ROLE_DELETE,
         async (payload: GatewayClientEvents.GuildRoleDelete) => {
            const data = CacheCollection.get(payload.guildId);
            if (!data) return;
            if (data.Roles.MuteRol.length) {
               const newData = await Model.findOneAndUpdate(
                  { ServerID: payload.guildId },
                  {
                     $set: { ["Roles.MuteRol"]: "" },
                  },
                  { new: true })
               CacheCollection.set(payload.guildId, newData);
            }

            for (const _module of BotModules) {
               const inWhitelist = this.checkWhitelist(
                  payload.guildId,
                  payload.roleId,
                  _module,
                  'Roles',
                  data
               );
               if (inWhitelist) {
                  const newData = await Model.findOneAndUpdate(
                     { ServerID: payload.guildId },
                     {
                        $pull: { [`Modules.${_module}.Whitelist.Roles`]: payload.roleId },
                     },
                     { new: true })
                  CacheCollection.set(payload.guildId, newData);
               }
            }

         }
      );
   }
}
export default new guildRoleDelete();
