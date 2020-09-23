const{botGuild}=require('./config.json');
const{voice}=require("./channels.json");

exports.updateMemberSize=(client)=>{const guild = client.guilds.cache.get(botGuild);const allMembersChannel = client.channels.cache.get(voice.allMembers);const membersChannel = client.channels.cache.get(voice.members);const botsChannel = client.channels.cache.get(voice.bots);const members = guild.members.cache.filter(member => !member.user.bot).size;allMembersChannel.setName(`All members: ${guild.memberCount}`);membersChannel.setName(`Members: ${members}`);botsChannel.setName(`Bots: ${guild.memberCount - members}`);}
